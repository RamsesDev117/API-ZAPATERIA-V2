import { ProductoService } from "../services/productoService.js";

import {
    productoSchema,
    ActualizarPrecioSchema,
    validar
} from "../validations/productoValidations.js";

//Metodo para registrar zapatos
export const registrarProducto = [
    validar(productoSchema),
    async (req, res) => {
        try {
            const producto = await ProductoService.registrarProducto(req.body);

            res.status(201).json({
                success: true,
                message: 'Zapato registrado exitosamente',
                data: { producto }
            });

        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
]

//Obtener todos los zapatos
export const obtenerProductos = async (req, res) => {
    try {
        const productos = await ProductoService.obtenerProductos();
        res.status(200).json({ success: true, data: productos });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Actualizar usuario
export const actualizarPrecio = [
    validar(ActualizarPrecioSchema),
    async (req, res) => {
        try {
            const producto = await ProductoService.actualizarPrecio(req.params.id, req.body);
            res.status(200).json({
                success: true,
                message: 'Precio actualizado exitosamente',
                data: producto
            });
        } catch (error) {
            const status = error.message.includes('no encontrado') ? 404 : 400;
            res.status(status).json({ success: false, message: error.message });
        }
    }
];