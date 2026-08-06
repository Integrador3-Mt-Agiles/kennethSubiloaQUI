function ListaObservaciones({ observaciones }) {

    if (observaciones.length === 0) {

        return (

            <p>

                No hay observaciones.

            </p>

        );

    }

    return (

        <div>

            {

                observaciones.map((obs) => (

                    <div
                        key={obs.id}
                        style={{
                            border: "1px solid #ccc",
                            padding: "10px",
                            marginBottom: "10px"
                        }}
                    >

                        <strong>

                            {obs.usuarioNombre}

                        </strong>

                        <br />

                        <small>

                            {obs.fecha}

                        </small>

                        <p>

                            {obs.comentario}

                        </p>

                    </div>

                ))

            }

        </div>

    );

}

export default ListaObservaciones;