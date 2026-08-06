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

                                <button
                                    onClick={() => onEditar(usuario)}
                                >
                                    Editar
                                </button>

                                {" "}

                                <button
                                    onClick={() => onEliminar(usuario)}
                                >
                                    Eliminar
                                </button>

                            </td>

                        </tr>

                    ))

                }

            </tbody>

        </table>

    );

}

export default TablaUsuarios;