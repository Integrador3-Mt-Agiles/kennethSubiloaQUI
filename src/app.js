const express = require("express");
const cors = require("cors");

const app = express();

// Configuración de CORS
app.use(cors({
    origin: "http://localhost:5173",
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


module.exports = app;