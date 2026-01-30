import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const PrintJob = sequelize.define('PrintJob', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // Aquí guardamos el JSON completo con la lista de etiquetas
    // Ejemplo: [{talla: "23", cantidad: 2}, {talla: "24", cantidad: 1}]
    data: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM("PENDING", "PRINTED", "FAILED"),
        defaultValue: "PENDING",
    },
    // Opcional: mensaje de error si el agente local reporta fallo
    error_message: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'print_jobs',
    timestamps: true
});