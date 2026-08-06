const {
    subirEvidencia
} = require("../services/evidencia.service");

const subir = async (req, res) => {

    try {

        const respuesta = await subirEvidencia(

            req.params.id,

            req.file

        );

        res.status(200).json(respuesta);

    } catch (error) {

        res.status(400).json({

            mensaje: error.message

        });

    }

};

module.exports = {
    subir
};