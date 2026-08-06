const actualizarEstadoDTO = (body) => {

    if (!body.estado) {

        throw new Error("El estado es obligatorio.");

    }

    return {

        estado: body.estado

    };

};

module.exports = {

    actualizarEstadoDTO

};