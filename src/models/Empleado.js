import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Empleado = sequelize.define('Empleado', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre_completo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    estado: {
        type: DataTypes.ENUM("ACTIVO", "INACTIVO"),
        defaultValue: "ACTIVO",
    },
    sucursal_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'sucursales',
            key: 'id'
        }
    }
}, {
    tableName: 'empleados',
    timestamps: true
});