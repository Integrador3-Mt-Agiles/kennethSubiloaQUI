import { useNavigate } from "react-router-dom";

function BotonVolver() {
    const navigate = useNavigate();

    const volver = () => {
        if (window.history.state?.idx > 0) {
            navigate(-1);
            return;
        }

        navigate("/dashboard", { replace: true });
    };

    return (
        <button type="button" className="button button-secondary" onClick={volver}>
            ← Volver
        </button>
    );
}

export default BotonVolver;
