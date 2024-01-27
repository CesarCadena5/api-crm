import jwt from "jsonwebtoken";
import 'dotenv/config';
import { Usuarios } from "../models/Usuarios.js";

export const validarToken = async (req, res, next) => {
    try {
        const token = req.header('token');

        if (!token) {
            return res.status(401).json({
                msg: 'No existe el token.'
            });
        }

        const { id } = jwt.verify(token, 'MyS3cr37Keyt0K3N', (err, decoded) => {
            if (err) {
                throw new Error('Error al validar el token.');
            }

            return decoded;
        });

        const usuario = await Usuarios.findById(id);

        if (!usuario) {
            return res.status(401).json({
                msg: 'No está autorizado para ejecutar esta acción.'
            });
        }

        req.usuarioAuth = usuario;

        next();
    } catch (error) {
        return res.status(401).json({
            msg: error.message
        })
    }
};