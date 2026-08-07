const express = require("express");
const router = express.Router();

const {
    crearObservacion,
    listarObservaciones
} = require("../controllers/observacion.controller");

const { verificarToken } = require("../middlewares/auth.middleware");
const { verificarRol } = require("../middlewares/rol.middleware");
const { verificarAccesoIncidente } = require("../middlewares/acceso.middleware");

router.get(
    "/incidentes/:id/observaciones",
    verificarToken,
    verificarAccesoIncidente,
    listarObservaciones
);

router.post(
    "/incidentes/:id/observaciones",
    verificarToken,
    verificarRol("Responsable"),
    verificarAccesoIncidente,
    crearObservacion
);

module.exports = router;
