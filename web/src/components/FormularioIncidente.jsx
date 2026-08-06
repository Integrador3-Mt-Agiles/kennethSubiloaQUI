import { useState, useEffect } from "react";

import {
    crearIncidente,
    actualizarIncidente
} from "../services/incidente.service";

import {
    obtenerUsuariosPorRol
} from "../services/usuario.service";


import {

    subirEvidencia

} from "../services/evidencia.service";


function FormularioIncidente({

    incidente,

    onGuardar

}) {

    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [tipo, setTipo] = useState("Incidente");
    const [ubicacion, setUbicacion] = useState("");
    const [fechaIncidente, setFechaIncidente] = useState("");
    const [reportanteId, setReportanteId] = useState("");
    const [reportantes, setReportantes] = useState([]);
    const [imagenes, setImagenes] = useState([]);

    useEffect(() => {

        if (incidente) {

            setTitulo(incidente.titulo);
            setDescripcion(incidente.descripcion);
            setTipo(incidente.tipo);
            setUbicacion(incidente.ubicacion);
            setFechaIncidente(incidente.fechaIncidente);
            setReportanteId(incidente.reportanteId);

        } else {

            setTitulo("");
            setDescripcion("");
            setTipo("Incidente");
            setUbicacion("");
            setFechaIncidente("");
            setReportanteId("");

        }

    }, [incidente]);

    useEffect(() => {

        cargarReportantes();

    }, []);

    const cargarReportantes = async () => {

        try {

            const data = await obtenerUsuariosPorRol(
                "Reportante"
            );

            setReportantes(data);

        } catch (error) {

            console.error(error);

        }

    };

    const guardarIncidente = async (e) => {

        e.preventDefault();

        const datos = {

            titulo,
            descripcion,
            tipo,
            ubicacion,
            fechaIncidente,
            reportanteId

        };

        try {

            if (incidente) {

                await actualizarIncidente(
                    incidente.id,
                    datos
                );

                alert("Incidente actualizado correctamente.");

            } else {

                const respuesta = await crearIncidente(datos);

                if (imagenes.length > 0) {

                    for (const imagen of imagenes) {

                        await subirEvidencia(

                            respuesta.usuario?.id || respuesta.incidente?.id || respuesta.id,

                            imagen

                        );

                    }

                }

                alert("Incidente registrado correctamente.");

            }

            onGuardar();

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.mensaje ||
                error.message
            );

        }

    };

    return (

        <form onSubmit={guardarIncidente}>

            <h2>

                {
                    incidente
                        ? "Editar Incidente"
                        : "Nuevo Incidente"
                }

            </h2>

            <div>

                <label>Título</label>

                <br />

                <input
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                />

            </div>

            <br />

            <div>

                <label>Descripción</label>

                <br />

                <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                />

            </div>

            <br />

            <div>

                <label>Tipo</label>

                <br />

                <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                >

                    <option value="Incidente">
                        Incidente
                    </option>

                    <option value="Accidente">
                        Accidente
                    </option>

                </select>

            </div>

            <br />

            <div>

                <label>Ubicación</label>

                <br />

                <input
                    type="text"
                    value={ubicacion}
                    onChange={(e) => setUbicacion(e.target.value)}
                />

            </div>

            <br />

            <div>

                <label>Fecha</label>

                <br />

                <input
                    type="date"
                    value={fechaIncidente}
                    onChange={(e) => setFechaIncidente(e.target.value)}
                />

            </div>

            <br />

            <div>

                <label>Reportante</label>

                <br />

                <select

                    value={reportanteId}

                    onChange={(e) =>
                        setReportanteId(e.target.value)
                    }

                >

                    <option value="">

                        Seleccione un reportante

                    </option>

                    {

                        reportantes.map((usuario) => (

                            <option

                                key={usuario.id}

                                value={usuario.id}

                            >

                                {usuario.nombre}

                            </option>

                        ))

                    }

                </select>

            </div>
            
            <div>

                <label>Evidencias</label>

                <br />

                <input

                    type="file"

                    multiple

                    accept="image/*"

                    onChange={(e) =>

                        setImagenes(

                            Array.from(e.target.files)

                        )

                    }

                />

            </div>

            <br />


            <br />

            <button type="submit">

                {
                    incidente
                        ? "Actualizar Incidente"
                        : "Guardar Incidente"
                }

            </button>

        </form>

    );

}

export default FormularioIncidente;