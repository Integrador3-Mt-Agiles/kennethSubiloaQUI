const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
    throw new Error("JWT_SECRET no está configurado en las variables de entorno.");
}

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
            expiresIn: "8h",
            algorithm: "HS256",
            issuer: "sistema-incidentes",
            audience: "sistema-incidentes-web"
        }

    );

};

module.exports = {

    SECRET_KEY,

    generarToken

};
