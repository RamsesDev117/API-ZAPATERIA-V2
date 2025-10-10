import { Usuario } from "./Usuario.js";
import { Sucursal } from "./Sucursal.js";
import { Rol } from "./Rol.js";
import { Empleado } from "./Empleado.js";
import { Producto } from "./Producto.js";
import { Inventario } from "./Inventario.js";

//Definimos nuestras relaciones
export const defineRelations = () => {

    // Sucursal tiene muchos Empleados
    Sucursal.hasMany(Empleado, {
        foreignKey: 'sucursal_id',
        as: 'empleados'
    });
    Empleado.belongsTo(Sucursal, {
        foreignKey: 'sucursal_id',
        as: 'sucursal'
    });

    // Empleado tiene un Usuario
    Empleado.hasOne(Usuario, {
        foreignKey: 'empleado_id',
        as: 'usuario'
    });
    Usuario.belongsTo(Empleado, {
        foreignKey: 'empleado_id',
        as: 'empleado'
    });

    // Rol tiene muchos Usuarios
    Rol.hasMany(Usuario, {
        foreignKey: 'rol_id',
        as: 'usuarios'
    });
    Usuario.belongsTo(Rol, {
        foreignKey: 'rol_id',
        as: 'rol'
    });

    // Un producto tiene muchos inventarios
    Producto.hasMany(Inventario, {
        foreignKey: 'producto_id',
        as: 'inventarios'
    });
    Inventario.belongsTo(Producto, {
        foreignKey: 'producto_id',
        as: 'producto'
    })


}