//src/routes/inventarioRoutes.js

import express from 'express'

import {
    registrarInventario,
    obtenerInventario,
    getStockTotalPorProducto,
    escanearProducto
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

// Ruta para obtener todas las tallas de un zapato
router.get('/inventarios/producto-total/:id', verificarToken, verificarRol(['BODEGA']), getStockTotalPorProducto);

// --- NUEVA RUTA PARA EL PUNTO DE VENTA ---
router.get('/inventarios/escanear/:codigo', verificarToken, verificarRol(['BODEGA', 'TIENDA', 'ADMIN']), escanearProducto);

export default router;