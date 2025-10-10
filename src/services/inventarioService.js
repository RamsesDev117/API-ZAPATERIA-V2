import { Inventario } from "../models/Inventario.js";
import { Producto } from "../models/Producto.js";
import { Op } from 'sequelize';

export class InventarioService {

    // Registrar nuevos inventarios
    static async registrarInventario(datosInventario) {
        try {
            const { producto_id, talla, sku_talla, bodega_stock = 0, tienda1_stock = 0, tienda2_stock = 0 } = datosInventario;

            // Validar que el producto exista
            const productoExistente = await Producto.findByPk(producto_id);
            if (!productoExistente) {
                throw new Error('El producto no existe');
            }

            // Validar que el producto esté activo
            if (!productoExistente.activo) {
                throw new Error('No se puede agregar inventario a un producto inactivo');
            }

            // Validar que no exista ya un inventario para este producto y talla
            const inventarioExistente = await Inventario.findOne({
                where: {
                    productoId: producto_id,
                    talla: talla
                }
            });

            if (inventarioExistente) {
                throw new Error(`Ya existe un registro de inventario para este producto con la talla ${talla}`);
            }

            // Validar que el SKU talla no esté duplicado
            const skuExistente = await Inventario.findOne({
                where: {
                    skuTalla: sku_talla,
                    productoId: { [Op.ne]: producto_id }
                }
            });

            if (skuExistente) {
                throw new Error('El SKU talla ya está en uso para otro producto');
            }

            // Crear el registro de inventario
            const nuevoInventario = await Inventario.create({
                productoId: producto_id,
                talla: parseFloat(talla),
                skuTalla: sku_talla,
                bodegaStock: parseInt(bodega_stock) || 0,
                tienda1Stock: parseInt(tienda1_stock) || 0,
                tienda2Stock: parseInt(tienda2_stock) || 0
            });

            // Retornar el inventario creado con los datos completos - CON ALIAS CORRECTO
            return await Inventario.findByPk(nuevoInventario.id, {
                include: [{
                    model: Producto,
                    as: 'producto', // ← ALIAS CORRECTO
                    attributes: ['id', 'marca', 'modelo', 'color', 'material', 'tipoCalzado']
                }],
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'productoId']
                }
            });

        } catch (error) {
            console.error('Error en registrarInventario:', error);

            if (error.name === 'SequelizeUniqueConstraintError') {
                if (error.fields && error.fields.producto_id) {
                    throw new Error('Ya existe un registro de inventario para este producto y talla');
                }
                if (error.fields && error.fields.sku_talla) {
                    throw new Error('El SKU talla ya está en uso');
                }
            }

            throw error;
        }
    }

    // Registrar múltiples inventarios en lote
    static async registrarInventariosLote(datosInventarios) {
        try {
            const resultados = {
                creados: 0,
                errores: [],
                inventarios: [],
                resumen: {
                    totalItems: datosInventarios.length,
                    exitosos: 0,
                    fallidos: 0
                }
            };

            // Validar y procesar cada item
            for (const [index, datos] of datosInventarios.entries()) {
                try {
                    // Validar que el producto exista
                    const productoExistente = await Producto.findByPk(datos.producto_id);
                    if (!productoExistente) {
                        throw new Error(`El producto con ID ${datos.producto_id} no existe`);
                    }

                    // Validar que el producto esté activo
                    if (!productoExistente.activo) {
                        throw new Error(`El producto con ID ${datos.producto_id} está inactivo`);
                    }

                    // Validar que no exista ya un inventario para este producto y talla
                    const inventarioExistente = await Inventario.findOne({
                        where: {
                            productoId: datos.producto_id,
                            talla: datos.talla
                        }
                    });

                    if (inventarioExistente) {
                        throw new Error(`Ya existe inventario para el producto ${datos.producto_id} con talla ${datos.talla}`);
                    }

                    // Validar que el SKU talla no esté duplicado
                    const skuExistente = await Inventario.findOne({
                        where: {
                            skuTalla: datos.sku_talla,
                            productoId: { [Op.ne]: datos.producto_id }
                        }
                    });

                    if (skuExistente) {
                        throw new Error(`El SKU talla ${datos.sku_talla} ya está en uso para otro producto`);
                    }

                    // Crear el registro
                    const nuevoInventario = await Inventario.create({
                        productoId: datos.producto_id,
                        talla: parseFloat(datos.talla),
                        skuTalla: datos.sku_talla,
                        bodegaStock: parseInt(datos.bodega_stock) || 0,
                        tienda1Stock: parseInt(datos.tienda1_stock) || 0,
                        tienda2Stock: parseInt(datos.tienda2_stock) || 0
                    });

                    // Obtener el inventario completo con producto - CON ALIAS CORRECTO
                    const inventarioCompleto = await Inventario.findByPk(nuevoInventario.id, {
                        include: [{
                            model: Producto,
                            as: 'producto', // ← ALIAS CORRECTO
                            attributes: ['id', 'marca', 'modelo', 'color', 'material', 'tipoCalzado']
                        }],
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'productoId']
                        }
                    });

                    resultados.inventarios.push(inventarioCompleto);
                    resultados.creados++;
                    resultados.resumen.exitosos++;

                } catch (error) {
                    resultados.errores.push({
                        index: index,
                        datos: datos,
                        error: error.message
                    });
                    resultados.resumen.fallidos++;
                }
            }

            // Si todos fallaron, lanzar error
            if (resultados.creados === 0 && datosInventarios.length > 0) {
                const mensajeError = `No se pudo registrar ningún inventario. Errores: ${resultados.errores.map(e => e.error).join(', ')}`;
                throw new Error(mensajeError);
            }

            return resultados;

        } catch (error) {
            console.error('Error en registrarInventariosLote:', error);
            throw error;
        }
    }

    // Método para verificar si ya existe inventario para un producto y talla
    static async verificarInventarioExistente(productoId, talla) {
        const inventario = await Inventario.findOne({
            where: {
                productoId: productoId,
                talla: talla
            }
        });
        return !!inventario;
    }

    // Método para verificar si un SKU talla ya existe
    static async verificarSkuTallaExistente(skuTalla, excludeProductoId = null) {
        const whereCondition = {
            skuTalla: skuTalla
        };

        if (excludeProductoId) {
            whereCondition.productoId = { [Op.ne]: excludeProductoId };
        }

        const inventario = await Inventario.findOne({ where: whereCondition });
        return !!inventario;
    }

    // Metodo para obtener todos los inventarios
    // Nuevo método para obtener todo el inventario
    static async obtenerTodoElInventario() {
        try {
            return await Inventario.findAll({
                include: [{
                    model: Producto,
                    as: 'producto',
                    attributes: ['id', 'marca', 'modelo', 'color', 'material', 'tipoCalzado', 'sku']
                }],
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'productoId']
                },
                order: [
                    ['productoId', 'ASC'],
                    ['talla', 'ASC']
                ]
            });

        } catch (error) {
            console.error('Error en obtenerTodoElInventario:', error);
            throw error;
        }
    }

    // Método para actualizar stocks - CON ALIAS CORRECTO
    static async actualizarStocks(id, stocks) {
        try {
            const { bodega_stock, tienda1_stock, tienda2_stock } = stocks;

            const inventario = await Inventario.findByPk(id);
            if (!inventario) {
                throw new Error('Registro de inventario no encontrado');
            }

            const actualizaciones = {};
            if (bodega_stock !== undefined) actualizaciones.bodegaStock = parseInt(bodega_stock);
            if (tienda1_stock !== undefined) actualizaciones.tienda1Stock = parseInt(tienda1_stock);
            if (tienda2_stock !== undefined) actualizaciones.tienda2Stock = parseInt(tienda2_stock);

            await inventario.update(actualizaciones);

            return await Inventario.findByPk(id, {
                include: [{
                    model: Producto,
                    as: 'producto', // ← ALIAS CORRECTO
                    attributes: ['id', 'marca', 'modelo', 'color', 'material', 'tipoCalzado']
                }],
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'productoId']
                }
            });

        } catch (error) {
            console.error('Error en actualizarStocks:', error);
            throw error;
        }
    }
}