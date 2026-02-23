// src/services/VentaService.js
import { sequelize } from "../config/database.js";
import { Venta } from "../models/Venta.js";
import { DetalleVenta } from "../models/DetalleVenta.js";
import { Inventario } from "../models/Inventario.js";
import { Producto } from "../models/Producto.js";
import { Op } from "sequelize";
import { Sucursal } from "../models/Sucursal.js";
import { Empleado } from "../models/Empleado.js";

export class VentaService {

    static async procesarVenta(datosVenta) {
        // Iniciamos una transacción para asegurar la integridad de los datos
        const t = await sequelize.transaction();

        try {
            const { sucursalId, empleadoId, metodoPago, articulos } = datosVenta;

            // 1. Calcular el total real iterando los artículos
            let totalVenta = 0;
            for (const item of articulos) {
                totalVenta += (item.cantidad * item.precioUnitario);
            }

            // 2. Crear el registro principal de la Venta
            const nuevaVenta = await Venta.create({
                sucursalId,
                empleadoId,
                metodoPago,
                total: totalVenta,
                estatus: 'Completada'
            }, { transaction: t });

            // 3. Procesar cada artículo del carrito
            for (const item of articulos) {

                // Bloqueamos la fila del inventario 
                const inventario = await Inventario.findByPk(item.inventarioId, {
                    transaction: t,
                    lock: t.LOCK.UPDATE
                });

                if (!inventario) {
                    throw new Error(`El inventario con ID ${item.inventarioId} no existe.`);
                }

                // 4. Determinar qué columna de stock vamos a descontar
                let columnaStock = '';
                if (item.origenStock === 'Bodega') columnaStock = 'bodegaStock';
                else if (item.origenStock === 'Tienda1') columnaStock = 'tienda1Stock';
                else if (item.origenStock === 'Tienda2') columnaStock = 'tienda2Stock';
                else throw new Error(`Origen de stock inválido: ${item.origenStock}`);

                // 5. Verificar que haya suficiente stock
                if (inventario[columnaStock] < item.cantidad) {
                    const productoTemp = await Producto.findByPk(inventario.productoId);
                    const modeloStr = productoTemp ? productoTemp.modelo : "Desconocido";

                    throw new Error(`Stock insuficiente en ${item.origenStock} para el modelo ${modeloStr} talla ${inventario.talla}. Stock actual: ${inventario[columnaStock]}`);
                }

                // 6. Descontar el stock 
                inventario[columnaStock] -= item.cantidad;
                await inventario.save({ transaction: t });

                // 7. Calcular Puntos
                const puntosGanados = item.empleadoBodegaId ? item.cantidad : 0;

                // 8. Crear el Detalle de la Venta
                await DetalleVenta.create({
                    ventaId: nuevaVenta.id,
                    inventarioId: item.inventarioId,
                    cantidad: item.cantidad,
                    precioUnitario: item.precioUnitario,
                    subtotal: item.cantidad * item.precioUnitario,
                    origenStock: item.origenStock,
                    empleadoBodegaId: item.empleadoBodegaId || null,
                    puntos: puntosGanados
                }, { transaction: t });
            }

            // Confirmamos la transacción
            await t.commit();

            // Retornamos simplemente la venta (sin el include que fallaba)
            return nuevaVenta;

        } catch (error) {
            // VERIFICACIÓN DE SEGURIDAD: Solo revertir si no se ha hecho commit
            if (!t.finished) {
                await t.rollback();
            }
            console.error('Error al procesar la venta en VentaService:', error);
            throw error;
        }
    }

    // --- NUEVO MÉTODO PARA LISTAR VENTAS ---
    static async obtenerVentas(filtrosQuery, usuarioLogueado) {
        try {
            const { sucursalId, empleadoId } = filtrosQuery;
            const whereVenta = {};

            // Verificamos el rol usando la estructura del usuario logueado
            // Nota: Dependiendo de cómo lo guardes en el token, puede ser usuarioLogueado.rol o usuarioLogueado.rol_nombre
            const rol = usuarioLogueado.rol_nombre || (usuarioLogueado.rol && usuarioLogueado.rol.rol) || 'TIENDA';

            if (rol === 'TIENDA') {
                // REGLA 1: Empleados de TIENDA solo ven sus propias ventas
                whereVenta.empleadoId = usuarioLogueado.empleado_id;

                if (usuarioLogueado.sucursal && usuarioLogueado.sucursal.id) {
                    whereVenta.sucursalId = usuarioLogueado.sucursal.id;
                }
            }
            else if (rol === 'ADMIN') {
                // REGLA 2: Administradores pueden ver todas, pero si envían filtros, se aplican
                if (sucursalId) {
                    whereVenta.sucursalId = sucursalId;
                }
                if (empleadoId) {
                    whereVenta.empleadoId = empleadoId;
                }
            }

            // Realizamos la consulta con TODAS las relaciones necesarias para pintar una tabla completa
            const ventas = await Venta.findAll({
                where: whereVenta,
                order: [['createdAt', 'DESC']], // Ordenamos de más reciente a más antigua
                include: [
                    {
                        model: Sucursal,
                        as: 'sucursal',
                        attributes: ['id', 'nombre']
                    },
                    {
                        model: Empleado,
                        as: 'vendedor',
                        attributes: ['id', 'nombre_completo']
                    },
                    {
                        model: DetalleVenta,
                        as: 'detalles',
                        include: [
                            {
                                model: Inventario,
                                as: 'inventario',
                                attributes: ['id', 'talla', 'skuTalla'],
                                include: [{
                                    model: Producto,
                                    as: 'producto',
                                    attributes: ['marca', 'modelo', 'color']
                                }]
                            }
                        ]
                    }
                ]
            });

            return ventas;

        } catch (error) {
            console.error('Error al obtener ventas en VentaService:', error);
            throw error;
        }
    }
}