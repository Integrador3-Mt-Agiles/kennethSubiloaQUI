const { db } = require("../firebase/firebase.config");

// Obtener todos
const obtenerUsuarios = async () => {

    try {

        const snapshot = await db.collection("usuarios").get();

        const usuarios = [];

        snapshot.forEach(doc => {

            usuarios.push({

                id: doc.id,

                ...doc.data()

            });

        });

        return usuarios;

    } catch (error) {

        throw new Error("Error al obtener los usuarios.");

    }

};




// Obtener por ID
const obtenerUsuarioPorId = async (id) => {

    try {

        const doc = await db.collection("usuarios").doc(id).get();

        if (!doc.exists) {

            throw new Error("Usuario no encontrado.");

        }

        return {

            id: doc.id,

            ...doc.data()

        };

    } catch (error) {

        throw error;

    }

};

// Crear
const crearUsuario = async (usuario) => {

    try {

        const consulta = await db
            .collection("usuarios")
            .where("correo", "==", usuario.correo)
            .get();

        if (!consulta.empty) {

            throw new Error("Ya existe un usuario con ese correo.");

        }

        const docRef = await db.collection("usuarios").add(usuario);

        return {

            id: docRef.id,

            ...usuario

        };

    } catch (error) {

        throw error;

    }

};

// Actualizar
const actualizarUsuario = async (id, datos) => {

    try {

        const docRef = db.collection("usuarios").doc(id);

        const doc = await docRef.get();

        if (!doc.exists) {

            throw new Error("Usuario no encontrado.");

        }

        await docRef.update(datos);

        return {

            id,

            ...datos

        };

    } catch (error) {

        throw error;

    }

};

// Eliminar
const eliminarUsuario = async (id) => {

    try {

        const docRef = db.collection("usuarios").doc(id);

        const doc = await docRef.get();

        if (!doc.exists) {

            throw new Error("Usuario no encontrado.");

        }

        await docRef.delete();

        return {

            mensaje: "Usuario eliminado correctamente."

        };

    } catch (error) {

        throw error;

    }

};

// Obtener usuarios por rol
const obtenerUsuariosPorRol = async (rol) => {

    try {

        const snapshot = await db
            .collection("usuarios")
            .where("rol", "==", rol)
            .get();

        const usuarios = [];

        snapshot.forEach((doc) => {

            usuarios.push({

                id: doc.id,

                ...doc.data()

            });

        });

        return usuarios;

    } catch (error) {

        throw error;

    }

};

module.exports = {

    obtenerUsuarios,

    obtenerUsuarioPorId,

    crearUsuario,

    actualizarUsuario,

    eliminarUsuario,

    obtenerUsuariosPorRol

};