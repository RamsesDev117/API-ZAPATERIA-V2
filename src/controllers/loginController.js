import { LoginService } from "../services/loginService.js";
import { loginSchema, validar } from "../validations/loginValidations.js";

// Login de usuario
export const loginUsuario = [
    validar(loginSchema),
    async (req, res) => {
        try {
            const { user, password } = req.body;
            const resultado = await LoginService.loginUsuario(user, password);

            res.status(200).json({
                success: true,
                message: 'Login exitoso',
                data: resultado
            });
        } catch (error) {
            res.status(401).json({ success: false, message: error.message });
        }
    }
];