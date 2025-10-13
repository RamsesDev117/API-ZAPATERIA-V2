import express from 'express'

import {
    registrarInventario,
    obtenerInventario
} from '../controllers/inventarioController.js';

import {
    verificarToken,
    verificarRol,
} from '../middlewares/authMiddleware.js';

const router = express.Router();

// Ruta para registrar inventarios --FUNCIONANDO--
router.post('/inventarios/create', verificarToken, verificarRol(['BODEGA']), registrarInventario);

// Ruta para obtener todo el inventario
router.get('/inventarios/get-all', verificarToken, verificarRol(['BODEGA']), obtenerInventario);

export default router;