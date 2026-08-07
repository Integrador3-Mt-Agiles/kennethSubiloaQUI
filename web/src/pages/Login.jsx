import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "../services/auth.service";

function Login() {

    const [correo, setCorreo] = useState("");

    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const iniciarSesion = async (e) => {

        e.preventDefault();

        try {

            const respuesta = await login(
                correo,
                password
            );

            localStorage.setItem(
                "token",
                respuesta.token
            );

            localStorage.setItem(
                "usuario",
                JSON.stringify(respuesta.usuario)
            );

            alert("Bienvenido.");

            navigate("/dashboard");

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.mensaje ||
                error.message
            );

        }

    };

    return (

        <main style={{ maxWidth: "420px", margin: "60px auto", padding: "24px" }}>

            <h1>Iniciar Sesión</h1>

            <hr />

            <form onSubmit={iniciarSesion}>

                <div>

                    <label>Correo</label>

                    <br />

                    <input
                        type="email"
                        value={correo}
                        onChange={(e) =>
                            setCorreo(e.target.value)
                        }
                        required
                    />

                </div>

                <br />

                <div>

                    <label>Contraseña</label>

                    <br />

                    <input
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        required
                    />

                </div>

                <br />

                <button type="submit">

                    Iniciar Sesión

                </button>

            </form>

        </main>

    );

}

export default Login;
