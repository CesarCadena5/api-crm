import { Types } from "mongoose";
import { Ventas } from "../models/Ventas.js";
import { Usuarios } from "../models/Usuarios.js";
import { Productos } from "../models/Productos.js";
import { Proveedores } from "../models/Proveedores.js";
import { TipoProducto } from "../models/TipoProducto.js";

export const validarId = async (id = '', tipo = 'proveedor') => {
    if (!Types.ObjectId.isValid(id)) {
        throw new Error('El ID proporcionado, no es válido');
    }

    let datoExiste = null;

    switch (tipo) {
        case 'proveedor':
            datoExiste = await Proveedores.findById(id);
            break;
        case 'producto':
            datoExiste = await Productos.findById(id);
            break;
        case 'ventas':
            datoExiste = await Ventas.findById(id);
            break;
        case 'usuario':
            datoExiste = await Usuarios.findById(id);
            break;
        case 'tipo producto':
            datoExiste = await TipoProducto.findById(id);
            break;
    }

    if (!datoExiste) {
        throw new Error(`El ${tipo} no existe por dicho ID`);
    }
};