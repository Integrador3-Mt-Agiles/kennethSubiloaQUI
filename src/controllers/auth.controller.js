const {

    login

} = require("../services/auth.service");

const iniciarSesion = async (req, res) => {

    try {

        const {

            correo,

            password

        } = req.body;

        const respuesta = await login(

            correo,

            password

        );

        res.status(200).json(respuesta);

    } catch (error) {

        res.status(401).json({

            mensaje: error.message

        });

    }

};

module.exports = {

    iniciarSesion

};