import { Sucursal } from '../models/Sucursal.js'
import { sequelize } from '../config/database.js';

export const seedSucursales = async () => {
    try {
        await sequelize.sync();
        await Sucursal.bulkCreate([
            { nombre: 'TIENDA 1', tipo: 'TIENDA' },
            { nombre: 'TIENDA 2', tipo: 'TIENDA' },
            { nombre: 'BODEGA', tipo: 'BODEGA' },
        ]);
        console.log('Sucursales seed completo');
        process.exit(0);
    } catch (error) {
        console.error('Error en el seed de Sucursales:', error);
        process.exit(1);
    }
}

// Ejecuta directamente el seeder
seedSucursales();