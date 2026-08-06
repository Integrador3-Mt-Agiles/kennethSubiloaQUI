const express = require("express");

const router = express.Router();

const {
    crearObservacion,
    listarObservaciones
} = require("../controllers/observacion.controller");

const {
    verificarToken
} = require("../middlewares/auth.middleware");

const {
    verificarRol
} = require("../middlewares/rol.middleware");

router.get(
    "/incidentes/:id/observaciones",
    verificarToken,
    listarObservaciones
);

router.post(
    "/incidentes/:id/observaciones",
    verificarToken,
    verificarRol("Responsable"),
    crearObservacion
);

module.exports = router;