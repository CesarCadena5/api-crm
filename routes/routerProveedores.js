import { Router } from "express"
import { check } from "express-validator";
import { validarId } from "../helpers/validarId.js";
import { validarToken } from "../middlewares/validarToken.js";
import { validarCampos } from "../middlewares/validarCampos.js";
import { actualizarProveedor, agregarProveedor, eliminarProveedor, listarProveedores, obtenerProveedor } from "../controllers/proveedorController.js";

export const routerProveedores = Router();

// Agregar proveedor POST
routerProveedores.post('/', [
    validarToken,
    check('nombre', 'El nombre es requerido.').notEmpty().escape(),
    check('celular', 'El celular es obligatorio.').notEmpty().escape(),
    validarCampos
], agregarProveedor);

// Obtener proveedores GET
routerProveedores.get('/', validarToken, listarProveedores);

// Obtener un proveedor GET
routerProveedores.get('/:id', [
    validarToken,
    check('id').custom((id) => validarId(id)),
    validarCampos
], obtenerProveedor);

// Actualizar proveedor PUT
routerProveedores.put('/:id', [
    validarToken,
    check('id').custom((id) => validarId(id)),
    validarCampos
], actualizarProveedor);

// Eliminar proveedor DELETE
routerProveedores.delete('/:id', [
    validarToken,
    check('id').custom((id) => validarId(id)),
    validarCampos
], eliminarProveedor);