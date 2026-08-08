import { NavLink } from "react-router-dom";
function Sidebar() {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const cerrarSesion = () => { localStorage.removeItem("token"); localStorage.removeItem("usuario"); window.location.href = "/"; };
    return <aside className="sidebar"><p className="sidebar-label">Menú principal</p><nav><ul className="nav-list">
        <li><NavLink className="nav-link" to="/dashboard"><span className="nav-icon">⌂</span>Inicio</NavLink></li>
        <li><NavLink className="nav-link" to="/incidentes"><span className="nav-icon">⚑</span>Eventos</NavLink></li>
        {usuario?.rol === "Administrador" && <><li><NavLink className="nav-link" to="/usuarios"><span className="nav-icon">♙</span>Usuarios</NavLink></li><li><NavLink className="nav-link" to="/bitacora"><span className="nav-icon">▤</span>Bitácora</NavLink></li></>}
        <li><button className="logout-button" onClick={cerrarSesion}>↪ &nbsp;Cerrar sesión</button></li>
    </ul></nav></aside>;
}
export default Sidebar;
