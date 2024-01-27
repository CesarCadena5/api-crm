import { model, Schema } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const ventasSchema = new Schema({
    ventas: [{
        producto: {
            type: Schema.Types.ObjectId,
            ref: 'Productos'
        },
        cantidad: {
            type: Number,
            trim: true,
            required: true
        },
        precio: {
            type: Number,
            required: true,
            trim: true
        }
    }],
    total: {
        type: Number,
        required: true,
        trim: true
    }
});

ventasSchema.plugin(mongoosePaginate);

export const Ventas = model('Ventas', ventasSchema);