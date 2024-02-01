import { Router } from "express";
import { check } from "express-validator";
import { validarId } from "../helpers/validarId.js";
import { correoExiste } from "../helpers/correoExiste.js";
import { validarToken } from "../middlewares/validarToken.js";
import { validarCampos } from "../middlewares/validarCampos.js";
import { deleteUsuarios, login, usuarioGet, usuariosActualizar, usuariosCrear } from "../controllers/usuarioController.js";


export const routerUsuarios = Router();

// Usuarios

// Usuarios lista GET
routerUsuarios.get('/:id', [
    validarToken,
    check('id').custom((id) => validarId(id, 'usuario')),
    validarCampos
], usuarioGet);

// Crear usuario POST
routerUsuarios.post('/registro', [
    check('nombre', '¡Nombre de mínimo 4 carácteres!').isLength({ min: 4, max: 30 }),
    check('correo').custom(correoExiste),
    check('password', 'Contraseña de mínimo 6 carácteres').isLength({ min: 6 }),
    validarCampos
], usuariosCrear);

// Crear sesión usuario POST
routerUsuarios.post('/login', [
    check('correo', 'El correo es requerido').isEmail().escape(),
    check('password', 'La contraseña es requerida').notEmpty().escape(),
    validarCampos
], login);

// Actualizar usuario PUT
routerUsuarios.put('/actualizar/:id', [
    validarToken,
    check('id').custom((id) => validarId(id, 'usuario')),
    validarCampos
], usuariosActualizar);

// Eliminar usuario DELETE
routerUsuarios.delete('/eliminar/:id', [
    validarToken,
    check('id').custom((id) => validarId(id, 'usuario')),
    validarCampos
], deleteUsuarios);