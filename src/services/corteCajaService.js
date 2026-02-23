// src/services/corteCajaService.js
import { CorteCaja } from "../models/CorteCaja.js";
import { Venta } from "../models/Venta.js";
import { Op } from "sequelize";

export class CorteCajaService {

    // 1. Verificar si el empleado ya tiene una caja abierta
    // (Útil para saber si React debe mostrarle o no el modal de Fondo Inicial)
    static async verificarCajaAbierta(empleadoId) {
        try {
            const cajaAbierta = await CorteCaja.findOne({
                where: {
                    empleadoId: empleadoId,
                    estatus: 'ABIERTA'
                }
            });
            return cajaAbierta;
        } catch (error) {
            console.error('Error al verificar caja abierta:', error);
            throw new Error('Error al verificar el estado de la caja.');
        }
    }

    // 2. Abrir una nueva caja (iniciar turno)
    static async abrirCaja(datosApertura) {
        const { empleadoId, sucursalId, fondoInicial } = datosApertura;

        try {
            // Validar que no tenga otra caja abierta
            const cajaExistente = await this.verificarCajaAbierta(empleadoId);
            if (cajaExistente) {
                throw new Error('El usuario ya tiene un turno abierto. Debe cerrarlo antes de abrir uno nuevo.');
            }

            // Crear el registro de apertura
            const nuevaCaja = await CorteCaja.create({
                empleadoId: empleadoId,
                sucursalId: sucursalId,
                fondoInicial: parseFloat(fondoInicial),
                fechaApertura: new Date(),
                estatus: 'ABIERTA'
            });

            return nuevaCaja;
        } catch (error) {
            console.error('Error al abrir la caja:', error);
            throw error;
        }
    }

    // 3. Obtener el resumen actual (La matemática pura antes de cerrar)
    // Esto se usa en la vista de "Corte de Caja" para mostrarle cuánto lleva vendido.
    static async obtenerResumenCorte(empleadoId) {
        try {
            // Buscamos la caja abierta actual
            const cajaAbierta = await this.verificarCajaAbierta(empleadoId);
            if (!cajaAbierta) {
                throw new Error('No hay ninguna caja abierta para este usuario.');
            }

            // Buscamos TODAS las ventas Completadas de este empleado, desde que abrió su caja hoy
            const ventasDelTurno = await Venta.findAll({
                where: {
                    empleadoId: empleadoId,
                    estatus: 'Completada',
                    createdAt: {
                        [Op.gte]: cajaAbierta.fechaApertura // gte = Greater Than or Equal (Mayor o igual a)
                    }
                }
            });

            // Inicializamos contadores
            let ventasEfectivo = 0;
            let ventasTarjeta = 0;
            let ventasTransferencia = 0;

            // Sumamos dependiendo del método de pago
            ventasDelTurno.forEach(venta => {
                const monto = parseFloat(venta.total);
                if (venta.metodoPago === 'Efectivo') ventasEfectivo += monto;
                else if (venta.metodoPago === 'Tarjeta') ventasTarjeta += monto;
                else if (venta.metodoPago === 'Transferencia') ventasTransferencia += monto;
            });

            const fondoInicial = parseFloat(cajaAbierta.fondoInicial);
            // El número mágico: ¡Lo que debe haber físicamente en el cajón!
            const efectivoEsperado = fondoInicial + ventasEfectivo;

            return {
                corteCajaId: cajaAbierta.id,
                fechaApertura: cajaAbierta.fechaApertura,
                fondoInicial: fondoInicial,
                ventasEfectivo: ventasEfectivo,
                ventasTarjeta: ventasTarjeta,
                ventasTransferencia: ventasTransferencia,
                efectivoEsperado: efectivoEsperado
            };
        } catch (error) {
            console.error('Error al obtener resumen de corte:', error);
            throw error;
        }
    }

    // 4. Cerrar la caja definitivamente (Fin del turno)
    static async cerrarCaja(empleadoId, efectivoDeclarado) {
        try {
            // 1. Obtenemos las matemáticas calculadas
            const resumen = await this.obtenerResumenCorte(empleadoId);

            // 2. Buscamos el registro en la BD
            const caja = await CorteCaja.findByPk(resumen.corteCajaId);

            // 3. Calculamos si hubo faltante o sobrante
            const declarado = parseFloat(efectivoDeclarado);
            const diferencia = declarado - resumen.efectivoEsperado;
            // Ej: Declaró $1000 - Esperaba $1050 = -$50 (Faltante)

            // 4. Actualizamos el registro cerrando el turno
            await caja.update({
                totalEfectivo: resumen.ventasEfectivo,
                totalTarjeta: resumen.ventasTarjeta,
                totalTransferencia: resumen.ventasTransferencia,
                efectivoDeclarado: declarado,
                diferencia: diferencia,
                fechaCierre: new Date(),
                estatus: 'CERRADA'
            });

            return caja;
        } catch (error) {
            console.error('Error al cerrar la caja:', error);
            throw error;
        }
    }
}