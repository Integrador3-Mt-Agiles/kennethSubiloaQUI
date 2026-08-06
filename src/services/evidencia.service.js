const { bucket, db } = require("../firebase/firebase.config");

const subirEvidencia = async (incidenteId, archivo) => {

    if (!archivo) {
        throw new Error("Debe seleccionar una imagen.");
    }

    const nombreArchivo =
        `${Date.now()}_${archivo.originalname}`;

    const file = bucket.file(
        `evidencias/${nombreArchivo}`
    );

    await file.save(archivo.buffer, {
        metadata: {
            contentType: archivo.mimetype
        }
    });

    await file.makePublic();

    const url = file.publicUrl();

    const incidenteRef = db
        .collection("incidentes")
        .doc(incidenteId);

    const incidenteDoc = await incidenteRef.get();

    if (!incidenteDoc.exists) {
        throw new Error("El incidente no existe.");
    }

    const incidente = incidenteDoc.data();

    const evidencias = incidente.evidencias || [];

    evidencias.push(url);

    await incidenteRef.update({
        evidencias
    });

    return {
        mensaje: "Evidencia subida correctamente.",
        url
    };

};

module.exports = {
    subirEvidencia
};