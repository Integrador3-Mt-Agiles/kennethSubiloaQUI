import api from "./api";

export const obtenerBitacora = async () => {

    const response = await api.get(
        "/bitacora"
    );

    return response.data;

};