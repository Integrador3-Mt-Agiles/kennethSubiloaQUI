import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "../components/ProtectedRoute";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Usuarios from "../pages/Usuarios";
import Incidentes from "../pages/Incidentes";
import Observaciones from "../pages/Observaciones";
import Bitacora from "../pages/Bitacora";
import NotFound from "../pages/NotFound";
import DetalleIncidente from "../pages/DetalleIncidente";

const proteger = (componente, roles) => (
    <ProtectedRoute roles={roles}>{componente}</ProtectedRoute>
);

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={proteger(<Dashboard />)} />
                <Route
                    path="/usuarios"
                    element={proteger(<Usuarios />, ["Administrador"])}
                />
                <Route path="/incidentes" element={proteger(<Incidentes />)} />
                <Route
                    path="/incidentes/:id"
                    element={proteger(<DetalleIncidente />)}
                />
                <Route path="/observaciones" element={proteger(<Observaciones />)} />
                <Route
                    path="/bitacora"
                    element={proteger(<Bitacora />, ["Administrador"])}
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;
