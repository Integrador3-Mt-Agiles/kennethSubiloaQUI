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

const { verificarToken } = require("../middlewares/auth.middleware");
const { verificarRol } = require("../middlewares/rol.middleware");
const {
    verificarAccesoIncidente,
    verificarConsultaReportante
} = require("../middlewares/acceso.middleware");

router.use(verificarToken);

router.get("/", verificarRol("Administrador", "Responsable"), obtenerIncidentes);
router.post("/", verificarRol("Reportante"), crearIncidente);

router.get(
    "/reportante/:id",
    verificarRol("Administrador", "Responsable", "Reportante"),
    verificarConsultaReportante,
    obtenerIncidentesPorReportante
);

router.get(
    "/estado/:estado",
    verificarRol("Administrador", "Responsable"),
    obtenerIncidentesPorEstado
);

router.get(
    "/tipo/:tipo",
    verificarRol("Administrador", "Responsable"),
    obtenerIncidentesPorTipo
);

router.get("/:id", verificarAccesoIncidente, obtenerIncidentePorId);
router.put("/:id", verificarRol("Administrador"), actualizarIncidente);
router.delete("/:id", verificarRol("Administrador"), eliminarIncidente);

module.exports = router;
