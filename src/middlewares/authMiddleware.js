import jwt from 'jsonwebtoken';
import { Usuario } from '../models/Usuario.js';
import { Rol } from '../models/Rol.js';

// Middleware para verificar el token JWT
export const verificarToken = async (req, res, next) => {
    try {
        // Obtener el token del header
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Acceso denegado. Token no proporcionado.'
            });
        }

        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Buscar el usuario con su rol
        const usuario = await Usuario.findByPk(decoded.id, {
            include: [{
                model: Rol,
                as: 'rol',
                attributes: ['id', 'rol']
            }],
            attributes: { exclude: ['password'] }
        });

        if (!usuario) {
            return res.status(401).json({
                success: false,
                message: 'Token inválido. Usuario no encontrado.'
            });
        }

        if (usuario.estado !== 'ACTIVO') {
            return res.status(401).json({
                success: false,
                message: 'Usuario inactivo.'
            });
        }

        // Agregar el usuario a la request
        req.usuario = usuario;
        next();

    } catch (error) {
        console.error('Error en verificarToken:', error);

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token inválido.'
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expirado.'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error al verificar token.'
        });
    }
};

// Middleware para verificar roles específicos
export const verificarRol = (rolesPermitidos = []) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no autenticado.'
            });
        }

        if (!req.usuario.rol) {
            return res.status(403).json({
                success: false,
                message: 'Usuario sin rol asignado.'
            });
        }

        const rolUsuario = req.usuario.rol.rol;

        if (!rolesPermitidos.includes(rolUsuario)) {
            return res.status(403).json({
                success: false,
                message: `Acceso denegado. Se requiere uno de estos roles: ${rolesPermitidos.join(', ')}`
            });
        }

        next();
    };
};

// Middleware para verificar si es el mismo usuario o admin
export const verificarUsuarioOAdmin = (req, res, next) => {
    if (!req.usuario) {
        return res.status(401).json({
            success: false,
            message: 'Usuario no autenticado.'
        });
    }

    const userId = parseInt(req.params.id);
    const esMismoUsuario = req.usuario.id === userId;
    const esAdmin = req.usuario.rol?.rol === 'ADMIN';

    if (esMismoUsuario || esAdmin) {
        return next();
    }

    res.status(403).json({
        success: false,
        message: 'Solo puedes realizar esta acción sobre tu propio usuario o siendo administrador.'
    });
};

// Middleware opcional para tokens (no bloquea si no hay token)
export const tokenOpcional = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const usuario = await Usuario.findByPk(decoded.id, {
                include: [{
                    model: Rol,
                    as: 'rol',
                    attributes: ['id', 'rol']
                }],
                attributes: { exclude: ['password'] }
            });

            if (usuario && usuario.estado === 'ACTIVO') {
                req.usuario = usuario;
            }
        }

        next();
    } catch (error) {
        // No bloquear si el token es inválido en modo opcional
        next();
    }
};