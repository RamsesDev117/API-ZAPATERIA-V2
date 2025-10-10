import { Empleado } from '../models/Empleado.js'
import { Sucursal } from '../models/Sucursal.js'

export class EmpleadoService {

    //Registrar Empleado
    static async registrarEmpleado(datosEmpleado) {
        const { nombre_completo, estado, sucursal_id } = datosEmpleado;

        //Verificar que exista el id de la sucursal
        const sucursalExiste = await Sucursal.findByPk(sucursal_id);
        if (!sucursalExiste) {
            throw new Error('La sucursal especificada no existe');
        }

        //Verificar si el empleado ya existe
        const empleadoExistente = await Empleado.findOne({ where: { nombre_completo } });
        if (empleadoExistente) {
            throw new Error('El empleado ya esta registrado');
        }

        //Registrar al empleado
        const nuevoEmpleado = await Empleado.create({
            nombre_completo,
            estado: estado || 'ACTIVO',
            sucursal_id
        });

        //Obtener la informacion del empleado
        return await Empleado.findByPk(nuevoEmpleado.id, {
            include: [{
                model: Sucursal,
                as: 'sucursal',
                attributes: ['id', 'nombre']
            }],
            attributes: { exclude: ['createdAt'] }
        })
    }

    //Listar todos los empleados
    static async obtenerEmpleados() {
        return await Empleado.findAll({
            include: [{
                model: Sucursal,
                as: 'sucursal',
                attributes: ['id', 'nombre']
            }],
            attributes: { exclude: ['password'] },
            order: [['createdAt', 'ASC']]
        });
    }

    // Actualizar empleado
    static async actualizarEmpleado(id, datosActualizacion) {
        const { nombre_completo, estado, sucursal_id } = datosActualizacion;
        const empleado = await Empleado.findByPk(id);

        if (!empleado) {
            throw new Error('Empleado no encontrado');
        }

        // Verificar si la sucursal existe (si se está actualizando)
        if (sucursal_id) {
            const sucursalExistente = await Sucursal.findByPk(sucursal_id);
            if (!sucursalExistente) {
                throw new Error('La sucursal especificada no existe');
            }
        }

        // Verificar si el nuevo nombre ya existe (excluyendo el actual)
        if (nombre_completo && nombre_completo !== empleado.nombre_completo) {
            const empleadoExistente = await Empleado.findOne({ where: { nombre_completo } });
            if (empleadoExistente) {
                throw new Error('El nombre de empleado ya esta registrado');
            }
        }

        // Actualizar campos
        await empleado.update({
            nombre_completo: nombre_completo || empleado.nombre_completo,
            estado: estado || empleado.estado,
            sucursal_id: sucursal_id || empleado.sucursal_id
        });

        // Obtener el usuario actualizado
        return await Empleado.findByPk(id, {
            include: [{
                model: Sucursal,
                as: 'sucursal',
                attributes: ['id', 'nombre']
            }],
            attributes: { exclude: ['password'] }
        });
    }

    // Eliminar empleado (cambiar estado a INACTIVO)
    static async eliminarEmpleado(id) {
        const empleado = await Empleado.findByPk(id);

        if (!empleado) {
            throw new Error('Empleado no encontrado');
        }

        await empleado.update({ estado: 'INACTIVO' });
        return true;
    }

    // Restaurar empleado (cambiar estado a ACTIVO)
    static async restaurarEmpleado(id) {
        const empleado = await Empleado.findByPk(id);

        if (!empleado) {
            throw new Error('Empleado no encontrado');
        }

        await empleado.update({ estado: 'ACTIVO' });
        return true;
    }

}