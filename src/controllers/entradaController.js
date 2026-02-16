import { EntradaService } from "../services/entradaService.js";

export const registrarEntrada = async (req, res) => {
    try {
        // req.body debe traer { tipo, referencia, items, productoDatos (opcional) }
        const resultado = await EntradaService.registrarEntrada(req.body);

        res.status(201).json(resultado);

    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const getEntradas = async (req, res) => {
    try {
        // Extraemos todos los posibles filtros de la URL
        const { tipo, fecha, fechaInicio, fechaFin } = req.query;

        // Se los pasamos al servicio
        const entradas = await EntradaService.obtenerEntradas({
            tipo,
            fecha,
            fechaInicio,
            fechaFin
        });

        res.status(200).json({
            success: true,
            data: entradas
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener el historial de entradas'
        });
    }
};

export const getEntradaById = async (req, res) => {
    try {
        const { id } = req.params;
        const entrada = await EntradaService.obtenerEntradaPorId(id);

        res.status(200).json({
            success: true,
            data: entrada
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};