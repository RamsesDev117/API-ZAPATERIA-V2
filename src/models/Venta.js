import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Venta = sequelize.define('Venta', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // Es vital saber en qué sucursal se hizo para descontar del stock correcto (tienda1 o tienda2)
    sucursalId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'sucursal_id',
        references: {
            model: 'sucursales',
            key: 'id'
        }
    },
    empleadoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'empleado_id',
        references: {
            model: 'empleados',
            key: 'id'
        }
    },
    fecha: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    metodoPago: {
        type: DataTypes.ENUM('Efectivo', 'Tarjeta', 'Transferencia'),
        allowNull: false,
        field: 'metodo_pago'
    },
    estatus: {
        type: DataTypes.ENUM('Completada', 'Cancelada', 'Devolucion'),
        defaultValue: 'Completada',
        allowNull: false
    }
}, {
    tableName: 'ventas',
    timestamps: true,
    underscored: true
});