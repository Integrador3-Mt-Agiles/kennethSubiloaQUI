function TablaUsuarios({

    usuarios,

    onEditar,

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

                    <th>Nombre</th>

                    <th>Correo</th>

                    <th>Rol</th>

                    <th>Activo</th>

                    <th>Acciones</th>

                </tr>

            </thead>

            <tbody>

                {

                    usuarios.map((usuario) => (

                        <tr key={usuario.id}>

                            <td>{usuario.nombre}</td>

                            <td>{usuario.correo}</td>

                            <td>{usuario.rol}</td>

                            <td>

                                {usuario.activo ? "Sí" : "No"}

                            </td>

                            <td>

                                <div className="action-group">
                                    <button
                                        className="button button-secondary button-small"
                                        onClick={() => onEditar(usuario)}
                                    >
                                        Editar
                                    </button>

                                    <button
                                        className="button button-danger button-small"
                                        onClick={() => onEliminar(usuario)}
                                    >
                                        Eliminar
                                    </button>
                                </div>

                            </td>

                        </tr>

                    ))

                }

            </tbody>

        </table>

    );

}

export default TablaUsuarios;
