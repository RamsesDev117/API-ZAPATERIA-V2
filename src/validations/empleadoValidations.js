import Joi from "joi";

export const empleadoSchema = Joi.object({
    nombre_completo: Joi.string().min(2).max(100).required().messages({
        'string.empty': 'El nombre completo es requerido',
        'string.min': 'El nombre debe tener al menos 2 caracteres',
        'string.max': 'El nombre no puede exceder los 100 caracteres'
    }),
    estado: Joi.string().valid('ACTIVO', 'INACTIVO').optional(),
    sucursal_id: Joi.number().integer().min(1).required().messages({
        'number.base': 'El ID de la sucursal debe ser un número',
        'number.min': 'El ID de la sucursal debe ser válido',
        'any.required': 'La sucursal es requerida'
    })
})

export const actualizarEmpleadoSchema = Joi.object({
    nombre_completo: Joi.string().min(2).max(100).optional(),
    estado: Joi.string().valid('ACTIVO', 'INACTIVO').optional(),
    sucursal_id: Joi.number().integer().min(1).optional()
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