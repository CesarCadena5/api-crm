import mongoose, { Schema } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const proveedoresSchema = new Schema({
    nombre: {
        type: String,
        lowercase: true,
        required: true,
        trim: true
    },
    celular: {
        type: String,
        required: true,
        trim: true
    }
});

proveedoresSchema.plugin(mongoosePaginate);

export const Proveedores = mongoose.model('Proveedores', proveedoresSchema);
