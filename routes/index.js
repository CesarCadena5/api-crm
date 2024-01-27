import express from "express";
import { check } from "express-validator";
import multer from "multer";

import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { actualizarProveedor, agregarProveedor, eliminarProveedor, listarProveedores, obtenerProveedor } from "../controllers/proveedorController.js";
import { validarCampos } from "../middlewares/validarCampos.js";
import { validarId } from "../helpers/validarId.js";
import { actualizarProducto, crearProducto, eliminarProducto, listarProductos, obtenerProducto } from "../controllers/productoController.js";
import { existeProducto, existeTipoProducto } from "../helpers/existeProducto.js";
import { actualizarPedido, eliminarPedido, guardarVentas, listarVentas, obtenerPedido } from "../controllers/ventasController.js";
import { validarToken } from "../middlewares/validarToken.js";
import { deleteUsuarios, login, usuarioGet, usuariosActualizar, usuariosCrear } from "../controllers/usuarioController.js";
import { correoExiste } from "../helpers/correoExiste.js";
import { validarImagen } from "../middlewares/validarImagen.js";
import { listarTipoProducto, tipoProductoActualizar, tipoProductoCrear, tipoProductoEliminar, tipoProductoGet } from "../controllers/tipoProductoController.js";

export const routerPrincipal = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../images'));
    },
    filename: (req, file, cb) => {
        cb(null, 'eliminar' + Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// Validar token
routerPrincipal.post('/validar-token', validarToken, (req, res, next) => {
    return res.json({
        ok: true,
        usuario: req.usuarioAuth
    });
});

// Agregar proveedor POST
routerPrincipal.post('/proveedores', [
    validarToken,
    check('nombre', 'El nombre es requerido.').notEmpty().escape(),
    check('celular', 'El celular es obligatorio.').notEmpty().escape(),
    validarCampos
], agregarProveedor);

// Obtener proveedores GET
routerPrincipal.get('/proveedores', validarToken, listarProveedores);

// Obtener un proveedor GET
routerPrincipal.get('/proveedor/:id', [
    validarToken,
    check('id').custom((id) => validarId(id)),
    validarCampos
], obtenerProveedor);

// Actualizar proveedor PUT
routerPrincipal.put('/proveedor/:id', [
    validarToken,
    check('id').custom((id) => validarId(id)),
    validarCampos
], actualizarProveedor);

// Eliminar proveedor DELETE
routerPrincipal.delete('/proveedor/:id', [
    validarToken,
    check('id').custom((id) => validarId(id)),
    validarCampos
], eliminarProveedor);


//Productos

// Crear producto POST
routerPrincipal.post('/productos', [
    validarToken,
    upload.single('imagen'),
    validarImagen,
    check('idTipoProducto').custom((idTipoProducto) => validarId(idTipoProducto, 'tipo producto')),
    check('nombre').custom(existeProducto),
    check('precioCompra', 'El precio de compra, debe ser números').isNumeric({ min: 1, max: 999999 }),
    check('precioVenta', 'El precio de venta, debe ser números').isNumeric({ min: 1, max: 999999 }),
    check('stock', 'El stock, debe ser números').isNumeric({ min: 1, max: 999 }),
    validarCampos
], crearProducto);

// Actualizar un producto PUT
routerPrincipal.put('/productos/:id', [
    validarToken,
    upload.single('imagen'),
    check('id').custom((id) => validarId(id, 'producto')),
    check('idTipoProducto').custom((idTipoProducto) => validarId(idTipoProducto, 'tipo producto')),
    validarCampos
], actualizarProducto);

// Eliminar un producto DELETE
routerPrincipal.delete('/productos/:id', [
    validarToken,
    check('id').custom((id) => validarId(id, 'producto')),
    validarCampos
], eliminarProducto);

// Listar productos GET
routerPrincipal.get('/productos', validarToken, listarProductos);

// Obtener un productso GET
routerPrincipal.get('/productos/:id', [
    validarToken,
    check('id').custom((id) => validarId(id, 'producto')),
    validarCampos
], obtenerProducto);

// Rutas tipo de productos

// Lista tipo productos GET
routerPrincipal.get('/tipo-producto', validarToken, listarTipoProducto);

// Crear tipo productos POST
routerPrincipal.post('/tipo-producto', [
    validarToken,
    check('nombre').custom(existeTipoProducto),
    validarCampos
], tipoProductoCrear);

// Actualizar tipo producto PUT
routerPrincipal.put('/tipo-producto/:id', [
    validarToken,
    check('id').custom((id) => validarId(id, 'tipo producto')),
    check('nombre', 'El nombre es requerido para actualizar').notEmpty().escape(),
    validarCampos
], tipoProductoActualizar);

// Eliminar tipo producto DELETE
routerPrincipal.delete('/tipo-producto/:id', [
    validarToken,
    check('id').custom((id) => validarId(id, 'tipo producto')),
    validarCampos
], tipoProductoEliminar);

// Obtener un tipo producto GET
routerPrincipal.get('/tipo-producto/:id', [
    validarToken,
    check('id').custom((id) => validarId(id, 'tipo producto')),
    validarCampos
], tipoProductoGet);


// Rutas de pedidos

// Crear pedidos POST
routerPrincipal.post('/ventas', [
    validarToken,
    check('ventas').isArray({ min: 1 }),
    check('total', 'El total deben ser números').isNumeric({ min: 1 }),
    validarCampos
], guardarVentas);

// Actualizar pedidos PUT
routerPrincipal.put('/ventas/:id', [
    validarToken,
    check('id').custom((id) => validarId(id, 'ventas')),
    check('productos').isArray({ min: 1 }),
    check('total', 'El total es obligatorio').notEmpty(),
    validarCampos
], actualizarPedido);

// Obtener los pedidos GET
routerPrincipal.get('/ventas', validarToken, listarVentas);

// Obtener un pedido GET
routerPrincipal.get('/ventas/:id', [
    validarToken,
    check('id').custom((id) => validarId(id, 'ventas')),
    validarCampos
], obtenerPedido);

// Eliminar pedido DELETE
routerPrincipal.delete('/ventas/:id', [
    validarToken,
    check('id').custom((id) => validarId(id, 'ventas')),
    validarCampos
], eliminarPedido);

// Usuarios

// Usuarios lista GET
routerPrincipal.get('/usuarios/:id', [
    validarToken,
    check('id').custom((id) => validarId(id, 'usuario')),
    validarCampos
], usuarioGet);

// Crear usuario POST
routerPrincipal.post('/usuarios/registro', [
    check('nombre', '¡Nombre de mínimo 4 carácteres!').isLength({ min: 4, max: 30 }),
    check('correo').custom(correoExiste),
    check('password', 'Contraseña de mínimo 6 carácteres').isLength({ min: 6 }),
    validarCampos
], usuariosCrear);

// Crear sesión usuario POST
routerPrincipal.post('/usuarios/login', [
    check('correo', 'El correo es requerido').isEmail().escape(),
    check('password', 'La contraseña es requerida').notEmpty().escape(),
    validarCampos
], login);

// Actualizar usuario PUT
routerPrincipal.put('/usuarios/actualizar/:id', [
    validarToken,
    check('id').custom((id) => validarId(id, 'usuario')),
    validarCampos
], usuariosActualizar);

// Eliminar usuario DELETE
routerPrincipal.delete('/usuarios/eliminar/:id', [
    validarToken,
    check('id').custom((id) => validarId(id, 'usuario')),
    validarCampos
], deleteUsuarios);