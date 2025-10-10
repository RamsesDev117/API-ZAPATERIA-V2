import Joi from "joi";

//Validacion para registrar productos
export const productoSchema = Joi.object({
    tipo_calzado: Joi.string().valid('Zapato de piso', 'Zapatillas', 'Plataformas', 'Botas', 'Sandalias').required(),
    marca: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'La marca es requerida',
        'string.min': 'La marca debe contener al menos 3 caracteres',
        'string.max': 'La marca no debe exceder 100 caracteres'
    }),
    modelo: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'El modelo es requerido',
        'string.min': 'El modelo debe contener al menos 3 caracteres',
        'string.max': 'El modelo no debe exceder 100 caracteres'
    }),
    color: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'El color es requerido',
        'string.min': 'El color debe contener al menos 3 caracteres',
        'string.max': 'El color no debe exceder 100 caracteres'
    }),
    material: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'El material es requerido',
        'string.min': 'El material debe contener al menos 3 caracteres',
        'string.max': 'El material no debe exceder 100 caracteres'
    }),
    precio: Joi.number().positive().precision(2).optional().messages({
        'number.base': 'El precio debe ser un número',
        'number.positive': 'El precio debe ser un número positivo',
        'number.precision': 'El precio debe tener máximo 2 decimales'
    }),
    descripcion: Joi.string().required().messages({
        'string.empty': 'La descripcion es requerida'
    }),
})

// Validacion para actualizar el precio de un producto
export const ActualizarPrecioSchema = Joi.object({
    precio: Joi.number().positive().precision(2).required().messages({ // Cambiado a required
        'number.base': 'El precio debe ser un número',
        'number.positive': 'El precio debe ser un número positivo',
        'number.precision': 'El precio debe tener máximo 2 decimales',
        'any.required': 'El precio es requerido'
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