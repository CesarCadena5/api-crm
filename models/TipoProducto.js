import { Schema, model } from "mongoose";
import moongosePaginate from 'mongoose-paginate-v2';

const tipoProductoSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    }
});

tipoProductoSchema.plugin(moongosePaginate);

export const TipoProducto = model('TipoProducto', tipoProductoSchema);