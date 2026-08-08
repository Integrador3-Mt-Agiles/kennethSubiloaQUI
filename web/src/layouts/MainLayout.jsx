import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
function MainLayout({ children }) {
    return <div><Navbar /><div className="app-shell"><Sidebar /><main className="main-content"><div className="page">{children}</div></main></div></div>;
}
export default MainLayout;
