import { Productos } from "../models/Productos.js";
import { TipoProducto } from "../models/TipoProducto.js";

export const tipoProductoGet = async (req, res) => {
    const tipoProducto = await TipoProducto.findById(req.params.id);

    if (!tipoProducto) {
        return res.status(404).json({
            msg: 'El tipo de producto, no se encontró.',
            icon: 'error'
        });
    }

    return res.json({
        msg: 'Tipo de producto encontrado',
        icon: 'success',
        tipoProducto
    });
};

export const listarTipoProducto = async (req, res, next) => {
    try {
        const { limit = 4, page = 1, busqueda = '', lista = 'NO' } = req.query;
        let tipoProducto = null;

        if (busqueda !== '') {
            tipoProducto = await TipoProducto.paginate({
                $or: [
                    { nombre: { $regex: busqueda, $options: 'i' } }
                ].filter(cond => cond !== null),
            }, { limit: parseInt(limit), page: parseInt(page) });
        } else if (busqueda === '' && lista === 'SI') {
            tipoProducto = await TipoProducto.paginate({});
        } else {
            tipoProducto = await TipoProducto.paginate({}, { limit: parseInt(limit), page: parseInt(page) });
        }

        if (tipoProducto) {
            return res.json({
                msg: busqueda === '' ? 'Tipo de Producto listados correctamente' : 'Busqueda realizada',
                icon: 'success',
                tipoProducto
            });
        }

        return res.json({
            msg: 'No hay tipo de productos para mostrar',
            icon: 'error'
        });

    } catch (error) {
        return res.status(500).json({
            msg: 'Ocurrió un error al listar los tipos de productos',
            icon: 'error'
        });
    }
};

export const tipoProductoCrear = async (req, res) => {
    const { nombre } = req.body;

    try {
        const tipoProducto = new TipoProducto({ nombre });

        await tipoProducto.save();

        res.json({
            msg: 'Tipo de producto creado con éxito.',
            icon: 'success'
        });
    } catch (error) {
        return res.status(500).json({
            msg: 'Ocurrió un error al crear el tipo de producto',
            icon: 'error'
        });
    }
};

export const tipoProductoActualizar = async (req, res) => {
    const { nombre } = req.body;
    const { id } = req.params;
    const objTipoProducto = {};

    const tipoProducto = await TipoProducto.findOne({ nombre });

    // Verificar si el nombre ya está en uso por otro tipo de producto
    if (tipoProducto && tipoProducto._id.toString() !== id) {
        return res.status(400).json({
            msg: 'Nombre ya registrado. Por favor, elija otro.',
            icon: 'error'
        });
    }

    objTipoProducto.nombre = nombre;

    try {
        await TipoProducto.findByIdAndUpdate(id, objTipoProducto);

        res.json({
            msg: 'Se actualizó el tipo de producto.',
            icon: 'success'
        });
    } catch (error) {
        return res.status(500).json({
            msg: 'Ocurrió un error al actualizar el tipo de producto',
            icon: 'error'
        });
    }
};

export const tipoProductoEliminar = async (req, res) => {
    const { id } = req.params;
    const { page = 1 } = req.query;

    try {
        const tipoProducto = await TipoProducto.paginate({}, { limit: 4, page });

        const tipoProductoAsociado = await Productos.find({ tipoProducto: id });
        if (tipoProductoAsociado.length > 0) {
            return res.status(409).json({
                msg: 'No se puede eliminar este tipo de producto, porque está asociado a un Producto',
                icon: 'error',
                tipoProducto
            });
        };

        await TipoProducto.findByIdAndDelete(id);

        return res.json({
            msg: 'Tipo de producto eliminado con éxito.',
            icon: 'success',
            tipoProducto
        });
    } catch (error) {
        return res.status(500).json({
            msg: 'Ocurrió un error al eliminar el tipo de producto',
            icon: 'error'
        });
    }
};