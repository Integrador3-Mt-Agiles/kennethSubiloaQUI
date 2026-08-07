const test = require("node:test");
const assert = require("node:assert/strict");

const app = require("../src/app");
const { generarToken } = require("../src/utils/jwt");

const iniciarServidor = () => new Promise((resolve) => {
    const servidor = app.listen(0, "127.0.0.1", () => resolve(servidor));
});

test("una ruta protegida responde 401 y un mensaje cuando falta el token", async (t) => {
    const servidor = await iniciarServidor();
    t.after(() => servidor.close());

    const { port } = servidor.address();
    const respuesta = await fetch(`http://127.0.0.1:${port}/api/usuarios`);
    const body = await respuesta.json();

    assert.equal(respuesta.status, 401);
    assert.equal(body.mensaje, "Debe iniciar sesión para continuar.");
});

test("una ruta protegida responde 401 y un mensaje ante un token inválido", async (t) => {
    const servidor = await iniciarServidor();
    t.after(() => servidor.close());

    const { port } = servidor.address();
    const respuesta = await fetch(`http://127.0.0.1:${port}/api/usuarios`, {
        headers: { Authorization: "Bearer token-invalido" }
    });
    const body = await respuesta.json();

    assert.equal(respuesta.status, 401);
    assert.match(body.mensaje, /sesión no es válida|expirado/i);
});

test("un Reportante autenticado recibe 403 al intentar administrar usuarios", async (t) => {
    const servidor = await iniciarServidor();
    t.after(() => servidor.close());

    const token = generarToken({
        id: "reportante-prueba",
        nombre: "Usuario de prueba",
        correo: "reportante@example.com",
        rol: "Reportante"
    });

    const { port } = servidor.address();
    const respuesta = await fetch(`http://127.0.0.1:${port}/api/usuarios`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const body = await respuesta.json();

    assert.equal(respuesta.status, 403);
    assert.equal(body.mensaje, "No tiene permisos para realizar esta acción.");
});

test("un Reportante autenticado recibe 403 al intentar listar todos los incidentes", async (t) => {
    const servidor = await iniciarServidor();
    t.after(() => servidor.close());

    const token = generarToken({
        id: "reportante-prueba",
        nombre: "Usuario de prueba",
        correo: "reportante@example.com",
        rol: "Reportante"
    });

    const { port } = servidor.address();
    const respuesta = await fetch(`http://127.0.0.1:${port}/api/incidentes`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const body = await respuesta.json();

    assert.equal(respuesta.status, 403);
    assert.equal(body.mensaje, "No tiene permisos para realizar esta acción.");
});
