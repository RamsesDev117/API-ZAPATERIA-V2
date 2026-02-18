// src/controllers/printerController.js
import { PrintJob } from '../models/PrintJobs.js'; // Asegúrate que la ruta sea correcta

// 1. Recibe la orden desde el Frontend (React)
export const crearOrdenImpresion = async (req, res) => {
    try {
        // Ahora esperamos un objeto 'payload' completo o 'listaEtiquetas' por compatibilidad
        const { listaEtiquetas, tipo_etiqueta, datos } = req.body;

        let dataAGuardar = [];

        // CASO 1: Frontend envía el formato antiguo (Array directo de etiquetas de caja)
        if (listaEtiquetas && Array.isArray(listaEtiquetas)) {
            // Les inyectamos el tipo por defecto si no lo traen
            dataAGuardar = listaEtiquetas.map(item => ({
                ...item,
                tipo_etiqueta: item.tipo_etiqueta || 'CAJA'
            }));
        }
        // CASO 2: Frontend envía el nuevo formato (Objeto con configuración)
        else if (datos) {
            // Si es un objeto único (ej. una etiqueta colgante), lo envolvemos en array
            if (!Array.isArray(datos)) {
                dataAGuardar = [{
                    ...datos,
                    tipo_etiqueta: tipo_etiqueta || 'CAJA'
                }];
            } else {
                dataAGuardar = datos.map(item => ({
                    ...item,
                    tipo_etiqueta: tipo_etiqueta || item.tipo_etiqueta || 'CAJA'
                }));
            }
        }
        else {
            return res.status(400).json({
                success: false,
                message: "Formato de datos inválido. Se requiere 'listaEtiquetas' o 'datos'."
            });
        }

        // GUARDAR EN BD
        // Guardamos el array procesado en el campo JSON 'data'
        const nuevoTrabajo = await PrintJob.create({
            data: dataAGuardar,
            status: 'PENDING'
        });

        return res.status(200).json({
            success: true,
            message: "Orden enviada a la cola.",
            jobId: nuevoTrabajo.id
        });

    } catch (error) {
        console.error("Error al crear orden:", error);
        return res.status(500).json({
            success: false,
            message: "Error interno.",
            error: error.message
        });
    }
};

// 2. [PARA EL AGENTE] Consulta trabajos pendientes
export const obtenerTrabajosPendientes = async (req, res) => {
    try {
        // Buscar todos los trabajos que no se han impreso
        const trabajos = await PrintJob.findAll({
            where: { status: 'PENDING' },
            order: [['createdAt', 'ASC']] // Los más viejos primero (FIFO)
        });

        res.status(200).json(trabajos);

    } catch (error) {
        console.error("Error obteniendo pendientes:", error);
        res.status(500).json({ message: error.message });
    }
};

// 3. [PARA EL AGENTE] Confirma que ya imprimió
export const confirmarTrabajoImpreso = async (req, res) => {
    try {
        const { id, status } = req.body; // status puede ser 'PRINTED' o 'FAILED'

        const trabajo = await PrintJob.findByPk(id);

        if (!trabajo) {
            return res.status(404).json({ message: "Trabajo no encontrado" });
        }

        // Actualizamos el estado
        trabajo.status = status || 'PRINTED';
        await trabajo.save();

        res.status(200).json({ success: true });

    } catch (error) {
        console.error("Error confirmando trabajo:", error);
        res.status(500).json({ message: error.message });
    }
};