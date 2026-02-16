import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

// Función auxiliar para limpiar y generar partes del código
const cleanString = (str) => {
    return (str || '')
        .toUpperCase()       // Convertir a mayúsculas
        .replace(/\s+/g, '') // Quitar espacios
        .substring(0, 3);    // Tomar las primeras 3 letras (excepto para modelo que tomamos todo)
};

const cleanModelo = (str) => {
    return (str || '').toUpperCase().replace(/\s+/g, '');
};

export const Producto = sequelize.define('Producto', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tipoCalzado: {
        type: DataTypes.ENUM('Zapato de piso', 'Zapatillas', 'Plataformas', 'Botas', 'Sandalias'),
        allowNull: false,
        field: 'tipo_calzado'
    },
    marca: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    modelo: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    color: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    material: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
    },
    sku: {
        type: DataTypes.STRING(80),
        unique: true,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'es_activo'
    }
}, {
    tableName: 'productos',
    timestamps: true,
    underscored: true,
    hooks: {
        beforeValidate: (producto) => {
            // Esta condición cubre AMBOS casos: registro nuevo Y edición de campos clave
            if (
                !producto.sku ||
                producto.changed('marca') ||
                producto.changed('modelo') ||
                producto.changed('color') ||
                producto.changed('material')
            ) {
                const marcaCode = cleanString(producto.marca);
                const modeloCode = cleanModelo(producto.modelo);
                const colorCode = cleanString(producto.color);
                const materialCode = cleanString(producto.material);

                // Generar el SKU: MAR-MODELO-COL-MAT
                producto.sku = `${marcaCode}-${modeloCode}-${colorCode}-${materialCode}`;
            }
        }
    }
});