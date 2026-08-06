const crearObservacionDTO = (body) => {

    if (!body.comentario || body.comentario.trim() === "") {

        throw new Error("El comentario es obligatorio.");

    }

    return {

        comentario: body.comentario.trim()

    };

};

module.exports = {

    crearObservacionDTO

};