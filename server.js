import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, sequelize } from './src/config/database.js';

import './src/models/Usuario.js';
import './src/models/Rol.js'
import './src/models/Sucursal.js'
import './src/models/Empleado.js'
import './src/models/PrintJobs.js'

import { defineRelations } from './src/models/relaciones.js'
import loginUsuario from './src/routes/loginRoutes.js'
import empleadoRoutes from './src/routes/empleadoRoutes.js'
import usuarioRoutes from './src/routes/usuarioRoutes.js'
import productoRoutes from './src/routes/productoRoutes.js'
import inventarioRoutes from './src/routes/inventarioRoutes.js'
import entradaRoutes from './src/routes/entradaRoutes.js'
import printerRoutes from './src/routes/printerRoutes.js';
import ventaRoutes from './src/routes/ventaRoutes.js';
import corteCajaRoutes from './src/routes/corteCajaRoutes.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
let dbConnected = false;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas básicas
app.get('/', (req, res) => {
    res.json({
        message: 'API de Zapateria',
        version: '2.0.0',
        database: dbConnected ? 'Conectado a Railway' : 'Desconectado',
        environment: process.env.NODE_ENV || 'development'
    });
});

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        database: dbConnected ? 'Conectado' : 'Desconectado',
        timestamp: new Date().toISOString()
    });
});

//Rutas de la api
app.use('/api/v2', loginUsuario);
app.use('/api/v2', empleadoRoutes);
app.use('/api/v2', usuarioRoutes);
app.use('/api/v2', productoRoutes);
app.use('/api/v2', inventarioRoutes);
app.use('/api/v2', entradaRoutes);
app.use('/api/v2', ventaRoutes);
app.use('/api/v2', corteCajaRoutes);
app.use('/api/v2', printerRoutes);

// Manejo de errores
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use((error, req, res, next) => {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Sincronizar modelos
const syncDatabase = async () => {
    try {
        defineRelations();
        const options = process.env.NODE_ENV === 'production'
            ? {} // En producción: solo crear si no existen
            : { alter: true }; // En desarrollo: alterar tablas

        await sequelize.sync(options);
        console.log('📦 Base de datos sincronizada');
        return true;
    } catch (error) {
        console.error('❌ Error sincronizando BD:', error);
        return false;
    }
};

// Inicializar servidor
const startServer = async () => {
    try {
        try {
            await connectDB();
            dbConnected = true;
            console.log('✅ Conexión a BD establecida');

            // Sincronizar modelos
            const syncSuccess = await syncDatabase();
            if (!syncSuccess) {
                console.warn('⚠️  Sincronización de modelos falló');
            }

        } catch (dbError) {
            console.warn('⚠️  Servidor sin conexión a BD');
            dbConnected = false;
        }

        app.listen(PORT, () => {
            console.log('='.repeat(50));
            console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
            console.log(`🗄️  Base de datos: ${dbConnected ? 'Conectada' : 'Desconectada'}`);
            console.log(`🌿 Entorno: ${process.env.NODE_ENV || 'development'}`);
            console.log('='.repeat(50));
        });
    } catch (error) {
        console.error('❌ Error al iniciar servidor:', error);
        process.exit(1);
    }
};

startServer();