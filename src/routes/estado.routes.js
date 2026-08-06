const express = require("express");

const router = express.Router();

const {
    cambiarEstado
} = require("../controllers/estado.controller");

const {
    verificarToken
} = require("../middlewares/auth.middleware");

const {
    verificarRol
} = require("../middlewares/rol.middleware");

router.patch(

    "/incidentes/:id/estado",

    verificarToken,

    verificarRol("Responsable"),

    cambiarEstado

);

module.exports = router;