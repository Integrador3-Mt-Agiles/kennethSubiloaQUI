const { db } = require("../firebase/firebase.config");

// Obtener todos los incidentes
const obtenerIncidentes = async () => {

    try {

        const snapshot = await db
            .collection("incidentes")
            .get();

        const incidentes = [];

        for (const doc of snapshot.docs) {

            const incidente = {

                id: doc.id,

                ...doc.data()

            };

            let reportanteNombre = "No encontrado";

            if (incidente.reportanteId) {

                const usuarioDoc = await db
                    .collection("usuarios")
                    .doc(incidente.reportanteId)
                    .get();

                if (usuarioDoc.exists) {

                    reportanteNombre = usuarioDoc.data().nombre;

                }

            }

            incidentes.push({

                ...incidente,

                reportanteNombre

            });

        }

        return incidentes;

    } catch (error) {

        throw new Error(
            "Error al obtener los incidentes: " +
            error.message
        );

    }

};

// Crear un incidente
const crearIncidente = async (incidente) => {

    try {

        // Verificar que el reportante exista
        const usuario = await db
            .collection("usuarios")
            .doc(incidente.reportanteId)
            .get();

        if (!usuario.exists) {
            throw new Error("El reportante no existe.");
        }

        // Verificar que tenga el rol correcto
        if (usuario.data().rol !== "Reportante") {
            throw new Error("El usuario no tiene el rol de Reportante.");
        }

        // Guardar el incidente
        const docRef = await db
            .collection("incidentes")
            .add(incidente);

        return {

            id: docRef.id,

            ...incidente

        };

    } catch (error) {

        throw error;

    }

};

// Obtener un incidente por ID
const obtenerIncidentePorId = async (id) => {

    try {

        const doc = await db
            .collection("incidentes")
            .doc(id)
            .get();

        if (!doc.exists) {

            return null;

        }

        const incidente = doc.data();

        let reportanteNombre = "Usuario desconocido";

        const usuarioDoc = await db
            .collection("usuarios")
            .doc(incidente.reportanteId)
            .get();

        if (usuarioDoc.exists) {

            reportanteNombre = usuarioDoc.data().nombre;

        }

        return {

            id: doc.id,

            ...incidente,

            reportanteNombre

        };

    } catch (error) {

        throw new Error(
            "Error al obtener el incidente: " +
            error.message
        );

    }

};

// Actualizar un incidente
const actualizarIncidente = async (id, datos) => {

    try {

        await db
            .collection("incidentes")
            .doc(id)
            .update(datos);

        return {

            id,

            ...datos

        };

    } catch (error) {

        throw new Error(
            "Error al actualizar el incidente: " +
            error.message
        );

    }

};

// Eliminar un incidente
const eliminarIncidente = async (id) => {

    try {

        await db.collection("incidentes").doc(id).delete();

        return {
            mensaje: "Incidente eliminado correctamente."
        };

    } catch (error) {
        throw new Error("Error al eliminar el incidente: " + error.message);
    }

};

//busqueda de incidentes del repotante

const obtenerIncidentesPorReportante = async (reportanteId) => {

    try {

        const snapshot = await db
            .collection("incidentes")
            .where("reportanteId", "==", reportanteId)
            .get();

        const incidentes = [];

        snapshot.forEach(doc => {

            incidentes.push({

                id: doc.id,

                ...doc.data()

            });

        });

        return incidentes;

    } catch (error) {

        throw new Error("Error al obtener los incidentes del reportante.");

    }

};

//busqueda por tipo
const obtenerIncidentesPorEstado = async (estado) => {

    try {

        const snapshot = await db
            .collection("incidentes")
            .where("estado", "==", estado)
            .get();

        const incidentes = [];

        snapshot.forEach(doc => {

            incidentes.push({

                id: doc.id,

                ...doc.data()

            });

        });

        return incidentes;

    } catch (error) {

        throw new Error("Error al obtener los incidentes.");

    }

};

//busqueda por tipo accidente o incidentes
const obtenerIncidentesPorTipo = async (tipo) => {

    try {

        const snapshot = await db
            .collection("incidentes")
            .where("tipo", "==", tipo)
            .get();

        const incidentes = [];

        snapshot.forEach(doc => {

            incidentes.push({

                id: doc.id,

                ...doc.data()

            });

        });

        return incidentes;

    } catch (error) {

        throw new Error("Error al obtener los incidentes.");

    }

};



module.exports = {
    obtenerIncidentes,
    crearIncidente,
    obtenerIncidentePorId,
    actualizarIncidente,
    eliminarIncidente,
    obtenerIncidentesPorReportante,
    obtenerIncidentesPorEstado,
    obtenerIncidentesPorTipo
    
};