const { db } = require("../firebase/firebase.config");

const {
    registrarBitacora
} = require("./bitacora.service");

const agregarObservacion = async (
    incidenteId,
    usuarioResponsable,
    comentario
) => {

    // Verificar que exista el incidente
    const incidenteDoc = await db
        .collection("incidentes")
        .doc(incidenteId)
        .get();

    if (!incidenteDoc.exists) {
        throw new Error("El incidente no existe.");
    }

    const incidente = incidenteDoc.data();

    // Verificar que exista el usuario
    const usuarioDoc = await db
        .collection("usuarios")
        .doc(usuarioResponsable)
        .get();

    if (!usuarioDoc.exists) {
        throw new Error("El usuario responsable no existe.");
    }

    const usuario = usuarioDoc.data();

    // Validar el rol
    if (usuario.rol !== "Responsable") {
        throw new Error("Solo un responsable puede agregar observaciones.");
    }

    // Crear la observación
    const observacion = {
        comentario,
        fecha: new Date().toISOString(),
        incidenteId,
        usuarioResponsable,
        estadoAnterior: incidente.estado
    };

    // Guardar la observación
    const docRef = await db
        .collection("observaciones")
        .add(observacion);

    // Cambiar automáticamente el estado si está Pendiente
    if (incidente.estado === "Pendiente") {

        await db
            .collection("incidentes")
            .doc(incidenteId)
            .update({
                estado: "En revisión"
            });

    }

    // Registrar en bitácora
    await registrarBitacora(
        "Agregar observación",
        `Se agregó una observación: ${comentario}`,
        usuarioResponsable,
        incidenteId
    );

    return {
        id: docRef.id,
        ...observacion
    };

};

// Obtener observaciones de un incidente
const obtenerObservacionesPorIncidente = async (incidenteId) => {

    const snapshot = await db
        .collection("observaciones")
        .where("incidenteId", "==", incidenteId)
        .orderBy("fecha", "asc")
        .get();

    const observaciones = [];

    for (const doc of snapshot.docs) {

        const observacion = doc.data();

        // Buscar el responsable
        const usuarioDoc = await db
            .collection("usuarios")
            .doc(observacion.usuarioResponsable)
            .get();

        let usuarioNombre = "Usuario desconocido";

        if (usuarioDoc.exists) {
            usuarioNombre = usuarioDoc.data().nombre;
        }

        observaciones.push({
            id: doc.id,
            ...observacion,
            usuarioNombre
        });

    }

    return observaciones;

};

module.exports = {
    agregarObservacion,
    obtenerObservacionesPorIncidente
};