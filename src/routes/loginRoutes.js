import express from 'express'

import { loginUsuario } from '../controllers/loginController.js';

const router = express.Router();

router.post('/login', loginUsuario);

export default router;