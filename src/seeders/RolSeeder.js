import { Rol } from '../models/Rol.js'
import { sequelize } from '../config/database.js';

export const seedRoles = async () => {
    try {
        await sequelize.sync();
        await Rol.bulkCreate([
            { rol: 'ADMIN' },
            { rol: 'TIENDA' },
            { rol: 'BODEGA' }
        ]);
        console.log('Roles seed completo');
        process.exit(0);
    } catch (error) {
        console.error('Error en el seed de Roles:', error);
        process.exit(1);
    }
}

// Ejecuta directamente el seeder
seedRoles();