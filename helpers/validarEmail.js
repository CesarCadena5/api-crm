import { Clientes } from "../models/Proveedores.js";

export const validarEmail = async (email = '') => {
    if (email === "") {
        throw new Error('El email es requerido.');
    }

    const existeCorreo = await Clientes.findOne({ email });

    if (existeCorreo) {
        throw new Error('El email que intenta registrar, ya está en uso.');
    }
};