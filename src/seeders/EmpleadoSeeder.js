import { Empleado } from '../models/Empleado.js';
import { sequelize } from '../config/database.js';

const seedEmpleados = async () => {
    try {
        await sequelize.sync();

        await Empleado.bulkCreate([
            {
                nombre_completo: 'Administrador',
                password: 'admin1234', // aquí se aplicará el hash
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

seedEmpleados();
