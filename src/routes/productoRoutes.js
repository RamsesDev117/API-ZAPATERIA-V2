import express from 'express'

import {
    registrarProducto,
    obtenerProductos,
    actualizarPrecio,
    actualizarInfoProducto
} from '../controllers/productoController.js';

import {
    verificarToken,
    verificarRol
} from '../middlewares/authMiddleware.js';

const router = express.Router();

//Ruta para registrar nuevos zapatos --FUNCIONANDO--
router.post('/zapatos/create-zapatos', verificarToken, verificarRol(['BODEGA']), registrarProducto);

//Ruta para obtener todos los zapatos --FUNCIONANDO--
router.get('/zapatos/get-all', verificarToken, verificarRol(['BODEGA']), obtenerProductos);

// Ruta para actualizar el precio de un producto --FUNCIONANDO--
router.put('/zapatos/update-precio/:id', verificarToken, verificarRol(['BODEGA']), actualizarPrecio);

// Ruta para actualizar un zapato
router.put('/zapatos/update-producto/:id', verificarToken, verificarRol(['BODEGA']), actualizarInfoProducto);

export default router;