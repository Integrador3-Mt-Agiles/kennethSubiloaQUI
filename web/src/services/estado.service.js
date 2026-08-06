import api from "./api";

export const actualizarEstado = async (

    incidenteId,

    datos

) => {

    const response = await api.patch(

        `/incidentes/${incidenteId}/estado`,

        datos

    );

    return response.data;

};