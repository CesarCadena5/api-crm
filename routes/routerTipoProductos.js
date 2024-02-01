import { Router } from "express";
import { check } from "express-validator";
import { validarId } from "../helpers/validarId.js";
import { validarToken } from "../middlewares/validarToken.js";
import { existeTipoProducto } from "../helpers/existeProducto.js";
import { validarCampos } from "../middlewares/validarCampos.js";
import { listarTipoProducto, tipoProductoActualizar, tipoProductoCrear, tipoProductoEliminar, tipoProductoGet } from "../controllers/tipoProductoController.js";

export const routerTipoProductos = Router();

// Rutas tipo de productos

// Lista tipo productos GET
routerTipoProductos.get('', validarToken, listarTipoProducto);

// Crear tipo productos POST
routerTipoProductos.post('', [
    validarToken,
    check('nombre').custom(existeTipoProducto),
    validarCampos
], tipoProductoCrear);

// Actualizar tipo producto PUT
routerTipoProductos.put('/:id', [
    validarToken,
    check('id').custom((id) => validarId(id, 'tipo producto')),
    check('nombre', 'El nombre es requerido para actualizar').notEmpty().escape(),
    validarCampos
], tipoProductoActualizar);

// Eliminar tipo producto DELETE
routerTipoProductos.delete('/:id', [
    validarToken,
    check('id').custom((id) => validarId(id, 'tipo producto')),
    validarCampos
], tipoProductoEliminar);

// Obtener un tipo producto GET
routerTipoProductos.get('/:id', [
    validarToken,
    check('id').custom((id) => validarId(id, 'tipo producto')),
    validarCampos
], tipoProductoGet);