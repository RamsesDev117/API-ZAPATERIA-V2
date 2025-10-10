import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Rol = sequelize.define('Rol',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    rol: {
        type: DataTypes.ENUM("ADMIN", "TIENDA", "BODEGA"),
        allowNull: false,
    }
},{
    tableName: 'roles',
    timestamps: true
});