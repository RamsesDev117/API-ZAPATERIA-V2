import { EmpleadoService } from "../services/empleadoService.js";

import {
    empleadoSchema,
    actualizarEmpleadoSchema,
    validar
} from "../validations/empleadoValidations.js";


//Registrar un nuevo empleado
export const registrarEmpleado = [
    validar(empleadoSchema),
    async (req, res) => {
        try {
            const empleado = await EmpleadoService.registrarEmpleado(req.body);

            res.status(201).json({
                success: true,
                message: 'Empleado registrado exitosamente',
                data: { empleado }
            });

        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
]

// Obtener todos los usuarios
export const obtenerEmpleados = async (req, res) => {
    try {
        const empleados = await EmpleadoService.obtenerEmpleados();
        res.status(200).json({ success: true, data: empleados });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Actualizar usuario
export const actualizarEmpleado = [
    validar(actualizarEmpleadoSchema),
    async (req, res) => {
        try {
            const empleado = await EmpleadoService.actualizarEmpleado(req.params.id, req.body);
            res.status(200).json({
                success: true,
                message: 'Empleado actualizado exitosamente',
                data: empleado
            });
        } catch (error) {
            const status = error.message.includes('no encontrado') ? 404 : 400;
            res.status(status).json({ success: false, message: error.message });
        }
    }
];

// Eliminar empleado
export const eliminarEmpleado = async (req, res) => {
    try {
        await EmpleadoService.eliminarEmpleado(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Empleado desactivado exitosamente'
        });
    } catch (error) {
        const status = error.message === 'Empleado no encontrado' ? 404 : 500;
        res.status(status).json({ success: false, message: error.message });
    }
};

// Restaurar empleado
export const restaurarEmpleado = async (req, res) => {
    try {
        await EmpleadoService.restaurarEmpleado(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Empleado activado exitosamente'
        });
    } catch (error) {
        const status = error.message === 'Empleado no encontrado' ? 404 : 500;
        res.status(status).json({ success: false, message: error.message });
    }
};