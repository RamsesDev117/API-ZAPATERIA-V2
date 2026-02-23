import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const DetalleVenta = sequelize.define('DetalleVenta', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ventaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'venta_id',
        references: { model: 'ventas', key: 'id' }
    },
    inventarioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'inventario_id',
        references: { model: 'inventarios', key: 'id' }
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: { min: 1 }
    },
    precioUnitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'precio_unitario'
    },
    subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    // --- CAMBIO AQUÍ: Quitamos el "comment" para evitar el bug de Sequelize ---
    origenStock: {
        type: DataTypes.ENUM('Bodega', 'Tienda1', 'Tienda2'),
        allowNull: false,
        field: 'origen_stock'
    },
    empleadoBodegaId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'empleado_bodega_id',
        references: { model: 'empleados', key: 'id' }
    },
    // --- CAMBIO AQUÍ: Quitamos el "comment" también ---
    puntos: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    tableName: 'detalle_ventas',
    timestamps: true,
    underscored: true,
    hooks: {
        beforeSave: (detalle) => {
            detalle.subtotal = detalle.cantidad * detalle.precioUnitario;
        }
    }
});