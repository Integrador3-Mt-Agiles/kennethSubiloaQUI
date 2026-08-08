import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";

import { useNavigate } from "react-router-dom";

import {
    obtenerIncidentes,
    obtenerIncidentesPorReportante,
    eliminarIncidente
} from "../services/incidente.service";

import TablaIncidentes from "../components/TablaIncidentes";

import Modal from "../components/Modal";

import FormularioIncidente from "../components/FormularioIncidente";

function Incidentes() {

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    const [incidentes, setIncidentes] = useState([]);

    const [mostrarModal, setMostrarModal] = useState(false);

    const [incidenteSeleccionado, setIncidenteSeleccionado] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {

        cargarIncidentes();

    }, []);

    const cargarIncidentes = async () => {

        try {

            const data = usuario?.rol === "Reportante"
                ? await obtenerIncidentesPorReportante(usuario.id)
                : await obtenerIncidentes();

            setIncidentes(data);

        } catch (error) {

            console.error(error);

            alert(error.response?.data?.mensaje || "No fue posible cargar los Eventos.");

        }

    };

    return (

        <MainLayout>

            <div className="page-header"><div><p className="eyebrow">Gestión de eventos</p><h1>Eventos</h1></div>
            {usuario?.rol === "Reportante" && <button className="button button-primary"

                onClick={() => {

                    setIncidenteSeleccionado(null);

                    setMostrarModal(true);

                }}

            >

                 Nuevo Evento

            </button>}</div>

            <TablaIncidentes

                incidentes={incidentes}

                onVer={(incidente) => {

                    navigate(`/incidentes/${incidente.id}`);

                }}

                onEditar={usuario?.rol === "Administrador" ? (incidente) => {

                    setIncidenteSeleccionado(incidente);

                    setMostrarModal(true);

                } : null}

                onEliminar={usuario?.rol === "Administrador" ? async (incidente) => {

                    const confirmar = window.confirm(

                        `¿Desea eliminar el Evento "${incidente.titulo}"?`

                    );

                    if (!confirmar) return;

                    try {

                        await eliminarIncidente(incidente.id);

                        alert("Evento eliminado correctamente.");

                        cargarIncidentes();

                    } catch (error) {

                        console.error(error);

                        alert(

                            error.response?.data?.mensaje ||

                            error.message

                        );

                    }

                } : null}

            />

            <Modal

                abierto={mostrarModal}

                titulo={

                    incidenteSeleccionado

                        ? "Editar Evento"

                        : "Nuevo Evento"

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
