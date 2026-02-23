// src/controllers/ventaController.js

import { VentaService } from "../services/VentaService.js";
import { EmpleadoService } from "../services/empleadoService.js"

export const crearVenta = async (req, res) => {
    try {
        const datosVenta = req.body;

        // 1. Validaciones básicas
        if (!datosVenta.sucursalId || !datosVenta.empleadoId || !datosVenta.metodoPago) {
            return res.status(400).json({
                success: false,
                message: "Faltan datos generales de la venta (sucursal, cajero o método de pago)."
            });
        }

        if (!datosVenta.articulos || !Array.isArray(datosVenta.articulos) || datosVenta.articulos.length === 0) {
            return res.status(400).json({
                success: false,
                message: "El carrito no puede estar vacío."
            });
        }

        // 2. Procesar la venta
        const ventaProcesada = await VentaService.procesarVenta(datosVenta);

        // 3. Respuesta exitosa
        return res.status(201).json({
            success: true,
            message: "Venta procesada y stock descontado correctamente.",
            data: ventaProcesada
        });

    } catch (error) {
        console.error("Error en crearVenta Controller:", error);
        return res.status(400).json({
            success: false,
            message: error.message || "Ocurrió un error al intentar procesar la venta."
        });
    }
};

export const getEmpleadosBodega = async (req, res) => {
    try {
        const empleados = await EmpleadoService.obtenerEmpleadosBodega();
        res.status(200).json({ success: true, data: empleados });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al obtener empleados de bodega" });
    }
};

export const getSucursales = async (req, res) => {
    try {
        const sucursales = await EmpleadoService.obtenerSucursales();
        res.status(200).json({ success: true, data: sucursales });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al obtener sucursales" });
    }
};

// --- NUEVO CONTROLADOR ---
export const getVentas = async (req, res) => {
    try {
        // Obtenemos el usuario decodificado por el middleware verificarToken
        const usuarioLogueado = req.usuario;

        // Obtenemos los filtros de la URL (ej: ?sucursalId=2)
        const filtrosQuery = req.query;

        // Llamamos al servicio
        const ventas = await VentaService.obtenerVentas(filtrosQuery, usuarioLogueado);

        return res.status(200).json({
            success: true,
            cantidad: ventas.length,
            data: ventas
        });

    } catch (error) {
        console.error("Error en getVentas Controller:", error);
        return res.status(500).json({
            success: false,
            message: "Error interno del servidor al obtener el listado de ventas."
        });
    }
};