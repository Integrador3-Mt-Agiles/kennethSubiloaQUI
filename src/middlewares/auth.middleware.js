const jwt = require("jsonwebtoken");

const {

    SECRET_KEY

} = require("../utils/jwt");

const verificarToken = (req, res, next) => {

    console.log("Authorization:", req.headers.authorization);

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {

            return res.status(401).json({

                mensaje: "Token no proporcionado."

            });

        }

        const token = authHeader.split(" ")[1];

        if (!token) {

            return res.status(401).json({

                mensaje: "Token inválido."

            });

        }

        const usuario = jwt.verify(

            token,

            SECRET_KEY

        );

        req.usuario = usuario;

        next();

    } catch (error) {

        return res.status(401).json({

            mensaje: "Token inválido o expirado."

        });

    }

};

module.exports = {

    verificarToken

};