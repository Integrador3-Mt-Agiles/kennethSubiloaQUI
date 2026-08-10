import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BotonVolver from "../components/BotonVolver";

function MainLayout({ children, mostrarVolver = true }) {
    return <div><Navbar /><div className="app-shell"><Sidebar /><main className="main-content"><div className="page">{mostrarVolver && <div className="page-navigation"><BotonVolver /></div>}{children}</div></main></div></div>;
}
export default MainLayout;
