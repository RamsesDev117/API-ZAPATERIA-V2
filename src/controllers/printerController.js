// src/controllers/printerController.js
import { PrintJob } from '../models/PrintJobs.js'; // Asegúrate que la ruta sea correcta

// 1. Recibe la orden desde el Frontend (React)
export const crearOrdenImpresion = async (req, res) => {
    try {
        const { listaEtiquetas } = req.body;

        // Validaciones básicas
        if (!listaEtiquetas || !Array.isArray(listaEtiquetas) || listaEtiquetas.length === 0) {
            return res.status(400).json({
                success: false,
                message: "La lista de etiquetas es inválida o está vacía."
            });
        }

        // GUARDAR en la base de datos (Cola de impresión)
        // Sequelize guardará el array automáticamente en el campo JSON
        const nuevoTrabajo = await PrintJob.create({
            data: listaEtiquetas,
            status: 'PENDING'
        });

        return res.status(200).json({
            success: true,
            message: "Orden enviada a la cola de impresión.",
            jobId: nuevoTrabajo.id
        });

    } catch (error) {
        console.error("Error al crear orden de impresión:", error);
        return res.status(500).json({
            success: false,
            message: "Error interno al guardar la orden.",
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