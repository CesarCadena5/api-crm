import express from "express";
import { check } from "express-validator";

import { validarId } from "../helpers/validarId.js";
import { validarToken } from "../middlewares/validarToken.js";
import { validarCampos } from "../middlewares/validarCampos.js";
import { actualizarPedido, eliminarPedido, guardarVentas, listarVentas, obtenerPedido } from "../controllers/ventasController.js";

export const routerVentas = express.Router();

// Rutas de ventas

// Crear ventas POST
routerVentas.post('/', [
    validarToken,
    check('ventas').isArray({ min: 1 }),
    check('total', 'El total deben ser números').isNumeric({ min: 1 }),
    validarCampos
], guardarVentas);

// Actualizar ventas PUT
routerVentas.put('/:id', [
    validarToken,
    check('id').custom((id) => validarId(id, 'ventas')),
    check('productos').isArray({ min: 1 }),
    check('total', 'El total es obligatorio').notEmpty(),
    validarCampos
], actualizarPedido);

// Obtener los ventas GET
routerVentas.get('/', validarToken, listarVentas);

// Obtener un ventas GET
routerVentas.get('/:id', [
    validarToken,
    check('id').custom((id) => validarId(id, 'ventas')),
    validarCampos
], obtenerPedido);

// Eliminar ventas DELETE
routerVentas.delete('/:id', [
    validarToken,
    check('id').custom((id) => validarId(id, 'ventas')),
    validarCampos
], eliminarPedido);