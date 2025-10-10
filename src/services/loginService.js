import { Usuario } from '../models/Usuario.js';
import { Rol } from '../models/Rol.js';
import { Empleado } from '../models/Empleado.js';
import { Sucursal } from '../models/Sucursal.js';
import bcrypt from 'bcrypt';
import { generarToken } from '../utils/jwtUtils.js';

export class LoginService {

    // Login de usuario con información completa
    static async loginUsuario(user, password) {
        const usuario = await Usuario.findOne({
            where: { user },
            include: [
                {
                    model: Rol,
                    as: 'rol',
                    attributes: ['id', 'rol']
                },
                {
                    model: Empleado,
                    as: 'empleado',
                    attributes: ['id', 'nombre_completo', 'estado'],
                    include: [{
                        model: Sucursal,
                        as: 'sucursal',
                        attributes: ['id', 'nombre', 'tipo'] // Ajusta según tu modelo Sucursal
                    }]
                }
            ]
        });

        if (!usuario) {
            throw new Error('Credenciales inválidas');
        }

        // Verificar contraseña
        const passwordValido = await bcrypt.compare(password, usuario.password);
        if (!passwordValido) {
            throw new Error('Credenciales inválidas');
        }

        // Verificar que el usuario esté activo
        if (usuario.estado !== 'ACTIVO') {
            throw new Error('Usuario inactivo');
        }

        // Verificar que el empleado esté activo (si existe)
        if (usuario.empleado && usuario.empleado.estado !== 'ACTIVO') {
            throw new Error('Empleado asociado inactivo');
        }

        // Generar token
        const token = generarToken(usuario);

        // Preparar respuesta
        const usuarioResponse = {
            id: usuario.id,
            user: usuario.user,
            estado: usuario.estado,
            tipo: usuario.tipo,
            empleado_id: usuario.empleado_id,
            rol_id: usuario.rol_id,
            createdAt: usuario.createdAt,
            updatedAt: usuario.updatedAt,
            rol: usuario.rol,
            empleado: usuario.empleado ? {
                id: usuario.empleado.id,
                nombre_completo: usuario.empleado.nombre_completo,
                estado: usuario.empleado.estado,
                sucursal: usuario.empleado.sucursal
            } : null
        };

        return { usuario: usuarioResponse, token };
    }
}