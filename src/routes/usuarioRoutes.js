import express from 'express'

import { registrarUsuario } from '../controllers/usuarioController.js'

import {
    verificarToken,
    verificarRol,
} from '../middlewares/authMiddleware.js';

const router = express.Router();

//Ruta para registrar nuevos usuarios //FUNCIONANDO
router.post('/usuarios/create-usuarios', verificarToken, verificarRol(['ADMIN']), registrarUsuario);

export default router;