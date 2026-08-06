import { useState } from "react";

import {
    actualizarEstado
} from "../services/estado.service";

function FormularioEstado({

    incidente,

    onActualizar

}) {

    const [nuevoEstado, setNuevoEstado] = useState("");

    const guardar = async (e) => {

        e.preventDefault();

        try {

            await actualizarEstado(

                incidente.id,

                {

                    estado: nuevoEstado

                }

            );

            alert("Estado actualizado correctamente.");

            setNuevoEstado("");

            onActualizar();

        } catch (error) {

            console.error(error);

            alert(

                error.response?.data?.mensaje ||

                error.message

            );

        }

    };

    return (

        <form onSubmit={guardar}>

            <h3>Cambiar Estado</h3>

            <div>

                <label>Nuevo Estado</label>

                <br />

                <select

                    value={nuevoEstado}

                    onChange={(e) =>

                        setNuevoEstado(

                            e.target.value

                        )

                    }

                >

                    <option value="">

                        Seleccione

                    </option>

                    <option value="En revisión">

                        En revisión

                    </option>

                    <option value="Resuelto">

                        Resuelto

                    </option>

                    <option value="Cerrado">

                        Cerrado

                    </option>

                </select>

            </div>

            <br />

            <button type="submit">

                Actualizar Estado

            </button>

        </form>

    );

}

export default FormularioEstado;