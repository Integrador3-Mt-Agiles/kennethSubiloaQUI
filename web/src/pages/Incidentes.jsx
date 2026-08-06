import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";

import { useNavigate } from "react-router-dom";

import {
    obtenerIncidentes,
    eliminarIncidente
} from "../services/incidente.service";

import TablaIncidentes from "../components/TablaIncidentes";

import Modal from "../components/Modal";

import FormularioIncidente from "../components/FormularioIncidente";

function Incidentes() {

    const [incidentes, setIncidentes] = useState([]);

    const [mostrarModal, setMostrarModal] = useState(false);

    const [incidenteSeleccionado, setIncidenteSeleccionado] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {

        cargarIncidentes();

    }, []);

    const cargarIncidentes = async () => {

        try {

            const data = await obtenerIncidentes();

            setIncidentes(data);

        } catch (error) {

            console.error(error);

        }

    };

    return (

        <MainLayout>

            <h1>Incidentes</h1>

            <button

                onClick={() => {

                    setIncidenteSeleccionado(null);

                    setMostrarModal(true);

                }}

            >

                Nuevo Incidente

            </button>

            <br />

            <br />

            <TablaIncidentes

                incidentes={incidentes}

                onVer={(incidente) => {

                    navigate(`/incidentes/${incidente.id}`);

                }}

                onEditar={(incidente) => {

                    setIncidenteSeleccionado(incidente);

                    setMostrarModal(true);

                }}

                onEliminar={async (incidente) => {

                    const confirmar = window.confirm(

                        `¿Desea eliminar el incidente "${incidente.titulo}"?`

                    );

                    if (!confirmar) return;

                    try {

                        await eliminarIncidente(incidente.id);

                        alert("Incidente eliminado correctamente.");

                        cargarIncidentes();

                    } catch (error) {

                        console.error(error);

                        alert(

                            error.response?.data?.mensaje ||

                            error.message

                        );

                    }

                }}

            />

            <Modal

                abierto={mostrarModal}

                titulo={

                    incidenteSeleccionado

                        ? "Editar Incidente"

                        : "Nuevo Incidente"

                }

                onClose={() => {

                    setMostrarModal(false);

                    setIncidenteSeleccionado(null);

                }}

            >

                <FormularioIncidente

                    incidente={incidenteSeleccionado}

                    onGuardar={() => {

                        cargarIncidentes();

                        setMostrarModal(false);

                        setIncidenteSeleccionado(null);

                    }}

                />

            </Modal>

        </MainLayout>

    );

}

export default Incidentes;