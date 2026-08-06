const express = require("express");
const router = express.Router();


const {

    obtenerIncidentes,

    crearIncidente,

    obtenerIncidentePorId,

    actualizarIncidente,

    obtenerIncidentesPorReportante,

    obtenerIncidentesPorEstado,

    obtenerIncidentesPorTipo,
    
    eliminarIncidente

} = require("../controllers/incidentes.controller");

router.get("/", obtenerIncidentes);

router.post("/", crearIncidente);

router.get("/:id", obtenerIncidentePorId);

router.put("/:id", actualizarIncidente);

router.get("/reportante/:id", obtenerIncidentesPorReportante);

router.get("/estado/:estado", obtenerIncidentesPorEstado);

router.get("/tipo/:tipo", obtenerIncidentesPorTipo);

router.delete("/:id", eliminarIncidente);

module.exports = router;