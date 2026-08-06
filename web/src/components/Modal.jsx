function Modal({ abierto, titulo, children, onClose }) {

    if (!abierto) return null;

    return (

        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >

            <div
                style={{
                    backgroundColor: "#fff",
                    padding: "20px",
                    borderRadius: "8px",
                    width: "500px",
                    maxWidth: "90%"
                }}
            >

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}
                >

                    <h2>{titulo}</h2>

                    <button onClick={onClose}>
                        X
                    </button>

                </div>

                <hr />

                {children}

            </div>

        </div>

    );

}

export default Modal;