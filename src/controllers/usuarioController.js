import { UsuarioService } from "../services/usuarioService.js";

import {
    usuarioSchema,
    validar
} from '../validations/usuarioValidations.js'

//Registrar un nuevo usuario
export const registrarUsuario = [
    validar(usuarioSchema),
    async (req, res) => {
        try {
            const usuario = await UsuarioService.registrarUsuario(req.body);

            res.status(201).json({
                success: true,
                message: 'Usuario registrado exitosamente',
                data: { usuario}
            });

        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
]