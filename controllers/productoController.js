import fs from 'fs-extra';
import path from 'path';
import shortid from 'shortid';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


import { Productos } from '../models/Productos.js';
import { helperImg } from '../helpers/subirImagen.js';
import { TipoProducto } from '../models/TipoProducto.js';

export const crearProducto = async (req, res, next) => {
    const { nombre, precioCompra, precioVenta, stock, tipoProducto, idTipoProducto } = req.body;

    try {
        const ext = req.file.originalname.split('.').pop();
        const imagenNombre = `${shortid.generate()}.${ext}`;

        await helperImg(req.file.path, imagenNombre);

        const data = {
            nombre,
            precioCompra,
            precioVenta,
            stock,
            imagen: imagenNombre,
            tipoProducto: idTipoProducto
        };

        const productoSave = new Productos(data);
        await productoSave.save();

        return res.json({
            msg: 'Producto creado exitosamente',
            icon: 'success'
        });
    } catch (error) {
        return res.status(500).json({
            msg: 'Ocurrió un error al crear el producto',
            icon: 'error'
        });
    }

};

export const actualizarProducto = async (req, res, next) => {
    const objProducto = {};
    try {
        if (req.body.precioCompra && req.body.precioCompra !== '') {
            objProducto.precioCompra = req.body.precioCompra;
        }

        if (req.body.idTipoProducto && req.body.idTipoProducto !== '') {
            const tpoProducto = await TipoProducto.findById(req.body.idTipoProducto);

            if (!tpoProducto) {
                return res.status(404).json({
                    msg: 'El tipo de producto, asociado al producto, no existe. Elija otro',
                    icon: 'error'
                })
            }

            objProducto.tipoProducto = tpoProducto._id;
        }

        if (req.body.precioVenta && req.body.precioVenta !== '') {
            objProducto.precioVenta = req.body.precioVenta;
        }

        if (req.body.stock && req.body.stock !== '') {
            objProducto.stock = req.body.stock;
        }

        const datos = await Productos.findOne({ _id: req.params.id });
        if (req.body.nombre && req.body.nombre !== '') {

            if (datos && datos.nombre !== req.body.nombre.trim()) {
                const nombreExiste = await Productos.findOne({ nombre: req.body.nombre });
                if (nombreExiste) {
                    return res.status(409).json({
                        msg: 'El nombre ya está en uso, ingrese otro.',
                        icon: 'error'
                    });
                };

                objProducto.nombre = req.body.nombre;
            }
        }

        if (req.file && req.file.originalname !== '') {
            const imagen = req.file;

            if (imagen.mimetype !== 'image/jpeg' && imagen.mimetype !== 'image/png') {
                return res.status(415).json({
                    msg: 'La imagen, no cumple con la extensión permitida [jpg, png]',
                    icon: 'error'
                });
            }

            if (imagen.size / 1024 > 3072) {
                return res.status(423).json({
                    msg: 'El peso de la imagen, supera los 3MB',
                    icon: 'error'
                });
            }

            const ext = imagen.originalname.split('.').pop();
            const imagenNombre = `${shortid.generate()}.${ext}`;

            fs.unlink(path.join(__dirname, `../optimizadas/${datos.imagen}`), (err) => {
                if (err) {
                    console.error('Ocurrió un error al eliminar el archivo', err);
                } else {
                    console.log('Archivo eliminado correctamente');
                }
            });

            await helperImg(req.file.path, imagenNombre);

            objProducto.imagen = imagenNombre;
        } else {
            objProducto.imagen = datos.imagen;
        }

        await Productos.findByIdAndUpdate(req.params.id, objProducto, { new: true });

        return res.json({
            msg: 'Producto actualizado correctamente.',
            icon: 'success'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Ocurrió un error al actualizar el producto',
            icon: 'error'
        });
    }
};

export const eliminarProducto = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { page = 1 } = req.query;

        const producto = await Productos.findByIdAndDelete(id);

        if (producto) {
            fs.unlinkSync(path.join(__dirname, `../optimizadas/${producto.imagen}`));
        }

        const productos = await Productos.paginate({}, { limit: 4, page: parseInt(page), populate: { path: 'tipoProducto' } });

        if (productos) {
            return res.json({
                msg: 'Producto eliminado correctamente.',
                icon: 'success',
                productos
            });
        }
    } catch (error) {
        return res.json({
            msg: 'Ocurrió un error al eliminar el producto.',
            icon: 'error'
        });
    }
};

export const listarProductos = async (req, res, next) => {
    try {
        const { limit = 4, page = 1, busqueda = '', lista = 'NO' } = req.query;
        let productos = null;

        if (busqueda !== '') {
            productos = await Productos.paginate({
                $or: [
                    { nombre: { $regex: busqueda, $options: 'i' } },
                    { precioCompra: !isNaN(busqueda) ? { $eq: busqueda } : null },
                    { precioVenta: !isNaN(busqueda) ? { $eq: busqueda } : null },
                    { stock: !isNaN(busqueda) ? { $eq: busqueda } : null }
                ].filter(cond => cond !== null),
            }, { limit: parseInt(limit), page: parseInt(page), populate: { path: 'tipoProducto' } });
        } else if (busqueda === '' && lista === 'SI') {
            productos = await Productos.paginate({}, { populate: { path: 'tipoProducto' } });
        } else {
            productos = await Productos.paginate({}, { limit: parseInt(limit), page: parseInt(page), populate: { path: 'tipoProducto' } });
        }

        if (productos) {
            return res.json({
                msg: busqueda === '' ? 'Productos listados correctamente' : 'Busqueda realizada',
                icon: 'success',
                productos
            });
        }

        return res.status(204).json({
            msg: 'No hay productos para mostrar',
            icon: 'error'
        });

    } catch (error) {
        return res.status(500).json({
            msg: error.message,
            icon: 'error'
        });
    }
};

export const obtenerProducto = async (req, res, next) => {
    try {
        const producto = await Productos.findById(req.params.id).populate('tipoProducto');

        if (producto) {
            return res.json({
                productos: producto,
                msg: 'Producto encontrado',
                icon: 'success'
            });
        }

        return res.status(404).json({
            msg: 'No se encontró el producto',
            icon: 'error',
            productos: []
        });

    } catch (error) {
        return res.status(500).json({
            msg: 'No se encontró el producto',
            icon: 'error',
            productos: []
        });
    }
};