import { Link, useNavigate } from "react-router-dom";

function Sidebar() {

    const navigate = useNavigate();

    const usuario = JSON.parse(

        localStorage.getItem("usuario")

    );

    const cerrarSesion = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("usuario");

        window.location.href = "/";

    };

    return (

        <aside
            style={{
                width: "220px",
                backgroundColor: "#f5f5f5",
                padding: "20px",
                minHeight: "100vh"
            }}
        >

            <h2>Menú</h2>

            <nav>

                <ul
                    style={{
                        listStyle: "none",
                        padding: 0
                    }}
                >

                    <li>

                        <Link to="/dashboard">

                            Dashboard

                        </Link>

                    </li>

                    <li>

                        <Link to="/incidentes">

                            Incidentes

                        </Link>

                    </li>

                    {

                        usuario?.rol === "Administrador" && (

                            <>

                                <li>

                                    <Link to="/usuarios">

                                        Usuarios

                                    </Link>

                                </li>

                                <li>

                                    <Link to="/bitacora">

                                        Bitácora

                                    </Link>

                                </li>

                            </>

                        )

                    }

                    <li>

                        <button

                            onClick={cerrarSesion}

                            style={{

                                marginTop: "20px",

                                width: "100%"

                            }}

                        >

                            Cerrar sesión

                        </button>

                    </li>

                </ul>

            </nav>

        </aside>

    );

}

export default Sidebar;