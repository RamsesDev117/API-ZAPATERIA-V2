import { Usuario } from "./Usuario.js";
import { Sucursal } from "./Sucursal.js";
import { Rol } from "./Rol.js";
import { Empleado } from "./Empleado.js";
import { Producto } from "./Producto.js";
import { Inventario } from "./Inventario.js";
import { Venta } from "./Venta.js";
import { DetalleVenta } from "./DetalleVenta.js";
import { Entrada } from "./Entrada.js";
import { DetalleEntrada } from "./DetalleEntrada.js";
import { CorteCaja } from "./CorteCaja.js";

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

    // Una Sucursal tiene muchas Ventas
    Sucursal.hasMany(Venta, {
        foreignKey: 'sucursal_id', as: 'ventas'
    });
    Venta.belongsTo(Sucursal, {
        foreignKey: 'sucursal_id', as: 'sucursal'
    });

    // Un Empleado realiza muchas Ventas
    Empleado.hasMany(Venta, {
        foreignKey: 'empleado_id', as: 'ventas_realizadas'
    });
    Venta.belongsTo(Empleado, {
        foreignKey: 'empleado_id', as: 'vendedor'
    });

    // Una Venta tiene muchos Detalles (muchos zapatos)
    Venta.hasMany(DetalleVenta, {
        foreignKey: 'venta_id', as: 'detalles'
    });
    DetalleVenta.belongsTo(Venta, {
        foreignKey: 'venta_id', as: 'venta'
    });

    // Un Detalle de Venta corresponde a un item del Inventario (un SKU-Talla específico)
    Inventario.hasMany(DetalleVenta, {
        foreignKey: 'inventario_id', as: 'ventas_detalle'
    });
    DetalleVenta.belongsTo(Inventario, {
        foreignKey: 'inventario_id', as: 'inventario'
    });

    // Una Entrada (Factura/Lote) tiene muchos detalles (muchos zapatos distintos)
    Entrada.hasMany(DetalleEntrada, {
        foreignKey: 'entrada_id',
        as: 'detalles'
    });
    DetalleEntrada.belongsTo(Entrada, {
        foreignKey: 'entrada_id',
        as: 'entrada'
    });

    // Un Producto aparece en muchos detalles de entrada (historial de compras)
    Producto.hasMany(DetalleEntrada, {
        foreignKey: 'producto_id',
        as: 'historial_entradas'
    });
    DetalleEntrada.belongsTo(Producto, {
        foreignKey: 'producto_id',
        as: 'producto'
    });

    // Un Empleado (cajero) hace muchos Cortes de Caja
    Empleado.hasMany(CorteCaja, {
        foreignKey: 'empleado_id', as: 'cortes_caja'
    });
    CorteCaja.belongsTo(Empleado, {
        foreignKey: 'empleado_id', as: 'cajero'
    });

    // Una Sucursal tiene muchos Cortes de Caja
    Sucursal.hasMany(CorteCaja, {
        foreignKey: 'sucursal_id', as: 'cortes_caja'
    });
    CorteCaja.belongsTo(Sucursal, {
        foreignKey: 'sucursal_id', as: 'sucursal'
    });

}