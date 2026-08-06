const express = require("express");

const router = express.Router();

const {

    obtenerUsuarios,

    obtenerUsuarioPorId,

    crearUsuario,

    actualizarUsuario,

    eliminarUsuario,

    obtenerUsuariosPorRol

} = require("../controllers/usuarios.controller");

const {

    verificarToken

} = require("../middlewares/auth.middleware");

router.get(

    "/",

    verificarToken,

    obtenerUsuarios

);

router.get("/:id", obtenerUsuarioPorId);

router.post("/", crearUsuario);

router.put("/:id", actualizarUsuario);

router.delete("/:id", eliminarUsuario);

router.get("/rol/:rol", obtenerUsuariosPorRol);

module.exports = router;