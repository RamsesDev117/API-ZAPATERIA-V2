import { SucursalService } from "../services/sucursalService.js";

//Obtener las sucursales
export const obtenerSucursales = async (req, res) => {
    try {
        const sucursales = await SucursalService.obtenerIdSucursales();
        res.status(200).json({ success: true, data: sucursales });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}