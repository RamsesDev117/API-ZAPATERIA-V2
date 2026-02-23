// src/controllers/corteCajaController.js

import { CorteCajaService } from "../services/corteCajaService.js";

export const verificarEstadoCaja = async (req, res) => {
    try {
        const empleadoId = req.usuario.empleado_id;

        if (!empleadoId) {
            return res.status(400).json({ success: false, message: "El usuario no tiene un perfil de empleado asignado." });
        }

        const cajaAbierta = await CorteCajaService.verificarCajaAbierta(empleadoId);

        return res.status(200).json({
            success: true,
            cajaAbierta: !!cajaAbierta, // Devuelve true si existe, false si es null
            data: cajaAbierta || null
        });
    } catch (error) {
        console.error("Error en verificarEstadoCaja Controller:", error);
        return res.status(500).json({ success: false, message: "Error al verificar el estado de la caja." });
    }
};

export const abrirCaja = async (req, res) => {
    try {
        const empleadoId = req.usuario.empleado_id;
        // Extraemos la sucursal del token. Si es un Admin puro, le asignamos la sucursal 1 por defecto para que no truene.
        const sucursalId = req.usuario.sucursal?.id || 1;
        const { fondoInicial } = req.body;

        if (!empleadoId) {
            return res.status(400).json({ success: false, message: "El usuario no tiene un perfil de empleado asignado." });
        }

        if (fondoInicial === undefined || fondoInicial === null || isNaN(fondoInicial) || fondoInicial < 0) {
            return res.status(400).json({ success: false, message: "Debe proporcionar un fondo inicial válido." });
        }

        const nuevaCaja = await CorteCajaService.abrirCaja({
            empleadoId,
            sucursalId,
            fondoInicial
        });

        return res.status(201).json({
            success: true,
            message: "Caja abierta exitosamente. ¡Buen turno!",
            data: nuevaCaja
        });

    } catch (error) {
        console.error("Error en abrirCaja Controller:", error);
        return res.status(400).json({ success: false, message: error.message || "Error al intentar abrir la caja." });
    }
};

export const obtenerResumen = async (req, res) => {
    try {
        const empleadoId = req.usuario.empleado_id;

        if (!empleadoId) {
            return res.status(400).json({ success: false, message: "El usuario no tiene un perfil de empleado asignado." });
        }

        const resumen = await CorteCajaService.obtenerResumenCorte(empleadoId);

        return res.status(200).json({
            success: true,
            data: resumen
        });

    } catch (error) {
        console.error("Error en obtenerResumen Controller:", error);
        return res.status(400).json({ success: false, message: error.message || "Error al obtener el resumen de caja." });
    }
};

export const cerrarCaja = async (req, res) => {
    try {
        const empleadoId = req.usuario.empleado_id;
        const { efectivoDeclarado } = req.body;

        if (!empleadoId) {
            return res.status(400).json({ success: false, message: "El usuario no tiene un perfil de empleado asignado." });
        }

        if (efectivoDeclarado === undefined || efectivoDeclarado === null || isNaN(efectivoDeclarado) || efectivoDeclarado < 0) {
            return res.status(400).json({ success: false, message: "Debe ingresar una cantidad válida de efectivo físico." });
        }

        const cajaCerrada = await CorteCajaService.cerrarCaja(empleadoId, efectivoDeclarado);

        return res.status(200).json({
            success: true,
            message: "Corte de caja realizado exitosamente.",
            data: cajaCerrada
        });

    } catch (error) {
        console.error("Error en cerrarCaja Controller:", error);
        return res.status(400).json({ success: false, message: error.message || "Error al intentar cerrar la caja." });
    }
};