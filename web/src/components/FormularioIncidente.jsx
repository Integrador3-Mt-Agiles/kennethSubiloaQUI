import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { crearIncidente, actualizarIncidente } from "../services/incidente.service";
import { obtenerUsuariosPorRol } from "../services/usuario.service";
import { subirEvidencia } from "../services/evidencia.service";

function FormularioIncidente({ incidente, onGuardar }) {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const navigate = useNavigate();
    const [titulo, setTitulo] = useState(incidente?.titulo || "");
    const [descripcion, setDescripcion] = useState(incidente?.descripcion || "");
    const [tipo, setTipo] = useState(incidente?.tipo || "Incidente");
    const [ubicacion, setUbicacion] = useState(incidente?.ubicacion || "");
    const [fechaIncidente, setFechaIncidente] = useState(incidente?.fechaIncidente || "");
    const [reportanteId, setReportanteId] = useState(incidente?.reportanteId || (usuario?.rol === "Reportante" ? usuario.id : ""));
    const [reportantes, setReportantes] = useState([]);
    const [imagenes, setImagenes] = useState([]);

    useEffect(() => {
        if (usuario?.rol !== "Administrador") return;
        obtenerUsuariosPorRol("Reportante").then(setReportantes).catch(console.error);
    }, [usuario?.rol]);
    const guardarIncidente = async (e) => {
        e.preventDefault();
        const datos = { titulo, descripcion, tipo, ubicacion, fechaIncidente, reportanteId };
        try {
            if (incidente) { await actualizarIncidente(incidente.id, datos); alert("Incidente actualizado correctamente."); }
            else {
                const respuesta = await crearIncidente(datos);
                if (imagenes.length > 0) for (const imagen of imagenes) await subirEvidencia(respuesta.usuario?.id || respuesta.incidente?.id || respuesta.id, imagen);
                alert("Incidente registrado correctamente.");
            }
            onGuardar();
        } catch (error) { console.error(error); alert(error.response?.data?.mensaje || error.message); }
    };

    return <form onSubmit={guardarIncidente}>
        <div className="form-grid">
            <div className="field field-full"><label htmlFor="titulo">Título</label><input id="titulo" type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} required placeholder="Ej. Fuga de agua en el pasillo" /></div>
            <div className="field field-full"><label htmlFor="descripcion">Descripción</label><textarea id="descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required placeholder="Describa brevemente lo ocurrido" /></div>
            <div className="field"><label htmlFor="tipo">Tipo de evento</label><select id="tipo" value={tipo} onChange={(e) => setTipo(e.target.value)}><option value="Incidente">Incidente</option><option value="Accidente">Accidente</option></select></div>
            <div className="field"><label htmlFor="fecha">Fecha</label><input id="fecha" type="date" value={fechaIncidente} onChange={(e) => setFechaIncidente(e.target.value)} required /></div>
            <div className="field field-full"><label htmlFor="ubicacion">Ubicación</label><input id="ubicacion" type="text" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} required placeholder="Indique dónde ocurrió" /></div>
            {usuario?.rol === "Administrador" && <div className="field field-full"><label htmlFor="reportante">Reportante</label><select id="reportante" value={reportanteId} onChange={(e) => setReportanteId(e.target.value)}><option value="">Seleccione un reportante</option>{reportantes.map((item) => <option key={item.id} value={item.id}>{item.nombre}</option>)}</select></div>}
            <div className="field field-full"><label htmlFor="evidencias">Evidencias fotográficas</label><input id="evidencias" type="file" multiple accept="image/*" onChange={(e) => setImagenes(Array.from(e.target.files))} /></div>
        </div>
        <div className="form-actions"><button type="button" className="button button-secondary" onClick={() => navigate("/dashboard")}>← Volver al menú</button><button type="submit" className="button button-primary">{incidente ? "Actualizar incidente" : "Guardar incidente"}</button></div>
    </form>;
}
export default FormularioIncidente;
