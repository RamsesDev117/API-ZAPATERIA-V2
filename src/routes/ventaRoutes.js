import express from 'express'

import {
    crearVenta,
    getEmpleadosBodega,
    getSucursales,
    getVentas
} from "../controllers/ventaController.js"

import {
    verificarToken,
    verificarRol,
    verificarUsuarioOAdmin
} from '../middlewares/authMiddleware.js';


const router = express.Router();

// Ruta para procesar la venta final
router.post('/ventas/create', verificarToken, verificarRol(['ADMIN', 'TIENDA']), crearVenta);

router.get('/ventas/empleados-bodega', verificarToken, verificarRol(['ADMIN', 'TIENDA']), getEmpleadosBodega);
router.get('/ventas/sucursales', verificarToken, verificarRol(['ADMIN', 'TIENDA']), getSucursales);

// --- NUEVA RUTA PARA LISTAR VENTAS ---
router.get('/ventas/list', verificarToken, verificarRol(['ADMIN', 'TIENDA']), getVentas);

export default router;