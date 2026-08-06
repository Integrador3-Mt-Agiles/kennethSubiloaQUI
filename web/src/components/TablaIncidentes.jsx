function TablaIncidentes({

    incidentes,

    onEditar,

    onVer,

    onEliminar

}) {

    return (

        <table

            border="1"

            width="100%"

            cellPadding="10"

        >

            <thead>

                <tr>

                    <th>Título</th>

                    <th>Tipo</th>

                    <th>Estado</th>

                    <th>Reportante</th>

                    <th>Acciones</th>

                    

                </tr>

            </thead>

            <tbody>

                {

                    incidentes.map((incidente) => (

                        <tr key={incidente.id}>

                            <td>{incidente.titulo}</td>

                            <td>{incidente.tipo}</td>

                            <td>{incidente.estado}</td>

                            <td>{incidente.reportanteNombre}</td>

                            <td>

                                <button

                                    onClick={() =>

                                        onEditar(incidente)

                                    }

                                >

                                    Editar

                                </button>

                                {" "}

                                <button

                                    onClick={() =>

                                        onEliminar(incidente)

                                    }

                                >

                                    Eliminar

                                </button>
                                
                                {" "}

                                <button

                                    onClick={() => onVer(incidente)}

                                >

                                    Ver

                                </button>

                                {" "}

                            </td>

                        </tr>

                    ))

                }

            </tbody>

        </table>

    );

}

export default TablaIncidentes;