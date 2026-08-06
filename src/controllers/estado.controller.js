const { actualizarEstadoDTO } = require("../dtos/estado.dto");

const {
    actualizarEstado
} = require("../services/estado.service");

const cambiarEstado = async (req, res) => {

    try {

        const { id } = req.params;

        const { estado } = actualizarEstadoDTO(req.body);

        // El usuario sale del JWT
        const usuarioResponsable = req.usuario.id;

        const respuesta = await actualizarEstado(

            id,

            usuarioResponsable,

            estado

        );

        res.status(200).json(respuesta);

    } catch (error) {

        res.status(400).json({

            mensaje: error.message

        });

    }

};

module.exports = {
    cambiarEstado
};