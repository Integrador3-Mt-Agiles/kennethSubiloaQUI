import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";

import {
    obtenerUsuarios,
    eliminarUsuario
} from "../services/usuario.service";

import TablaUsuarios from "../components/TablaUsuarios";

import Modal from "../components/Modal";

import FormularioUsuario from "../components/FormularioUsuario";

function Usuarios() {

    const [usuarios, setUsuarios] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

    useEffect(() => {

        cargarUsuarios();

    }, []);

    const cargarUsuarios = async () => {

        try {

            const data = await obtenerUsuarios();

            setUsuarios(data);

        } catch (error) {

            console.error(error);

            alert(error.response?.data?.mensaje || "No fue posible cargar los usuarios.");

        }

    };

    return (

        <MainLayout>

            <h1>Usuarios</h1>

           <button
                className="button button-primary"
                onClick={() => {

                    setUsuarioSeleccionado(null);

                    setMostrarModal(true);

                }}
            >

                Nuevo Usuario

            </button>

            <br />

            <br />

            <TablaUsuarios

                usuarios={usuarios}

                onEditar={(usuario) => {

                    setUsuarioSeleccionado(usuario);

                    setMostrarModal(true);

                }}

                onEliminar={async (usuario) => {

                    const confirmar = window.confirm(
                        `¿Desea eliminar a ${usuario.nombre}?`
                    );

                    if (!confirmar) return;

                    try {

                        await eliminarUsuario(usuario.id);

                        alert("Usuario eliminado correctamente.");

                        cargarUsuarios();

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

                titulo="Registrar Usuario"

                onClose={() => setMostrarModal(false)}

            >

                <FormularioUsuario

                    usuario={usuarioSeleccionado}

                    onGuardar={() => {

                        cargarUsuarios();

                        setMostrarModal(false);

                    }}

                />

            </Modal>

        </MainLayout>

        

    );

}

export default Usuarios;
