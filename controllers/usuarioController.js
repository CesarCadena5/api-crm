import bcryptjs from 'bcryptjs';
import { generarToken } from '../helpers/generarToken.js';
import { Usuarios } from '../models/Usuarios.js';

export const usuarioGet = async (req, res) => {
    const usuariodata = await Usuarios.findById(req.params.id);

    if (!usuariodata) {
        return res.status(404).json({
            msg: 'El usuario no se encontró.'
        });
    }

    return res.json({
        usuariodata
    });
};

export const usuariosCrear = async (req, res) => {
    const { nombre, correo, password } = req.body;

    const usuario = new Usuarios({ nombre, correo, password });

    try {
        const salt = bcryptjs.genSaltSync(12);
        const hashPassword = bcryptjs.hashSync(password, salt);
        usuario.password = hashPassword;

        await usuario.save();

        res.json({
            msg: 'Usuario creado con éxito.'
        });
    } catch (error) {
        return res.status(500).json({
            msg: error.message
        });
    }
};

export const usuariosActualizar = async (req, res) => {
    const { nombre, correo, password } = req.body;
    const { id } = req.params;
    const objUsuario = {};

    if (correo !== "") {
        const usuarioBuscado = await Usuarios.findOne({ correo });

        // Verificar si el correo ya está en uso por otro usuario
        if (usuarioBuscado && usuarioBuscado._id.toString() !== id) {
            return res.status(400).json({
                msg: 'Otro usuario ya está utilizando este correo. Por favor, elija otro.'
            });
        }

        objUsuario.correo = correo;
    }


    if (password !== "") {
        const salt = bcryptjs.genSaltSync();
        objUsuario.password = bcryptjs.hashSync(password, salt);
    }

    if (nombre !== "") {
        objUsuario.nombre = nombre;
    }

    try {
        await Usuarios.findByIdAndUpdate(id, objUsuario);

        res.json({
            msg: 'Se actualizó su usuario.'
        });
    } catch (error) {
        return res.status(500).json({
            msg: error.message
        });
    }
};

export const deleteUsuarios = async (req, res) => {
    const { id } = req.params;

    try {
        await Usuarios.findByIdAndDelete(id);

        return res.json({
            msg: 'Registro eliminado con éxito.'
        });
    } catch (error) {
        return res.status(500).json({
            msg: error.message
        });
    }
};

export const login = async (req, res) => {
    try {
        const { correo, password } = req.body;

        const usuario = await Usuarios.findOne({ correo });

        if (!usuario) {
            return res.status(400).json({
                error: 'Usuario y/o contraseña incorrecta.'
            });
        };

        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                error: 'Usuario y/o contraseña incorrecta.'
            });
        };

        const token = await generarToken(usuario.id);

        res.json({
            nombre: usuario.nombre,
            token
        });
    } catch (error) {
        return res.status(500).json({
            error: 'Comuniquese con el administrador.'
        });
    }
};