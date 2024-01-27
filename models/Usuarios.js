import { model, Schema } from "mongoose";

const usuariosSchema = new Schema({
    nombre: {
        type: String,
        lowercase: true,
        required: [true, 'El nombre es requerido'],
        trim: true
    },
    correo: {
        type: String,
        unique: true,
        required: [true, 'El correo es requerido'],
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerida'],
        min: [6, 'Mínimo 6 carácteres'],
        trim: true
    }
});

export const Usuarios = model('Usuarios', usuariosSchema);