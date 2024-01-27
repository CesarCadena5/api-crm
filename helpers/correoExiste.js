import { Usuarios } from "../models/Usuarios.js";
import fs from 'fs';

import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const correoExiste = async (correo = '') => {
    const regexCorreo = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (correo === "") {
        throw new Error('El correo es requerido');
    }

    if (!regexCorreo.test(correo)) {
        throw new Error('El correo es inválido');
    }

    const existeCorreo = await Usuarios.findOne({ correo });

    if (existeCorreo) {
        throw new Error('El correo ya está registrado para otro usuario.');
    }
};

export const eliminar = (nombre) => {
    fs.unlink(path.join(__dirname, `../images/${nombre}`), (err) => {
        if (err) {
            console.error('Ocurrió un error al eliminar el archivo', err);
        } else {
            console.log('Archivo eliminado correctamente');
        }
    });
}