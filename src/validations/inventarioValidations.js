import Joi from "joi";

// Validación para un solo item de inventario
export const ItemInventarioSchema = Joi.object({
    producto_id: Joi.number().integer().min(1).required().messages({
        'number.base': 'El ID del producto debe ser un número',
        'number.min': 'El ID del producto debe ser válido',
        'any.required': 'El ID del producto es requerido'
    }),
    talla: Joi.number().positive().min(1).max(50).precision(1).required().messages({
        'number.base': 'La talla debe ser un número',
        'number.positive': 'La talla debe ser un número positivo',
        'number.min': 'La talla debe ser mayor o igual a 1',
        'number.max': 'La talla no puede ser mayor a 50',
        'number.precision': 'La talla debe tener máximo 1 decimal',
        'any.required': 'La talla es requerida'
    }),
    sku_talla: Joi.string().min(3).max(40).required().messages({
        'string.empty': 'El SKU talla es requerido',
        'string.min': 'El SKU talla debe contener al menos 3 caracteres',
        'string.max': 'El SKU talla no debe exceder 40 caracteres'
    }),
    bodega_stock: Joi.number().integer().min(0).max(10000).default(0).messages({
        'number.base': 'El stock de bodega debe ser un número',
        'number.integer': 'El stock de bodega debe ser un número entero',
        'number.min': 'El stock de bodega no puede ser negativo',
        'number.max': 'El stock de bodega no puede exceder 10000'
    }),
    tienda1_stock: Joi.number().integer().min(0).max(10000).default(0).messages({
        'number.base': 'El stock de tienda 1 debe ser un número',
        'number.integer': 'El stock de tienda 1 debe ser un número entero',
        'number.min': 'El stock de tienda 1 no puede ser negativo',
        'number.max': 'El stock de tienda 1 no puede exceder 10000'
    }),
    tienda2_stock: Joi.number().integer().min(0).max(10000).default(0).messages({
        'number.base': 'El stock de tienda 2 debe ser un número',
        'number.integer': 'El stock de tienda 2 debe ser un número entero',
        'number.min': 'El stock de tienda 2 no puede ser negativo',
        'number.max': 'El stock de tienda 2 no puede exceder 10000'
    })
});

// Validación para un array de inventarios
export const InventarioArraySchema = Joi.array().items(ItemInventarioSchema).min(1).max(100).messages({
    'array.base': 'El inventario debe ser un arreglo',
    'array.min': 'Debe enviar al menos un item de inventario',
    'array.max': 'No puede enviar más de 100 items a la vez'
});

// Schema para actualizar inventario (campos opcionales)
export const ActualizarInventarioSchema = Joi.object({
    bodega_stock: Joi.number().integer().min(0).max(10000).optional().messages({
        'number.base': 'El stock de bodega debe ser un número',
        'number.integer': 'El stock de bodega debe ser un número entero',
        'number.min': 'El stock de bodega no puede ser negativo',
        'number.max': 'El stock de bodega no puede exceder 10000'
    }),
    tienda1_stock: Joi.number().integer().min(0).max(10000).optional().messages({
        'number.base': 'El stock de tienda 1 debe ser un número',
        'number.integer': 'El stock de tienda 1 debe ser un número entero',
        'number.min': 'El stock de tienda 1 no puede ser negativo',
        'number.max': 'El stock de tienda 1 no puede exceder 10000'
    }),
    tienda2_stock: Joi.number().integer().min(0).max(10000).optional().messages({
        'number.base': 'El stock de tienda 2 debe ser un número',
        'number.integer': 'El stock de tienda 2 debe ser un número entero',
        'number.min': 'El stock de tienda 2 no puede ser negativo',
        'number.max': 'El stock de tienda 2 no puede exceder 10000'
    })
});

// Schema para transferencias entre ubicaciones
export const TransferenciaSchema = Joi.object({
    desde: Joi.string().valid('bodega_stock', 'tienda1_stock', 'tienda2_stock').required().messages({
        'any.only': 'La ubicación de origen debe ser: bodega_stock, tienda1_stock o tienda2_stock',
        'any.required': 'La ubicación de origen es requerida'
    }),
    hacia: Joi.string().valid('bodega_stock', 'tienda1_stock', 'tienda2_stock').required().messages({
        'any.only': 'La ubicación de destino debe ser: bodega_stock, tienda1_stock o tienda2_stock',
        'any.required': 'La ubicación de destino es requerida'
    }),
    cantidad: Joi.number().integer().min(1).max(10000).required().messages({
        'number.base': 'La cantidad debe ser un número',
        'number.integer': 'La cantidad debe ser un número entero',
        'number.min': 'La cantidad debe ser al menos 1',
        'number.max': 'La cantidad no puede exceder 10000',
        'any.required': 'La cantidad es requerida'
    })
}).custom((value, helpers) => {
    // Validar que no sea la misma ubicación
    if (value.desde === value.hacia) {
        return helpers.error('any.invalid', { message: 'No se puede transferir a la misma ubicación' });
    }
    return value;
});

// Middleware de validación (ya lo tienes bien)
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