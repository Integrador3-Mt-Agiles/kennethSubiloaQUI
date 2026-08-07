const express = require("express");
const multer = require("multer");
const router = express.Router();

const { subir } = require("../controllers/evidencia.controller");
const { verificarToken } = require("../middlewares/auth.middleware");
const { verificarAccesoIncidente } = require("../middlewares/acceso.middleware");

const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 1
    },
    fileFilter: (req, file, callback) => {
        if (!tiposPermitidos.includes(file.mimetype)) {
            return callback(new Error("Solo se permiten imágenes JPG, PNG o WEBP."));
        }

        callback(null, true);
    }
});

const procesarImagen = (req, res, next) => {
    upload.single("imagen")(req, res, (error) => {
        if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                mensaje: "La imagen no puede superar los 5 MB."
            });
        }

        if (error) {
            return res.status(400).json({
                mensaje: error.message || "No fue posible procesar la imagen."
            });
        }

        next();
    });
};

router.post(
    "/incidentes/:id/evidencias",
    verificarToken,
    verificarAccesoIncidente,
    procesarImagen,
    subir
);

module.exports = router;
