import { useState } from "react";

import {
    crearObservacion
} from "../services/observacion.service";

function FormularioObservacion({

    incidenteId,

    onGuardar

}) {

    const [comentario, setComentario] = useState("");

    const guardar = async (e) => {

        e.preventDefault();

        try {

            await crearObservacion(

                incidenteId,

                {

                    comentario

                }

            );

            alert("Observación agregada.");

            setComentario("");

            onGuardar();

        } catch (error) {

            console.error(error);

            console.log(error.response?.data);

            alert(

                error.response?.data?.mensaje ||

                error.message

            );

        }

    };

    return (

        <form onSubmit={guardar}>

            <h3>Agregar observación</h3>

            <div>

                <label>Comentario</label>

                <br />

                <textarea

                    rows="4"

                    value={comentario}

                    onChange={(e) =>

                        setComentario(

                            e.target.value

                        )

                    }

                />

            </div>

            <br />

            <button className="button button-primary" type="submit">

                Guardar observación

            </button>

        </form>

    );

}

export default FormularioObservacion;
