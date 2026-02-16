import { Router } from 'express';
import {
    registrarEntrada,
    getEntradas,
    getEntradaById
} from '../controllers/entradaController.js';

import {
    verificarToken,
    verificarRol,
} from '../middlewares/authMiddleware.js';

const router = Router();

// POST http://localhost:4000/api/v2/entradas/registrar
router.post('/entradas/registrar', verificarToken, verificarRol(['BODEGA']), registrarEntrada);

/**
 * @route   GET /api/v2/entradas
 * @desc    Obtiene el historial de entradas.
 * @query   ?tipo=RESURTIDO (Opcional)
 * @query   ?fecha=2024-02-16 (Opcional - Fecha exacta)
 * @query   ?fechaInicio=2024-02-01&fechaFin=2024-02-28 (Opcional - Rango)
 */
router.get('/entradas/get-entradas', verificarToken, verificarRol(['BODEGA']), getEntradas);

/**
 * @route   GET /api/v2/entradas/:id
 * @desc    Obtiene el detalle completo de una entrada específica por su ID
 * Incluye los productos y tallas de esa factura/lote.
 */
router.get('/entradas/get-entradas/:id', verificarToken, verificarRol(['BODEGA']), getEntradaById);

export default router;