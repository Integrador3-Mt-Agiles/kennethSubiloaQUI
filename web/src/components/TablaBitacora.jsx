function TablaBitacora({

    registros,

    onVer

}) {

    return (

        <table

            border="1"

            width="100%"

            cellPadding="10"

        >

            <thead>

                <tr>

                    <th>Fecha</th>

                    <th>Usuario</th>

                    <th>Acción</th>

                    <th>Detalle</th>

                    <th>Título del incidente</th>

                    <th>Acciones</th>

                </tr>

            </thead>

            <tbody>

                {

                    registros.map((registro) => (

                        <tr key={registro.id}>

                            <td>
                                {
                                    new Date(registro.fechaHora)

                                    .toLocaleString("es-CR")
                                }
                            </td>

                            <td>

                                {registro.usuarioNombre}

                            </td>

                            <td>

                                {registro.accion}

                            </td>

                            <td>

                                {registro.detalle}

                            </td>

                            <td>

                                {registro.incidenteTitulo}

                            </td>

                            <td>

                                <button

                                    onClick={() => onVer(registro)}

                                >

                                    Ver

                                </button>

                            </td>

                        </tr>

                    ))

                }

            </tbody>

        </table>

    );

}

export default TablaBitacora;