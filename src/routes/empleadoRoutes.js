import express from 'express'

import {
    registrarEmpleado,
    obtenerEmpleados,
    actualizarEmpleado,
    eliminarEmpleado,
    restaurarEmpleado
} from '../controllers/empleadoController.js'


import {
    verificarToken,
    verificarRol,
    verificarUsuarioOAdmin
} from '../middlewares/authMiddleware.js';

const router = express.Router();


//Ruta para registrar nuevos empleados --FUNCIONANDO--
router.post('/empleados/create-empleado', verificarToken, verificarRol(['ADMIN']), registrarEmpleado)

//Ruta para obtener todos los empleado  --FUNCIONANDO--
router.get('/empleados/get-all', verificarToken, verificarRol(['ADMIN']), obtenerEmpleados);

//Ruta para actualizar un empleado --FUNCIONANDO--
router.put('/empleados/update-empleado/:id', verificarToken, verificarRol(['ADMIN']), actualizarEmpleado);

//Ruta para desactivar empleados
router.delete('/empleados/deactive-empleado/:id', verificarToken, verificarRol(['ADMIN']), eliminarEmpleado);

//Ruta para activar empleados 
router.patch('/empleados/activate-empleado/:id', verificarToken, verificarRol(['ADMIN']), restaurarEmpleado);

export default router;