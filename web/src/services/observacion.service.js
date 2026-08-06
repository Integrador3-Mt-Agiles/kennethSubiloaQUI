import api from "./api";

export const obtenerObservaciones = async (incidenteId) => {

    const response = await api.get(
        `/incidentes/${incidenteId}/observaciones`
    );

    return response.data;

};

export const crearObservacion = async (
    incidenteId,
    observacion
) => {

    const response = await api.post(
        `/incidentes/${incidenteId}/observaciones`,
        observacion
    );

    return response.data;

};