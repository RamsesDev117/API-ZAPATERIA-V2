import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Sucursal = sequelize.define('Sucursal',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tipo: {
        type: DataTypes.ENUM( "BODEGA", "TIENDA"),
        allowNull: false,
    }
},{
    tableName: 'sucursales',
    timestamps: true
});