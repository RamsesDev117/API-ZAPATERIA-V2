import { Sucursal } from "../models/Sucursal.js";

export class SucursalService {

    //Obtener id de las sucursales
    static async obtenerIdSucursales() {
        return await Sucursal.findAll({
            order: [['id', 'ASC']]
        })
    }

    

}