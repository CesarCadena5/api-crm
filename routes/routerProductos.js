import multer from "multer";
import { Router } from "express";
import { check } from "express-validator";
import { validarId } from "../helpers/validarId.js";
import { validarToken } from "../middlewares/validarToken.js";
import { validarImagen } from "../middlewares/validarImagen.js";
import { existeProducto } from "../helpers/existeProducto.js";
import { validarCampos } from "../middlewares/validarCampos.js";
import { actualizarProducto, crearProducto, eliminarProducto, listarProductos, obtenerProducto } from "../controllers/productoController.js";

import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const routerProductos = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../images'));
    },
    filename: (req, file, cb) => {
        cb(null, 'eliminar' + Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

//Productos

// Crear producto POST
routerProductos.post('/', [
    validarToken,
    upload.single('imagen'),
    validarImagen,
    check('idTipoProducto').custom((idTipoProducto) => validarId(idTipoProducto, 'tipo producto')),
    check('proveedor').custom((id) => validarId(id, 'proveedor')),
    check('nombre').custom(existeProducto),
    check('precioCompra', 'El precio de compra, debe ser números').isNumeric({ min: 1, max: 999999 }),
    check('precioVenta', 'El precio de venta, debe ser números').isNumeric({ min: 1, max: 999999 }),
    check('stock', 'El stock, debe ser números').isNumeric({ min: 1, max: 999 }),
    validarCampos
], crearProducto);

// Actualizar un producto PUT
routerProductos.put('/:id', [
    validarToken,
    upload.single('imagen'),
    check('id').custom((id) => validarId(id, 'producto')),
    check('idTipoProducto').custom((idTipoProducto) => validarId(idTipoProducto, 'tipo producto')),
    check('proveedor').custom((id) => validarId(id, 'proveedor')),
    validarCampos
], actualizarProducto);

// Eliminar un producto DELETE
routerProductos.delete('/:id', [
    validarToken,
    check('id').custom((id) => validarId(id, 'producto')),
    validarCampos
], eliminarProducto);

// Listar productos GET
routerProductos.get('', validarToken, listarProductos);

// Obtener un productso GET
routerProductos.get('/:id', [
    validarToken,
    check('id').custom((id) => validarId(id, 'producto')),
    validarCampos
], obtenerProducto);