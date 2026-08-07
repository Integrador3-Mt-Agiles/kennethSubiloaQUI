const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Configuración de CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
}));

app.use(express.json());

const usuariosRoutes = require("./routes/usuarios.routes");
const incidentesRoutes = require("./routes/incidentes.routes");
const observacionRoutes = require("./routes/observacion.routes");
const bitacoraRoutes = require("./routes/bitacora.routes");
const estadoRoutes = require("./routes/estado.routes");
const evidenciaRoutes = require("./routes/evidencia.routes");
const authRoutes = require("./routes/auth.routes");

app.use("/api/usuarios", usuariosRoutes);
app.use("/api/incidentes", incidentesRoutes);
app.use("/api", observacionRoutes);
app.use("/api", bitacoraRoutes);
app.use("/api", estadoRoutes);
app.use("/api",evidenciaRoutes);
app.use("/api/auth", authRoutes);

app.use((req, res) => {
    res.status(404).json({
        mensaje: "El endpoint solicitado no existe."
    });
});

app.use((error, req, res, next) => {
    console.error("Error no controlado:", error.message);

    res.status(error.status || 500).json({
        mensaje: error.status && error.status < 500
            ? error.message
            : "Ocurrió un error inesperado. Intente nuevamente."
    });
});


module.exports = app;
