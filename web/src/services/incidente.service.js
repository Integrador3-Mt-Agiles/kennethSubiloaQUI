import api from "./api";

export const obtenerIncidentes = async () => {

    const response = await api.get("/incidentes");

    return response.data;

};

export const crearIncidente = async (incidente) => {

    const response = await api.post(
        "/incidentes",
        incidente
    );

    return response.data;

};

export const obtenerIncidentePorId = async (id) => {

    const response = await api.get(
        `/incidentes/${id}`
    );

    return response.data;

};

export const actualizarIncidente = async (id, incidente) => {

    const response = await api.put(
        `/incidentes/${id}`,
        incidente
    );

    return response.data;

};

export const eliminarIncidente = async (id) => {

    const response = await api.delete(
        `/incidentes/${id}`
    );

    return response.data;

};

export const obtenerIncidentesPorReportante = async (reportanteId) => {
    const response = await api.get(`/incidentes/reportante/${reportanteId}`);
    return response.data;
};
