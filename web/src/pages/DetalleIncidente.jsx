import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import { obtenerIncidentePorId } from "../services/incidente.service";

import { obtenerObservaciones } from "../services/observacion.service";

import ListaObservaciones from "../components/ListaObservaciones";

import FormularioObservacion from "../components/FormularioObservacion";

import FormularioEstado from "../components/FormularioEstado";

function DetalleIncidente() {

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    const { id } = useParams();

    const [incidente, setIncidente] = useState(null);

    const [observaciones, setObservaciones] = useState([]);

    useEffect(() => {

        cargarIncidente();

        cargarObservaciones();

    }, []);

    const cargarIncidente = async () => {

        try {

            const data = await obtenerIncidentePorId(id);

            setIncidente(data);

        } catch (error) {

            console.error(error);

            alert(error.response?.data?.mensaje || "No fue posible cargar el incidente.");

        }

    };

    const cargarObservaciones = async () => {

    try {

        console.log("ID del incidente:", id);

        const data = await obtenerObservaciones(id);

        console.log("Observaciones:", data);

        setObservaciones(data);

    } catch (error) {

        console.error(error);

        alert(error.response?.data?.mensaje || "No fue posible cargar las observaciones.");

    }

};

    if (!incidente) {

        return (

            <MainLayout>

                <h2>Cargando...</h2>

            </MainLayout>

        );

    }

    return (

        <MainLayout>

            <h1>Detalle del Incidente</h1>

            <hr />

            <h2>Información General</h2>

            <p>

                <strong>Título:</strong>

                {" "}

                {incidente.titulo}

            </p>

            <p>

                <strong>Descripción:</strong>

                {" "}

                {incidente.descripcion}

            </p>

            <p>

                <strong>Tipo:</strong>

                {" "}

                {incidente.tipo}

            </p>

            <p>

                <strong>Estado:</strong>

                {" "}

                {incidente.estado}

            </p>

            <p>

                <strong>Ubicación:</strong>

                {" "}

                {incidente.ubicacion}

            </p>

            <p>

                <strong>Fecha:</strong>

                {" "}

                {incidente.fechaIncidente}

            </p>

            <p>

                <strong>Reportante:</strong>

                {" "}

                {incidente.reportanteNombre}

            </p>

            <hr />

            <h2>Evidencias</h2>

            {

                incidente.evidencias?.length > 0

                    ? (

                        incidente.evidencias.map((imagen, index) => (

                            <div key={index}>

                                <img

                                    src={imagen}

                                    alt={`Evidencia ${index + 1}`}

                                    width="250"

                                />

                                <br />

                                <br />

                            </div>

                        ))

                    )

                    : (

                        <p>No hay evidencias.</p>

                    )

            }

            <hr />

            <h2>Observaciones</h2>

                <ListaObservaciones

                    observaciones={observaciones}

                />

                <hr />

                {usuario?.rol === "Responsable" && <FormularioObservacion

                    incidenteId={id}

                    onGuardar={() => {

                        cargarObservaciones();

                        cargarIncidente();

                    }}

                />}

            <hr />

            

            
            {usuario?.rol === "Responsable" && <div style={{ border: "1px solid red", padding: "10px" }}>

                <FormularioEstado
                    incidente={incidente}
                    onActualizar={() => {
                        cargarIncidente();
                    }}
                />

            </div>}

            

        </MainLayout>

    );

}

export default DetalleIncidente;
