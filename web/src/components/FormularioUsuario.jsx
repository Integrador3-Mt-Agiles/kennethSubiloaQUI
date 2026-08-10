import { useState, useEffect } from "react";

import {
    crearUsuario,
    actualizarUsuario
} from "../services/usuario.service";

function FormularioUsuario({

    usuario,

    onGuardar

}) {

    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [rol, setRol] = useState("Reportante");

    useEffect(() => {

        if (usuario) {

            setNombre(usuario.nombre);
            setCorreo(usuario.correo);
            setPassword("");
            setRol(usuario.rol);

        } else {

            setNombre("");
            setCorreo("");
            setPassword("");
            setRol("Reportante");

        }

    }, [usuario]);

    const guardarUsuario = async (e) => {

        e.preventDefault();

        try {

            if (usuario) {

                await actualizarUsuario(

                    usuario.id,

                    {
                        nombre,
                        correo,
                        ...(password ? { password } : {}),
                        rol
                    }

                );

                alert("Usuario actualizado correctamente.");

            } else {

                await crearUsuario({

                    nombre,
                    correo,
                    password,
                    rol

                });

                alert("Usuario registrado correctamente.");

            }

            onGuardar();

        } catch (error) {

            console.error(error);

            alert(error.response?.data?.mensaje || error.message);

        }

    };

    return (

        <form onSubmit={guardarUsuario}>

            <h2>

                {

                    usuario

                        ? "Editar Usuario"

                        : "Nuevo Usuario"

                }

            </h2>

            <div>

                <label>Nombre</label>

                <br />

                <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                />

            </div>

            <br />

            <div>

                <label>Correo</label>

                <br />

                <input
                    type="email"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                />

            </div>

            <br />

            <div>

                <label>Contraseña</label>

                <br />

                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

            </div>

            <br />

            <div>

                <label>Rol</label>

                <br />

                <select
                    value={rol}
                    onChange={(e) => setRol(e.target.value)}
                >

                    <option value="Administrador">
                        Administrador
                    </option>

                    <option value="Responsable">
                        Responsable
                    </option>

                    <option value="Reportante">
                        Reportante
                    </option>

                </select>

            </div>

            <br />

            <button className="button button-primary" type="submit">

                {

                    usuario

                        ? "Actualizar Usuario"

                        : "Guardar Usuario"

                }

            </button>

        </form>

    );

}

export default FormularioUsuario;
