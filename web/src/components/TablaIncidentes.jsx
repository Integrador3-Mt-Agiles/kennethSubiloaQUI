function TablaIncidentes({

    incidentes,

    onEditar,

    onVer,

    onEliminar

}) {

    return (

        <div className="card table-card"><table>

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

                    incidentes.length === 0 ? <tr><td className="empty-state" colSpan="5">No hay Eventos registrados.</td></tr> : incidentes.map((incidente) => (

                        <tr key={incidente.id}>

                            <td>{incidente.titulo}</td>

                            <td>{incidente.tipo}</td>

                            <td>{incidente.estado}</td>

                            <td>{incidente.reportanteNombre}</td>

                            <td><div className="action-group">

                                {onEditar && <button className="button button-secondary button-small"

                                    onClick={() =>

                                        onEditar(incidente)

                                    }

                                >

                                    Editar

                                </button>}

                                {" "}

                                {onEliminar && <button className="button button-danger button-small"

                                    onClick={() =>

                                        onEliminar(incidente)

                                    }

                                >

                                    Eliminar

                                </button>}
                                
                                {" "}

                                <button className="button button-primary button-small"

                                    onClick={() => onVer(incidente)}

                                >

                                    Ver

                                </button>

                                {" "}</div>
                            </td>

                        </tr>

                    ))

                }

            </tbody>

        </table></div>

    );

}

export default TablaIncidentes;
