import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Inventario = sequelize.define('Inventario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    productoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'producto_id',
        references: {
            model: 'productos',
            key: 'id'
        }
    },
    talla: {
        type: DataTypes.DECIMAL(3, 1), // Para tallas como 8.5, 9, 10.5
        allowNull: false
    },
    skuTalla: {
        type: DataTypes.STRING(40),
        allowNull: false,
        field: 'sku_talla'
    },
    bodegaStock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'bodega_stock'
    },
    tienda1Stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'tienda1_stock'
    },
    tienda2Stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'tienda2_stock'
    },
    totalStock: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.bodegaStock + this.tienda1Stock + this.tienda2Stock;
        }
    },
    disponible: {
        type: DataTypes.VIRTUAL,
        get() {
            return this.totalStock > 0;
        }
    }
}, {
    tableName: 'inventarios',
    timestamps: true,
    underscored: true,
    indexes: [
        {
            unique: true,
            fields: ['producto_id', 'talla']
        }
    ]
})