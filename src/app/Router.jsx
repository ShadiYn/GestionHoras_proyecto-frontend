// Router.jsx
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home"; // Página de inicio
import Calendar from "../pages/Calendar"; // Otra ruta protegida
import Profile from "../pages/Profile";

const Router = () => (
  <Routes>
    <Route path="/home" element={<Home />} /> {/* Ruta de inicio */}
    <Route path="/calendar" element={<Calendar />} /> {/* Ruta de calendario */}
    <Route path="/Perfil" element={<Profile />} />
    <Route path="*" element={<div>404 - Página no encontrada</div>} />{" "}
    {/* Error por si la ruta no existe */}
  </Routes>
);

export default Router;
