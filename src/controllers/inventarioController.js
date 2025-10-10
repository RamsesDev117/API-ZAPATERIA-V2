import { InventarioService } from "../services/inventarioService.js";

import {
    ItemInventarioSchema,
    InventarioArraySchema,
    ActualizarInventarioSchema,
    TransferenciaSchema,
    validar
} from '../validations/inventarioValidations.js'

export const registrarInventario = [
    // Validar según si es array o objeto individual
    (req, res, next) => {
        const schema = Array.isArray(req.body) ? InventarioArraySchema : ItemInventarioSchema;
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const errores = error.details.map(detail => ({
                campo: detail.path.join('.'),
                mensaje: detail.message
            }));

            return res.status(400).json({
                success: false,
                message: 'Errores de validación',
                errores
            });
        }
        next();
    },
    async (req, res) => {
        try {
            const datosInventario = req.body;

            // Si es un array, registrar múltiples items
            if (Array.isArray(datosInventario)) {
                const resultados = await InventarioService.registrarInventariosLote(datosInventario);

                // Si hay errores pero también éxitos, responder con advertencia
                if (resultados.resumen.fallidos > 0) {
                    res.status(207).json({
                        success: true,
                        message: `${resultados.creados} inventarios registrados, ${resultados.resumen.fallidos} fallaron`,
                        data: {
                            inventarios: resultados.inventarios,
                            resumen: resultados.resumen,
                            errores: resultados.errores
                        }
                    });
                } else {
                    res.status(201).json({
                        success: true,
                        message: `${resultados.creados} inventarios registrados exitosamente`,
                        data: {
                            inventarios: resultados.inventarios,
                            resumen: resultados.resumen
                        }
                    });
                }
            } else {
                // Si es un objeto, registrar uno solo
                const inventario = await InventarioService.registrarInventario(datosInventario);

                res.status(201).json({
                    success: true,
                    message: 'Inventario registrado exitosamente',
                    data: { inventario }
                });
            }

        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
];

// Obtener todo el inventario
export const obtenerInventario = async (req, res) => {
    try {
        const inventario = await InventarioService.obtenerTodoElInventario();

        // Si quieres manejar el caso de que no haya registros
        if (inventario.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No hay registros en el inventario',
                data: []
            });
        }

        res.status(200).json({
            success: true,
            count: inventario.length,
            data: inventario
        });
    } catch (error) {
        res.status(error.message === 'Inventario no encontrado' ? 404 : 500).json({
            success: false,
            message: error.message
        });
    }
}

