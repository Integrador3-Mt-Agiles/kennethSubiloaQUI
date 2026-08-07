const crearIncidenteDTO = (body) => {
    if (!body.titulo || body.titulo.trim() === "") {
        throw new Error("El título es obligatorio.");
    }

    if (!body.descripcion || body.descripcion.trim() === "") {
        throw new Error("La descripción es obligatoria.");
    }

    if (!body.reportanteId || body.reportanteId.trim() === "") {
        throw new Error("El reportante es obligatorio.");
    }

    if (!["Incidente", "Accidente"].includes(body.tipo)) {
        throw new Error("El tipo de incidente no es válido.");
    }

    return {
        titulo: body.titulo.trim(),
        descripcion: body.descripcion.trim(),
        tipo: body.tipo,
        ubicacion: body.ubicacion,
        fechaIncidente: body.fechaIncidente,
        reportanteId: body.reportanteId,
        estado: "Pendiente",
        evidencias: [],
        fechaRegistro: new Date().toISOString()
    };
};

const actualizarIncidenteDTO = (body) => {
    const datos = {};

    if (body.titulo !== undefined) {
        if (typeof body.titulo !== "string" || body.titulo.trim() === "") {
            throw new Error("El título no puede estar vacío.");
        }
        datos.titulo = body.titulo.trim();
    }

    if (body.descripcion !== undefined) {
        if (typeof body.descripcion !== "string" || body.descripcion.trim() === "") {
            throw new Error("La descripción no puede estar vacía.");
        }
        datos.descripcion = body.descripcion.trim();
    }

    if (body.tipo !== undefined) {
        if (!["Incidente", "Accidente"].includes(body.tipo)) {
            throw new Error("El tipo de incidente no es válido.");
        }
        datos.tipo = body.tipo;
    }

    if (body.ubicacion !== undefined) datos.ubicacion = body.ubicacion;
    if (body.fechaIncidente !== undefined) datos.fechaIncidente = body.fechaIncidente;
    if (body.reportanteId !== undefined) datos.reportanteId = body.reportanteId;

    if (Object.keys(datos).length === 0) {
        throw new Error("No se proporcionaron datos válidos para actualizar.");
    }

    return datos;
};

module.exports = { crearIncidenteDTO, actualizarIncidenteDTO };
