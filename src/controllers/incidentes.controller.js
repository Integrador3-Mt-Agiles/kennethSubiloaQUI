const incidenteService = require("../services/incidentes.service");

const { crearIncidenteDTO, actualizarIncidenteDTO } = require("../dtos/incidente.dto");


// Obtener todos los incidentes
const obtenerIncidentes = async (req, res) => {

    try {

        const incidentes = await incidenteService.obtenerIncidentes();

        res.status(200).json(incidentes);

    } catch (error) {

        res.status(500).json({
            mensaje: error.message
        });

    }

};

// Registrar un incidente
const crearIncidente = async (req, res) => {

    try {

        const incidenteDTO = crearIncidenteDTO({
            ...req.body,
            reportanteId: req.usuario.id
        });

        const incidenteCreado = await incidenteService.crearIncidente(incidenteDTO);

        res.status(201).json({
            mensaje: "Incidente registrado correctamente.",
            incidente: incidenteCreado
        });

    } catch (error) {

        res.status(400).json({
            mensaje: error.message
        });

    }

};

// Obtener un incidente por ID
const obtenerIncidentePorId = async (req, res) => {

    try {

        const incidente = await incidenteService.obtenerIncidentePorId(
            req.params.id
        );

        if (!incidente) {

            return res.status(404).json({
                mensaje: "Incidente no encontrado."
            });

        }

        res.status(200).json(incidente);

    } catch (error) {

        res.status(500).json({
            mensaje: error.message
        });

    }

};


//busqueda de incidentes del repotante
const obtenerIncidentesPorReportante = async (req, res) => {

    try {

        const incidentes = await incidenteService.obtenerIncidentesPorReportante(
            req.params.id
        );

        res.status(200).json(incidentes);

    } catch (error) {

        res.status(500).json({

            mensaje: error.message

        });

    }

};

//busqueda por tipo
const obtenerIncidentesPorEstado = async (req, res) => {

    try {

        const incidentes = await incidenteService.obtenerIncidentesPorEstado(
            req.params.estado
        );

        res.status(200).json(incidentes);

    } catch (error) {

        res.status(500).json({

            mensaje: error.message

        });

    }

};

//busqueda por tipo accidente o incidentes
const obtenerIncidentesPorTipo = async (req, res) => {

    try {

        const incidentes = await incidenteService.obtenerIncidentesPorTipo(
            req.params.tipo
        );

        res.status(200).json(incidentes);

    } catch (error) {

        res.status(500).json({

            mensaje: error.message

        });

    }

};

//eliminar usuario
const eliminarIncidente = async (req, res) => {
    try {
        await incidenteService.eliminarIncidente(req.params.id);

        res.status(200).json({
            mensaje: "Incidente eliminado correctamente."
        });

    } catch (error) {
        res.status(500).json({
            mensaje: error.message
        });
    }
};

const actualizarIncidente = async (req, res) => {

    try {

        const incidente = await incidenteService.actualizarIncidente(

            req.params.id,

            actualizarIncidenteDTO(req.body)

        );

        res.status(200).json({

            mensaje: "Incidente actualizado correctamente.",

            incidente

        });

    } catch (error) {

        res.status(400).json({

            mensaje: error.message

        });

    }

};

module.exports = {

    obtenerIncidentes,

    crearIncidente,

    obtenerIncidentePorId,

    obtenerIncidentesPorReportante,

    obtenerIncidentesPorEstado,

    obtenerIncidentesPorTipo,

    eliminarIncidente,

    actualizarIncidente

};
