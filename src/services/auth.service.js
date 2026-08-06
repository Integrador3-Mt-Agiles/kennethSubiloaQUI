const { db } = require("../firebase/firebase.config");

const {

    generarToken

} = require("../utils/jwt");

const login = async (

    correo,

    password

) => {

    const snapshot = await db

        .collection("usuarios")

        .where("correo", "==", correo)

        .limit(1)

        .get();

    if (snapshot.empty) {

        throw new Error(

            "Correo o contraseña incorrectos."

        );

    }

    const doc = snapshot.docs[0];

    const usuario = {

        id: doc.id,

        ...doc.data()

    };

    if (usuario.password !== password) {

        throw new Error(

            "Correo o contraseña incorrectos."

        );

    }

    const token = generarToken(usuario);

    return {

        token,

        usuario: {

            id: usuario.id,

            nombre: usuario.nombre,

            correo: usuario.correo,

            rol: usuario.rol

        }

    };

};

module.exports = {

    login

};