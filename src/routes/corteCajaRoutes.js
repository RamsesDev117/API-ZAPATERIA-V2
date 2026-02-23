// src/routes/corteCajaRoutes.js
import express from 'express';

import {
    verificarEstadoCaja,
    abrirCaja,
    obtenerResumen,
    cerrarCaja
} from '../controllers/corteCajaController.js';

import { verificarToken, verificarRol } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas las rutas requieren estar logueado y ser cajero o admin
// GET: Saber si tengo que mostrar el modal de pedir dinero o si ya está abierta
router.get('/caja/estado', verificarToken, verificarRol(['ADMIN', 'TIENDA']), verificarEstadoCaja);

// POST: Mandar el dinero inicial
router.post('/caja/abrir', verificarToken, verificarRol(['ADMIN', 'TIENDA']), abrirCaja);

// GET: Para la pantalla final, ver cuánto vendí
router.get('/caja/resumen', verificarToken, verificarRol(['ADMIN', 'TIENDA']), obtenerResumen);

// POST: Terminar el día
router.post('/caja/cerrar', verificarToken, verificarRol(['ADMIN', 'TIENDA']), cerrarCaja);

export default router;