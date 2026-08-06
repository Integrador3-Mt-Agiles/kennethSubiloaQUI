const {
    crearObservacionDTO
} = require("../dtos/observacion.dto");

const {
    agregarObservacion,
    obtenerObservacionesPorIncidente
} = require("../services/observacion.service");

// Crear observación
const crearObservacion = async (req, res) => {

    try {

        const { comentario } = crearObservacionDTO(req.body);

        const { id } = req.params;

        const usuarioResponsable = req.usuario.id;

        const respuesta = await agregarObservacion(

            id,

            usuarioResponsable,

            comentario

        );

        res.status(201).json(respuesta);

    } catch (error) {

        res.status(400).json({

            mensaje: error.message

        });

    }

};

// Obtener observaciones
const listarObservaciones = async (req, res) => {

    try {

        const observaciones = await obtenerObservacionesPorIncidente(

            req.params.id

        );

        res.status(200).json(observaciones);

    } catch (error) {

        res.status(400).json({

            mensaje: error.message

        });

    }

};

module.exports = {

    crearObservacion,

    listarObservaciones

};