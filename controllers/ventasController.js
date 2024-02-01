import { Ventas } from "../models/Ventas.js";
import { Productos } from "../models/Productos.js";

export const guardarVentas = async (req, res, next) => {
    try {
        const { ventas, total } = req.body;

        const arrErrores = [];
        const guardar = [];

        for (const item of ventas) {
            const producto = await Productos.findOne({ nombre: item.nombre });
            const objVenta = {};

            if (producto) {
                objVenta.producto = producto._id;
                objVenta.cantidad = item.cantidad;
                objVenta.precio = item.total;
                guardar.push(objVenta);
            } else {
                arrErrores.push(`El producto ${item.nombre}, no existe, pero se procesaron los demás`);
            }
        }

        const ventasSave = new Ventas({ ventas: guardar, total });

        await ventasSave.save();

        if (guardar.length > 0 && arrErrores.length > 0) {
            return res.json({
                msg: 'Se procesó la venta, pero algunos productos tuvieron errores',
                icon: 'error',
                arrErrores
            });
        } else if (guardar.length > 0 && arrErrores.length === 0) {
            return res.json({
                msg: 'Se procesaron todos los productos para la venta',
                icon: 'success'
            });
        }

    } catch (error) {
        return res.status(500).json({
            msg: 'Ocurrió un error al guardar la venta',
            icon: 'error'
        });
    }
};

export const actualizarPedido = async (req, res, next) => {
    try {
        const { productos, total } = req.body;
        const arrErrores = [];
        const guardar = [];

        for (const item of productos) {
            const producto = await Productos.findOne({ nombre: item.producto.nombre });
            const objVenta = {};

            if (producto) {
                objVenta.producto = producto._id;
                objVenta.cantidad = Number(item.cantidad);
                objVenta.precio = Number(item.precio);
                guardar.push(objVenta);
            } else {
                arrErrores.push(`El producto ${item.producto.nombre}, no existe, pero se procesaron los demás`);
            }
        }

        await Ventas.findOneAndUpdate({ _id: req.params.id }, { ventas: guardar, total }, { new: true });

        return res.json({
            msg: 'Venta actualizada correctamente.',
            icon: 'success'
        });

    } catch (error) {
        return res.status(500).json({
            msg: 'Ocurrió un error al actualizar la venta',
            icon: 'error'
        });
    }
};

export const listarVentas = async (req, res, next) => {
    try {
        const { limit = 4, page = 1, busqueda = '', lista = 'NO' } = req.query;
        let ventas = null;

        if (busqueda !== '') {
            ventas = await Ventas.paginate({
                $or: [
                    { total: !isNaN(busqueda) ? { $eq: busqueda } : null },
                ].filter(cond => cond !== null),
            }, { limit: parseInt(limit), page: parseInt(page), populate: { path: 'ventas.producto' } });
        } else if (busqueda === '' && lista === 'SI') {
            ventas = await Ventas.paginate({});
        } else {
            ventas = await Ventas.paginate({}, { limit: parseInt(limit), page: parseInt(page), populate: { path: 'ventas.producto' } });
        }

        if (ventas) {
            return res.json({
                msg: busqueda === '' ? 'Ventas listadas correctamente' : 'Busqueda realizada',
                icon: 'success',
                ventas
            });
        }

        return res.status(204).json({
            msg: 'No hay ventas para mostrar',
            icon: 'error'
        });
    } catch (error) {
        return res.status(500).json({
            msg: 'Ocurrió un error al listar las ventas',
            icon: 'error'
        });
    }
};

export const obtenerPedido = async (req, res, next) => {
    try {
        const ventas = await Ventas.findById(req.params.id).populate('ventas.producto');

        if (ventas) {
            return res.json({
                msg: 'Venta encontrada',
                icon: 'success',
                ventas
            });
        }

        return res.status(404).json({
            msg: 'No se encontró la venta',
            icon: 'error',
            ventas: []
        });
    } catch (error) {
        return res.status(500).json({
            msg: 'Ocurrió un error al obtener la venta',
            icon: 'error'
        });
    }
};

export const eliminarPedido = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { page = 1 } = req.query;

        await Ventas.findByIdAndDelete(id);

        const ventas = await Ventas.paginate({}, { limit: 4, page: parseInt(page), populate: { path: 'ventas.producto' } });

        if (ventas) {
            return res.json({
                msg: 'Venta eliminada correctamente.',
                icon: 'success',
                ventas
            });
        }
    } catch (error) {
        res.status(500).json({
            msg: 'Ocurrió un error al eliminar la venta',
            icon: 'error'
        });
        next();
    }
};