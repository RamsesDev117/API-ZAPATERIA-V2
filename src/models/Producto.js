import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

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
            if (!producto.sku) {
                // Obtener las primeras 3 letras de la marca (en mayúsculas)
                const marcaCode = producto.marca
                    .substring(0, 3)
                    .toUpperCase()
                    .replace(/\s+/g, ''); // Eliminar espacios si los hay

                // Modelo completo (en mayúsculas, sin espacios)
                const modeloCode = producto.modelo
                    .toUpperCase()
                    .replace(/\s+/g, '');

                // Obtener las primeras 3 letras del color (en mayúsculas)
                const colorCode = producto.color
                    .substring(0, 3)
                    .toUpperCase()
                    .replace(/\s+/g, '');

                // Obtener las primeras 3 letras del material (en mayúsculas)
                const materialCode = producto.material
                    .substring(0, 3)
                    .toUpperCase()
                    .replace(/\s+/g, '');

                // Generar el SKU: MAR-MODELO-COL-MAT
                producto.sku = `${marcaCode}-${modeloCode}-${colorCode}-${materialCode}`;
            }
        }
    }
});