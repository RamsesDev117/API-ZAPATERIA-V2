import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const CorteCaja = sequelize.define('CorteCaja', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    empleadoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'empleado_id',
        references: { model: 'empleados', key: 'id' }
    },
    sucursalId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'sucursal_id',
        references: { model: 'sucursales', key: 'id' }
    },
    fondoInicial: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'fondo_inicial',
        comment: 'Dinero en efectivo con el que se abre la caja'
    },
    // --- TOTALES CALCULADOS POR EL SISTEMA AL CERRAR ---
    totalEfectivo: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
        field: 'total_efectivo',
        comment: 'Suma de ventas en efectivo durante este turno'
    },
    totalTarjeta: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
        field: 'total_tarjeta',
        comment: 'Suma de ventas con tarjeta (Solo informativo)'
    },
    totalTransferencia: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00,
        field: 'total_transferencia',
        comment: 'Suma de ventas por transferencia (Solo informativo)'
    },
    // --- LO QUE CUENTA EL CAJERO ---
    efectivoDeclarado: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        field: 'efectivo_declarado',
        comment: 'El dinero físico que el cajero contó al cerrar'
    },
    diferencia: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Positivo (Sobrante), Negativo (Faltante), Cero (Cuadrado)'
    },
    // --- CONTROL DE TIEMPO Y ESTADO ---
    fechaApertura: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
        field: 'fecha_apertura'
    },
    fechaCierre: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'fecha_cierre'
    },
    estatus: {
        type: DataTypes.ENUM('ABIERTA', 'CERRADA'),
        defaultValue: 'ABIERTA',
        allowNull: false
    }
}, {
    tableName: 'cortes_caja',
    timestamps: true, // Nos dará createdAt y updatedAt automáticamente
    underscored: true
});