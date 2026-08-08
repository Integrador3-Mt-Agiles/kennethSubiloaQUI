import MainLayout from "../layouts/MainLayout";
function Dashboard() {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    return <MainLayout><div className="page-header"><div><p className="eyebrow">Panel principal</p><h1>Inicio</h1></div></div><section className="card welcome-card"><h2>Hola{usuario?.nombre ? `, ${usuario.nombre}` : ""}</h2><p>Bienvenido al Sistema de Gestión de Incidentes. Utilice el menú para consultar y gestionar los eventos registrados.</p></section></MainLayout>;
}
export default Dashboard;
