import { Producto } from "../models/Producto.js";

export class ProductoService {

    // Registrar nuevo producto
    static async registrarProducto(datosProducto) {
        try {
            const { tipo_calzado, marca, modelo, color, material, precio, descripcion } = datosProducto;

            // Validaciones básicas
            if (!marca || !modelo || !color || !material) {
                throw new Error('Faltan campos obligatorios');
            }

            // Crear producto (el hook generará automáticamente el SKU)
            const nuevoProducto = await Producto.create({
                tipoCalzado: tipo_calzado,
                marca,
                modelo,
                color,
                material,
                precio: parseFloat(precio),
                descripcion
            });

            // Retornar producto sin campos temporales
            return await Producto.findByPk(nuevoProducto.id, {
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            });

        } catch (error) {
            // Manejar error de SKU duplicado
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new Error('El SKU generado ya existe. Intente con datos diferentes.');
            }
            throw error;
        }
    }

    // Método adicional para verificar si un SKU existe
    static async verificarSkuExistente(sku) {
        const producto = await Producto.findOne({ where: { sku } });
        return !!producto;
    }

    // Método para obtener todos los productos
    static async obtenerProductos() {
        return await Producto.findAll({
            where: { activo: true },
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            order: [['id', 'ASC']]
        });
    }

    // Actualizar el precio de un producto - VERSIÓN CORREGIDA
    static async actualizarPrecio(id, datosPrecio) {
        try {
            const { precio } = datosPrecio;

            // Buscar el producto
            const producto = await Producto.findByPk(id);

            // Validar que el producto exista
            if (!producto) {
                throw new Error('Producto no encontrado');
            }

            // Validar que el producto esté activo
            if (!producto.activo) {
                throw new Error('No se puede actualizar el precio de un producto inactivo');
            }

            // Actualizar el precio
            await producto.update({
                precio: parseFloat(precio)
            });

            // Obtener el producto actualizado
            return await Producto.findByPk(id, {
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            });

        } catch (error) {
            console.error('Error en actualizarPrecio:', error);
            throw error;
        }
    }

    // --- NUEVO MÉTODO: Actualizar datos generales del producto ---
    static async actualizarProducto(id, datosActualizados) {
        try {
            // Extraemos los datos que permitimos editar
            const { marca, modelo, material, color, tipo_calzado, descripcion } = datosActualizados;

            // 1. Buscar el producto
            const producto = await Producto.findByPk(id);

            if (!producto) {
                throw new Error('Producto no encontrado');
            }

            // 2. Actualizar los campos
            // Sequelize solo actualizará los campos que hayan cambiado.
            // Nota: Si tienes un hook 'beforeUpdate' en tu modelo que regenera el SKU 
            // basado en marca/modelo/color, el SKU cambiará automáticamente aquí.
            await producto.update({
                marca: marca || producto.marca,
                modelo: modelo || producto.modelo,
                material: material || producto.material,
                color: color || producto.color,
                tipoCalzado: tipo_calzado || producto.tipoCalzado, // Opcional si lo envías
                descripcion: descripcion !== undefined ? descripcion : producto.descripcion
            });

            // 3. Retornar el producto actualizado
            return await Producto.findByPk(id, {
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            });

        } catch (error) {
            console.error('Error en actualizarProducto:', error);

            // Si al editar se genera un SKU que ya existe (ej. cambias a un modelo que ya tenías registrado)
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new Error('La combinación de Marca, Modelo y Color genera un SKU que ya existe.');
            }
            throw error;
        }
    }
}