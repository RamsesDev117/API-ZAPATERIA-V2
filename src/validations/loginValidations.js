import Joi from "joi";

export const loginSchema = Joi.object({
    user: Joi.string().required().messages({
        'string.empty': 'El nombre de usuario es requerido'
    }),
    password: Joi.string().required().messages({
        'string.empty': 'La contraseña es requerida'
    })
});

// Middleware de validación
export const validar = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const errores = error.details.map(detail => ({
                campo: detail.path.join('.'),
                mensaje: detail.message
            }));

            return res.status(400).json({
                success: false,
                message: 'Errores de validación',
                errores
            });
        }

        next();
    };
};