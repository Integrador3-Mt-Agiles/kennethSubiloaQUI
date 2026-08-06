const { db } = require("../firebase/firebase.config");
const { registrarBitacora } = require("./bitacora.service");

const actualizarEstado = async (
    incidenteId,
    usuarioResponsable,
    nuevoEstado
) => {

    // Buscar incidente
    const incidenteDoc = await db
        .collection("incidentes")
        .doc(incidenteId)
        .get();

    if (!incidenteDoc.exists) {
        throw new Error("El incidente no existe.");
    }

    const incidente = incidenteDoc.data();

    // Buscar usuario
    const usuarioDoc = await db
        .collection("usuarios")
        .doc(usuarioResponsable)
        .get();

    if (!usuarioDoc.exists) {
        throw new Error("El usuario no existe.");
    }

    const usuario = usuarioDoc.data();

    // Validar rol
    if (usuario.rol !== "Responsable") {
        throw new Error("Solo un responsable puede cambiar el estado.");
    }

    const estadoActual = incidente.estado;

    // Si ya está en el mismo estado
    if (estadoActual === nuevoEstado) {
        throw new Error("El incidente ya se encuentra en ese estado.");
    }

    // Validar transición de estados
    switch (estadoActual) {

        case "Pendiente":
            if (nuevoEstado !== "En revisión") {
                throw new Error(
                    "Un incidente Pendiente solo puede pasar a 'En revisión'."
                );
            }
            break;

        case "En revisión":
            if (nuevoEstado !== "Resuelto") {
                throw new Error(
                    "Un incidente En revisión solo puede pasar a 'Resuelto'."
                );
            }
            break;

        case "Resuelto":
            if (nuevoEstado !== "Cerrado") {
                throw new Error(
                    "Un incidente Resuelto solo puede pasar a 'Cerrado'."
                );
            }
            break;

        case "Cerrado":
            throw new Error(
                "El incidente ya está cerrado y no puede cambiar de estado."
            );

        default:
            throw new Error("El estado actual del incidente no es válido.");
    }

    // Actualizar estado
    await db
        .collection("incidentes")
        .doc(incidenteId)
        .update({
            estado: nuevoEstado
        });

    // Registrar bitácora
        await registrarBitacora(
        "Cambio de estado",
        `Estado cambiado de "${estadoActual}" a "${nuevoEstado}".`,
        usuarioResponsable,
        incidenteId
    );

    return {
        mensaje: "Estado actualizado correctamente.",
        estadoAnterior: estadoActual,
        estadoNuevo: nuevoEstado
    };

};

module.exports = {
    actualizarEstado
};