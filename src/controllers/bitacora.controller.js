const {
    obtenerBitacora
} = require("../services/bitacora.service");

const listarBitacora = async (req, res) => {

    try {

        const registros = await obtenerBitacora();

        res.status(200).json(registros);

    } catch (error) {

        res.status(500).json({
            mensaje: error.message
        });

    }

};



module.exports = {
    listarBitacora
};