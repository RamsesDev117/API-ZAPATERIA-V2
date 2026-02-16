// src/models/DetalleEntrada.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const DetalleEntrada = sequelize.define('DetalleEntrada', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    talla: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    // Usamos camelCase para la propiedad de JS y field para la columna de BD
    entradaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'entrada_id', // Nombre real en la tabla
        references: {
            model: 'entradas',
            key: 'id'
        }
    },
    productoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'producto_id', // Nombre real en la tabla
        references: {
            model: 'productos',
            key: 'id'
        }
    }
}, {
    tableName: 'detalle_entradas',
    timestamps: false,
    underscored: true 
});