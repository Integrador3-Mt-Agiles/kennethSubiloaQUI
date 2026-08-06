const jwt = require("jsonwebtoken");

const SECRET_KEY = "ProyectoIntegradorJWT";

const generarToken = (usuario) => {

    return jwt.sign(

        {
            id: usuario.id,
            nombre: usuario.nombre,
            correo: usuario.correo,
            rol: usuario.rol
        },

        SECRET_KEY,

        {
            expiresIn: "8h"
        }

    );

};

module.exports = {

    SECRET_KEY,

    generarToken

};