import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import bcrypt from "bcrypt";

export const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    estado: {
        type: DataTypes.ENUM("ACTIVO", "INACTIVO"),
        defaultValue: "ACTIVO",
    },
    tipo: {
        type: DataTypes.ENUM("ADMIN", "EMPLEADO"),
        allowNull: false,
        defaultValue: "EMPLEADO"
    },
    empleado_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true,
        references: {
            model: 'empleados',
            key: 'id'
        }
    },
    rol_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'roles',
            key: 'id'
        }
    }
}, {
    tableName: 'usuarios',
    timestamps: true,
    hooks: {
        beforeCreate: async (usuario) => {
            if (usuario.password) {
                const salt = await bcrypt.genSalt(10);
                usuario.password = await bcrypt.hash(usuario.password, salt);
            }
        },
        beforeUpdate: async (usuario) => {
            if (usuario.changed("password")) {
                const salt = await bcrypt.genSalt(10);
                usuario.password = await bcrypt.hash(usuario.password, salt);
            }
        },
    },
});