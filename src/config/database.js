// src/config/database.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Obtener la URL de la base de datos
const databaseURL = process.env.DATABASE_URL;

// Configuración para Sequelize
const sequelizeConfig = {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    timezone: "UTC"
};

// Crear instancia de Sequelize
export const sequelize = new Sequelize(databaseURL, sequelizeConfig);

// Función para conectar
export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Conectado a PostgreSQL en Railway');
        return sequelize;
    } catch (error) {
        console.error('❌ Error al conectar:', error.message);
        throw error;
    }
};