// src/routes/printerRoutes.js
import express from 'express';
// Importamos las 3 funciones nuevas del controlador
import {
    crearOrdenImpresion,
    obtenerTrabajosPendientes,
    confirmarTrabajoImpreso
} from '../controllers/printerController.js';

const router = express.Router();

// --- 1. RUTA PARA EL FRONTEND (React) ---
// El frontend envía aquí la lista de etiquetas.
// Antes esto imprimía directo, ahora solo GUARDARÁ en la base de datos.
// Mantenemos la ruta exacta que ya configuraste en tu frontend para no romper nada.
router.post('/printer/imprimir-etiquetas', crearOrdenImpresion);


// --- 2. RUTAS PARA EL AGENTE LOCAL (Tu PC Windows) ---

// El agente consultará aquí (GET) cada 5 segundos para ver si hay trabajos 'PENDING'
// Ruta completa: /api/v2/printer/pending-jobs (dependiendo de tu app.js)
router.get('/printer/pending-jobs', obtenerTrabajosPendientes);

// El agente enviará aquí (POST) la confirmación cuando termine de imprimir
// Ruta completa: /api/v2/printer/confirm-job
router.post('/printer/confirm-job', confirmarTrabajoImpreso);

export default router;