const { db } = require("../firebase/firebase.config");

// Registrar un movimiento en la bitácora
const registrarBitacora = async (
    accion,
    detalle,
    usuarioId,
    incidenteId
) => {

    // Buscar el usuario
    const usuarioDoc = await db
        .collection("usuarios")
        .doc(usuarioId)
        .get();

    if (!usuarioDoc.exists) {
        throw new Error("El usuario no existe.");
    }

    const usuario = usuarioDoc.data();

    const registro = {
        accion,
        detalle,
        usuarioId,
        usuarioNombre: usuario.nombre,
        incidenteId,
        fechaHora: new Date().toISOString()
    };

    const docRef = await db
        .collection("bitacora")
        .add(registro);

    return {
        id: docRef.id,
        ...registro
    };

};

// Obtener todos los registros de la bitácora
const obtenerBitacora = async () => {

    const snapshot = await db
        .collection("bitacora")
        .orderBy("fechaHora", "desc")
        .get();

    const registros = [];

    for (const doc of snapshot.docs) {

        const registro = doc.data();

        let incidenteTitulo = "Sin incidente";

        if (registro.incidenteId) {

            const incidenteDoc = await db
                .collection("incidentes")
                .doc(registro.incidenteId)
                .get();

            if (incidenteDoc.exists) {

                incidenteTitulo = incidenteDoc.data().titulo;

            }

        }

        registros.push({

            id: doc.id,

            ...registro,

            incidenteTitulo

        });

    }

    return registros;

};

module.exports = {

    registrarBitacora,

    obtenerBitacora

};