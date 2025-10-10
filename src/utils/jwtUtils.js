import jwt from 'jsonwebtoken';

// Generar token JWT
export const generarToken = (usuario) => {
    const payload = {
        id: usuario.id,
        user: usuario.user,
        rol: usuario.rol_id
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    });
};

// Verificar token JWT
export const verificarToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error('Token inválido');
    }
};

// Decodificar token sin verificar (útil para obtener info)
export const decodificarToken = (token) => {
    return jwt.decode(token);
};