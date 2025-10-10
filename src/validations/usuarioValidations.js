import Joi from 'joi';

export const usuarioSchema = Joi.object({
    user: Joi.string().alphanum().min(3).max(50).required().messages({
        'string.empty': 'El nombre de usuario es requerido',
        'string.alphanum': 'El usuario solo puede contener letras y números',
        'string.min': 'El usuario debe tener al menos 3 caracteres',
        'string.max': 'El usuario no puede exceder los 50 caracteres'
    }),
    password: Joi.string().min(6).max(100).required().messages({
        'string.empty': 'La contraseña es requerida',
        'string.min': 'La contraseña debe tener al menos 6 caracteres',
        'string.max': 'La contraseña no puede exceder los 100 caracteres'
    }),
    estado: Joi.string().valid('ACTIVO', 'INACTIVO').optional(),
    tipo: Joi.string().valid('ADMIN', 'EMPLEADO').optional(),
    empleado_id: Joi.number().integer().min(1).required().messages({
        'number.base': 'El ID del empleado debe ser un número',
        'number.min': 'El ID del empleado debe ser válido',
        'any.required': 'El empleado es requerido'
    }),
    rol_id: Joi.number().integer().min(1).required().messages({
        'number.base': 'El ID del rol debe ser un número',
        'number.min': 'El ID del rol debe ser válido',
        'any.required': 'El rol es requerido'
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