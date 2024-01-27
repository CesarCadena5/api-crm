import { model, Schema } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const productoSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    precioCompra: {
        type: Number,
        required: true
    },
    precioVenta: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    imagen: {
        type: String,
        required: true,
        trim: true
    },
    tipoProducto: {
        type: Schema.Types.ObjectId,
        ref: 'TipoProducto'
    }
});

productoSchema.plugin(mongoosePaginate);

export const Productos = model('Productos', productoSchema);