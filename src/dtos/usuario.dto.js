const rolesPermitidos = ["Administrador", "Reportante", "Responsable"];

const crearUsuarioDTO = (body) => {
    if (!body.nombre || body.nombre.trim() === "") {
        throw new Error("El nombre es obligatorio.");
    }

    if (!body.correo || body.correo.trim() === "") {
        throw new Error("El correo es obligatorio.");
    }

    if (!body.password || body.password.trim() === "") {
        throw new Error("La contraseña es obligatoria.");
    }

    if (!rolesPermitidos.includes(body.rol)) {
        throw new Error("El rol no es válido.");
    }

    return {
        nombre: body.nombre.trim(),
        correo: body.correo.trim().toLowerCase(),
        password: body.password,
        rol: body.rol,
        activo: true,
        fechaRegistro: new Date().toISOString()
    };
};

const actualizarUsuarioDTO = (body) => {
    const datos = {};

    if (body.nombre !== undefined) {
        if (typeof body.nombre !== "string" || body.nombre.trim() === "") {
            throw new Error("El nombre no puede estar vacío.");
        }
        datos.nombre = body.nombre.trim();
    }

    if (body.correo !== undefined) {
        if (typeof body.correo !== "string" || body.correo.trim() === "") {
            throw new Error("El correo no puede estar vacío.");
        }
        datos.correo = body.correo.trim().toLowerCase();
    }

    if (body.password !== undefined && body.password !== "") {
        if (typeof body.password !== "string") {
            throw new Error("La contraseña no es válida.");
        }
        datos.password = body.password;
    }

    if (body.rol !== undefined) {
        if (!rolesPermitidos.includes(body.rol)) {
            throw new Error("El rol no es válido.");
        }
        datos.rol = body.rol;
    }

    if (body.activo !== undefined) {
        if (typeof body.activo !== "boolean") {
            throw new Error("El estado activo debe ser verdadero o falso.");
        }
        datos.activo = body.activo;
    }

    if (Object.keys(datos).length === 0) {
        throw new Error("No se proporcionaron datos válidos para actualizar.");
    }

    return datos;
};

module.exports = { crearUsuarioDTO, actualizarUsuarioDTO };
