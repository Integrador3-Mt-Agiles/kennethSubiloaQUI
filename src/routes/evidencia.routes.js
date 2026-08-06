const express = require("express");

const multer = require("multer");

const router = express.Router();

const upload = multer({

    storage: multer.memoryStorage()

});

const {

    subir

} = require("../controllers/evidencia.controller");

router.post(

    "/incidentes/:id/evidencias",

    upload.single("imagen"),

    subir

);

module.exports = router;