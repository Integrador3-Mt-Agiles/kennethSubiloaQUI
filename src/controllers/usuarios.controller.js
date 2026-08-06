const usuarioService = require("../services/usuarios.service");

const { crearUsuarioDTO } = require("../dtos/usuario.dto");

// GET
const obtenerUsuarios = async (req, res) => {

    try {

        const usuarios = await usuarioService.obtenerUsuarios();

        res.status(200).json(usuarios);

    } catch (error) {

        res.status(500).json({

            mensaje: error.message

        });

    }

};

// GET ID
const obtenerUsuarioPorId = async (req, res) => {

    try {

        const usuario = await usuarioService.obtenerUsuarioPorId(req.params.id);

        res.status(200).json(usuario);

    } catch (error) {

        res.status(404).json({

            mensaje: error.message

        });

    }

};

// POST
const crearUsuario = async (req, res) => {

    try {

        const usuarioDTO = crearUsuarioDTO(req.body);

        const usuario = await usuarioService.crearUsuario(usuarioDTO);

        res.status(201).json({

            mensaje: "Usuario registrado correctamente.",

            usuario

        });

    } catch (error) {

        res.status(400).json({

            mensaje: error.message

        });

    }

};

// PUT
const actualizarUsuario = async (req, res) => {

    try {

        const usuario = await usuarioService.actualizarUsuario(

            req.params.id,

            req.body

        );

        res.status(200).json({

            mensaje: "Usuario actualizado correctamente.",

            usuario

        });

    } catch (error) {

        res.status(400).json({

            mensaje: error.message

        });

    }

};

// DELETE
const eliminarUsuario = async (req, res) => {

    try {

        const respuesta = await usuarioService.eliminarUsuario(req.params.id);

        res.status(200).json(respuesta);

    } catch (error) {

        res.status(404).json({

            mensaje: error.message

        });

    }

};


const obtenerUsuariosPorRol = async (req, res) => {

    try {

        const usuarios = await usuarioService.obtenerUsuariosPorRol(
            req.params.rol
        );

        res.status(200).json(usuarios);

    } catch (error) {

        res.status(500).json({

            mensaje: error.message

        });

    }

};

module.exports = {

    obtenerUsuarios,

    obtenerUsuarioPorId,

    crearUsuario,

    actualizarUsuario,

    eliminarUsuario,

    obtenerUsuariosPorRol 

};