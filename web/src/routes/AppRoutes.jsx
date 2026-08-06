import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Usuarios from "../pages/Usuarios";
import Incidentes from "../pages/Incidentes";
import Observaciones from "../pages/Observaciones";
import Bitacora from "../pages/Bitacora";
import NotFound from "../pages/NotFound";
import DetalleIncidente from "../pages/DetalleIncidente";

function AppRoutes() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/usuarios"
                    element={<Usuarios />}
                />

                <Route
                    path="/incidentes"
                    element={<Incidentes />}
                />

                <Route

                    path="/incidentes/:id"

                    element={<DetalleIncidente />}

                />


                <Route
                    path="/observaciones"
                    element={<Observaciones />}
                />

                <Route
                    path="/bitacora"
                    element={<Bitacora />}
                />

                <Route
                    path="*"
                    element={<NotFound />}
                />

            </Routes>

        </BrowserRouter>

    );

}

export default AppRoutes;