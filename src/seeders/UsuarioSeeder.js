import { Usuario } from '../models/Usuario.js';
import { sequelize } from '../config/database.js';

const seedUsuarios = async () => {
    try {
        await sequelize.sync();

        await Usuario.bulkCreate([
            {
                user: 'admin',
                password: 'admin1234',
                rol_id: 1
            }
        ],{ individualHooks: true });

        console.log('Usuario seed completo (contraseña hasheada)');
        process.exit(0);
    } catch (error) {
        console.error('Error en el seed de Usuario:', error);
        process.exit(1);
    }
};

seedUsuarios();
