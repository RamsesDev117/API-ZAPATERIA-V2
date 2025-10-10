import { Usuario } from "../models/Usuario.js";
import { Rol } from "../models/Rol.js";
import { Empleado } from "../models/Empleado.js";

export class UsuarioService {

    //Registrar usuario
    static async registrarUsuario(datosUsuario) {
        const { user, password, estado, tipo, empleado_id, rol_id } = datosUsuario;

        //Verificar que exista el id del empleado
        const empleadoExiste = await Empleado.findByPk(empleado_id);
        if (!empleadoExiste) {
            throw new Error('El empleado especificado no esta registrado');
        }

        //Verificar que exista el rol asignado
        const rolExiste = await Rol.findByPk(rol_id);
        if (!rolExiste) {
            throw new Error('El rol especificado no existe');
        }

        //Verificar si el usuario ya existe
        const usuarioExistente = await Usuario.findOne({ where: { user } });
        if (usuarioExistente) {
            throw new Error('El usuario ya esta registrado');
        }

        // Crear el usuario
        const nuevoUsuario = await Usuario.create({
            user,
            password,
            estado: estado || 'ACTIVO',
            tipo,
            empleado_id,
            rol_id
        });

        // Obtener el usuario con la información del rol
        return await Usuario.findByPk(nuevoUsuario.id, {
            include: [{
                model: Rol,
                as: 'rol',
                attributes: ['id', 'rol']
            },
            {
                model: Empleado,
                as: 'empleado',
                attributes: ['id', "nombre_completo"]
            }],
            attributes: { exclude: ['password'] }
        });
    }

};