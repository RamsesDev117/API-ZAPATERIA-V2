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

// ==========================================
// Prefijo global en server.js: /api/v2
// ==========================================

// 1. REGISTRAR
// Ruta final: /api/v2/entradas/registrar
router.post('/entradas/registrar', verificarToken, verificarRol(['BODEGA']), registrarEntrada);

// 2. OBTENER HISTORIAL (GET)
// Ruta final: /api/v2/entradas
// Nota: Quitamos el "/get-entradas" redundante.
router.get('/entradas', verificarToken, verificarRol(['BODEGA']), getEntradas);

// 3. OBTENER DETALLE POR ID
// Ruta final: /api/v2/entradas/:id
router.get('/entradas/:id', verificarToken, verificarRol(['BODEGA']), getEntradaById);

export default router;