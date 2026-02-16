import { sequelize } from "../config/database.js";
import { Op } from "sequelize";
import { Entrada } from "../models/Entrada.js";
import { DetalleEntrada } from "../models/DetalleEntrada.js";
import { Producto } from "../models/Producto.js";
import { Inventario } from "../models/Inventario.js";

export class EntradaService {
    static async registrarEntrada(datos) {
        const t = await sequelize.transaction();

        try {
            const { tipo, referencia, productoDatos, items } = datos;

            // 1. Crear el Encabezado
            const totalPares = items.reduce((acc, item) => acc + parseInt(item.cantidad), 0);
            const nuevaEntrada = await Entrada.create({
                tipo,
                referencia,
                totalPares,
                fecha: new Date()
            }, { transaction: t });

            let productoIdGlobal = null;

            // 2. Modelo Nuevo
            if (tipo === 'NUEVO_MODELO') {
                if (!productoDatos) throw new Error('Faltan datos del producto.');
                const nuevoProducto = await Producto.create({ ...productoDatos, activo: true }, { transaction: t });
                productoIdGlobal = nuevoProducto.id;
            }

            // 3. Procesar Items
            for (const item of items) {
                const idProductoAUsar = productoIdGlobal || item.producto_id;

                if (!idProductoAUsar) throw new Error(`Falta ID de producto para talla ${item.talla}`);

                // A. Historial: USAR camelCase coincidiendo con el modelo corregido
                await DetalleEntrada.create({
                    entradaId: nuevaEntrada.id,
                    productoId: idProductoAUsar,
                    talla: item.talla,
                    cantidad: item.cantidad
                }, { transaction: t });

                // B. Inventario: USAR camelCase
                const inventarioExistente = await Inventario.findOne({
                    where: {
                        productoId: idProductoAUsar,
                        talla: item.talla
                    },
                    transaction: t
                });

                if (inventarioExistente) {
                    await inventarioExistente.increment('bodegaStock', { by: item.cantidad, transaction: t });
                } else {
                    const prod = await Producto.findByPk(idProductoAUsar, { transaction: t });
                    await Inventario.create({
                        productoId: idProductoAUsar,
                        talla: item.talla,
                        skuTalla: `${prod.sku}-${item.talla.replace('.', '')}`,
                        bodegaStock: item.cantidad,
                        tienda1Stock: 0,
                        tienda2Stock: 0
                    }, { transaction: t });
                }
            }

            await t.commit();
            return { success: true, message: 'Entrada registrada', entradaId: nuevaEntrada.id, productoId: productoIdGlobal };

        } catch (error) {
            await t.rollback();
            console.error("Error en registrarEntrada:", error);
            throw error;
        }
    }

    /**
     * Obtiene entradas con filtros de TIPO y FECHAS
     * @param {Object} filtros - { tipo, fecha, fechaInicio, fechaFin }
     */
    static async obtenerEntradas(filtros = {}) {
        try {
            const whereClause = {};

            // 1. Filtro por Tipo (RESURTIDO / NUEVO_MODELO)
            if (filtros.tipo) {
                whereClause.tipo = filtros.tipo;
            }

            // 2. Filtro por Fecha Exacta (ej: '2024-02-17')
            if (filtros.fecha) {
                whereClause.fecha = filtros.fecha;
            }

            // 3. Filtro por Rango de Fechas (ej: del '2024-02-01' al '2024-02-28')
            // Nota: Esto sobrescribe el filtro anterior si se envían ambos
            if (filtros.fechaInicio && filtros.fechaFin) {
                whereClause.fecha = {
                    [Op.between]: [filtros.fechaInicio, filtros.fechaFin]
                };
            }

            const entradas = await Entrada.findAll({
                where: whereClause,
                include: [
                    {
                        model: DetalleEntrada,
                        as: 'detalles',
                        include: [{
                            model: Producto,
                            as: 'producto',
                            attributes: ['id', 'marca', 'modelo', 'color', 'sku']
                        }]
                    }
                ],
                // Ordenar: primero las más recientes
                order: [['fecha', 'DESC'], ['createdAt', 'DESC']]
            });

            return entradas;
        } catch (error) {
            console.error("Error al obtener entradas:", error);
            throw error;
        }
    }

    /**
     * Obtiene una entrada específica por ID con todos sus detalles
     */
    static async obtenerEntradaPorId(id) {
        try {
            const entrada = await Entrada.findByPk(id, {
                include: [
                    {
                        model: DetalleEntrada,
                        as: 'detalles',
                        include: [
                            {
                                model: Producto,
                                as: 'producto'
                            }
                        ]
                    }
                ]
            });

            if (!entrada) throw new Error('Entrada no encontrada');
            return entrada;
        } catch (error) {
            throw error;
        }
    }

}

