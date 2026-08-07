const { db } = require("../firebase/firebase.config");

const verificarAccesoIncidente = async (req, res, next) => {
    try {
        const incidenteDoc = await db
            .collection("incidentes")
            .doc(req.params.id)
            .get();

        if (!incidenteDoc.exists) {
            return res.status(404).json({
                mensaje: "El incidente solicitado no existe."
            });
        }

        const incidente = incidenteDoc.data();
        const { id: usuarioId, rol } = req.usuario;
        const tieneAccesoGeneral = ["Administrador", "Responsable"].includes(rol);
        const esPropietario = rol === "Reportante" && incidente.reportanteId === usuarioId;

        if (!tieneAccesoGeneral && !esPropietario) {
            return res.status(403).json({
                mensaje: "No tiene permisos para acceder a este incidente."
            });
        }

        req.incidente = { id: incidenteDoc.id, ...incidente };
        next();
    } catch (error) {
        return res.status(500).json({
            mensaje: "No fue posible verificar el acceso al incidente."
        });
    }
};

const verificarConsultaReportante = (req, res, next) => {
    if (req.usuario.rol === "Reportante" && req.params.id !== req.usuario.id) {
        return res.status(403).json({
            mensaje: "No tiene permisos para consultar incidentes de otro reportante."
        });
    }

    next();
};

module.exports = { verificarAccesoIncidente, verificarConsultaReportante };
