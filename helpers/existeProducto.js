import { Productos } from "../models/Productos.js";
import { TipoProducto } from "../models/TipoProducto.js";

export const existeProducto = async (nombre = '') => {
    if (nombre === "") {
        throw new Error('El nombre es requerido');
    };

    const producto = await Productos.findOne({ nombre });

    if (producto) {
        throw new Error('El producto ya existe con ese nombre, use otro.');
    }
};

export const existeTipoProducto = async (nombre = '') => {
    if (nombre === "") {
        throw new Error('El nombre del tipo de producto es requerido');
    };

    const producto = await TipoProducto.findOne({ nombre });

    if (producto) {
        throw new Error('El tipo de producto ya existe con ese nombre, use otro.');
    }
};