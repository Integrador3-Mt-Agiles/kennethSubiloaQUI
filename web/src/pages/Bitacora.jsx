import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";

import { useNavigate } from "react-router-dom";

import {

    obtenerBitacora

} from "../services/bitacora.service";

import TablaBitacora from "../components/TablaBitacora";

function Bitacora() {

    const [registros, setRegistros] = useState([]);
    const navigate = useNavigate();
    const [filtroUsuario, setFiltroUsuario] = useState("");

    const [filtroAccion, setFiltroAccion] = useState("");

    const [filtroFecha, setFiltroFecha] = useState("");

    useEffect(() => {

        cargarBitacora();

    }, []);

    const cargarBitacora = async () => {

        try {

            const data = await obtenerBitacora();

            setRegistros(data);

        } catch (error) {

            console.error(error);

        }

    };

    const registrosFiltrados = registros.filter((registro) => {

        console.log("Filtro:", filtroFecha);

        console.log("Registro:", registro.fechaHora);

        const usuarioTexto = String(
            registro?.usuarioNombre || ""
        ).toLowerCase();

        const accionTexto = String(
            registro?.accion || ""
        ).toLowerCase();

        const fechaTexto = String(
            registro?.fechaHora || ""
        );

        const coincideUsuario =
            usuarioTexto.includes(
                filtroUsuario.toLowerCase()
            );

        const coincideAccion =
            accionTexto.includes(
                filtroAccion.toLowerCase()
            );

        const fechaRegistro = registro?.fechaHora
            ? registro.fechaHora.split("T")[0]
            : "";

        const coincideFecha =

            !filtroFecha ||

            fechaRegistro === filtroFecha;

        return (

            coincideUsuario &&

            coincideAccion &&

            coincideFecha

        );

    });

    return (

        <MainLayout>

            <h1>Bitácora</h1>

            <hr />
            
            <h3>Filtros</h3>

            <div>

                <input

                    type="text"

                    placeholder="Buscar por usuario"

                    value={filtroUsuario}

                    onChange={(e) =>

                        setFiltroUsuario(e.target.value)

                    }

                />

                {" "}

                <input

                    type="text"

                    placeholder="Buscar por acción"

                    value={filtroAccion}

                    onChange={(e) =>

                        setFiltroAccion(e.target.value)

                    }

                />

                {" "}

                <input

                    type="date"

                    value={filtroFecha}

                    onChange={(e) =>

                        setFiltroFecha(e.target.value)

                    }

                />

            </div>

            <br />



            <TablaBitacora
                

                registros={registrosFiltrados}
                onVer={(registro) =>

                    navigate(`/incidentes/${registro.incidenteId}`)

                }


            />

        </MainLayout>

    );

}

export default Bitacora;