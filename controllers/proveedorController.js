import { Productos } from "../models/Productos.js";
import { Proveedores } from "../models/Proveedores.js";

export const agregarProveedor = async (req, res, next) => {
    const { nombre, celular } = req.body;

    const nombreBuscado = await Proveedores.findOne({ nombre });
    if (nombreBuscado) {
        return res.status(400).json({
            msg: 'Otro usuario ya está utilizando este nombre. Por favor, elija otro.',
            icon: 'error'
        });
    }

    const celularBuscado = await Proveedores.findOne({ celular });
    if (celularBuscado) {
        return res.status(400).json({
            msg: 'Otro usuario ya está utilizando ese número de célular. Por favor, elija otro.',
            icon: 'error'
        });
    }

    const proveedor = new Proveedores({ nombre, celular });

    try {
        await proveedor.save();

        return res.json({
            msg: 'Proveedor guardado éxitosamente.',
            icon: 'success'
        });
    } catch (error) {
        return res.status(500).json({
            msg: 'Ocurrió un error al agregar el proveedor',
            icon: 'error'
        });
    }
};

export const listarProveedores = async (req, res, next) => {
    const { limit = 4, page = 1, busqueda = '', lista = 'NO' } = req.query;
    let proveedores = null;

    try {
        if (busqueda !== '') {
            proveedores = await Proveedores.paginate({
                $or: [
                    { nombre: { $regex: busqueda, $options: 'i' } },
                    { celular: { $regex: busqueda, $options: 'i' } }
                ].filter(cond => cond !== null),
            }, { limit: parseInt(limit), page: parseInt(page) });
        } else if (busqueda === '' && lista === 'SI') {
            proveedores = await Proveedores.paginate({});
        } else {
            proveedores = await Proveedores.paginate({}, { limit: parseInt(limit), page: parseInt(page) });
        }

        if (proveedores) {
            return res.json({
                msg: busqueda === '' ? 'Proveedores listados correctamente' : 'Busqueda realizada',
                icon: 'success',
                proveedores
            });
        }

        return res.status(204).json({
            msg: 'No hay proveedores para mostrar.',
            icon: 'error'
        });
    } catch (error) {
        return res.status(500).json({
            msg: 'Ocurrió un error al listar los proveedores',
            icon: 'error'
        });
    }
};

export const obtenerProveedor = async (req, res, next) => {
    try {
        const id = req.params.id;
        const proveedores = await Proveedores.findById(id);

        if (!proveedores) {
            return res.status(404).json({
                msg: 'No se encontró el proveedor.',
                icon: 'error'
            });
        };

        return res.json({
            msg: 'Proveedor encontrado',
            icon: 'success',
            proveedores
        });
    } catch (error) {
        return res.status(500).json({
            msg: 'Ocurrió un error al buscar el proveedor',
            icon: 'error'
        });
    }
};

export const actualizarProveedor = async (req, res, next) => {
    const objProveedor = {};
    const { id } = req.params;
    try {
        if (req.body.nombre !== "") {
            const usuarioBuscado = await Proveedores.findOne({ nombre: req.body.nombre });

            // Verificar si el nombre ya está en uso por otro proveedor
            if (usuarioBuscado && usuarioBuscado._id.toString() !== id) {
                return res.status(400).json({
                    msg: 'Otro proveedor ya está utilizando este nombre. Por favor, elija otro.',
                    icon: 'error'
                });
            }

            objProveedor.nombre = req.body.nombre;
        }

        if (req.body.celular !== '') {
            const celularBuscado = await Proveedores.findOne({ celular: req.body.celular });

            // Verificar si el celular ya está en uso por otro proveedor
            if (celularBuscado && celularBuscado._id.toString() !== id) {
                return res.status(400).json({
                    msg: 'Otro proveedor ya está utilizando este celular. Por favor, elija otro.',
                    icon: 'error'
                });
            }
            objProveedor.celular = req.body.celular;
        }

        await Proveedores.findByIdAndUpdate(req.params.id, objProveedor, { new: true });

        return res.json({
            msg: 'Proveedor actualizado correctamente.',
            icon: 'success'
        });

    } catch (error) {
        return res.status(500).json({
            msg: 'Ocurrió un error al actualizar el proveedor',
            icon: 'error'
        });
    }

};

export const eliminarProveedor = async (req, res, next) => {
    const { id } = req.params;
    const { page = 1 } = req.query;
    try {
        const proveedores = await Proveedores.paginate({}, { limit: 4, page: parseInt(page) });

        const proveedorAsociado = await Productos.find({ proveedor: id });
        if (proveedorAsociado.length > 0) {
            return res.status(409).json({
                msg: 'No se puede eliminar este Proveedor, porque está asociado a un Producto',
                icon: 'error',
                proveedores
            });
        };

        await Proveedores.findByIdAndDelete(id);

        return res.json({
            msg: 'Proveedor eliminado correctamente.',
            icon: 'error',
            proveedores
        });
    } catch (error) {
        return res.status(500).json({
            msg: 'Ocurrió un error al eliminar el proveedor',
            icon: 'error'
        });
    }
};