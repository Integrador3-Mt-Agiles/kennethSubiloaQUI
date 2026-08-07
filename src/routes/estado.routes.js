const express = require("express");
const router = express.Router();

const { cambiarEstado } = require("../controllers/estado.controller");
const { verificarToken } = require("../middlewares/auth.middleware");
const { verificarRol } = require("../middlewares/rol.middleware");
const { verificarAccesoIncidente } = require("../middlewares/acceso.middleware");

router.patch(
    "/incidentes/:id/estado",
    verificarToken,
    verificarRol("Responsable"),
    verificarAccesoIncidente,
    cambiarEstado
);

module.exports = router;
