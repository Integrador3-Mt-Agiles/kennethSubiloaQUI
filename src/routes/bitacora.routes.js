const express = require("express");

const router = express.Router();

const {
    listarBitacora
} = require("../controllers/bitacora.controller");

const {

    verificarToken

} = require("../middlewares/auth.middleware");

const {

    verificarRol

} = require("../middlewares/rol.middleware");


router.get(

    "/bitacora",

    verificarToken,

    verificarRol("Administrador"),

    listarBitacora

);



module.exports = router;