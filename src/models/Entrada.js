import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Entrada = sequelize.define('Entrada', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fecha: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
    },
    tipo: {
        type: DataTypes.ENUM('NUEVO_MODELO', 'RESURTIDO'),
        allowNull: false
    },
    referencia: {
        type: DataTypes.STRING,
        allowNull: true
    },
    totalPares: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'total_pares'
    }
}, {
    tableName: 'entradas',
    timestamps: true,
    underscored: true
});