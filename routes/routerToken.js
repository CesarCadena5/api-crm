import { Router } from "express";
import { validarToken } from "../middlewares/validarToken.js";


export const routerToken = Router();

// Validar token
routerToken.post('/validar-token', validarToken, (req, res, next) => {
    return res.json({
        ok: true,
        usuario: req.usuarioAuth
    });
});