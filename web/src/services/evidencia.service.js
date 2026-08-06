import api from "./api";

export const subirEvidencia = async (

    incidenteId,

    archivo

) => {

    const formData = new FormData();

    formData.append(

        "imagen",

        archivo

    );

    const response = await api.post(

        `/incidentes/${incidenteId}/evidencias`,

        formData,

        {

            headers: {

                "Content-Type": "multipart/form-data"

            }

        }

    );

    return response.data;

};