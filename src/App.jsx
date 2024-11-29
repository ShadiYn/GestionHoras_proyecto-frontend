// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useUserContext } from './providers/UserProvider';
import Login from './pages/Login';
import Register from './pages/Register';
import Router from './app/Router'; // Rutas protegidas

const App = () => {
  const { user } = useUserContext(); // Obtenemos el usuario desde el contexto

  return (
    <BrowserRouter>
      <Routes>
        {/* Si el usuario está logueado, redirigimos a las rutas protegidas */}
        {user ? (
          <Route path="*" element={<Router />} />
        ) : (
          <>
            {/* Si no está logueado, redirigimos a Login */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Para cualquier otra ruta, redirigimos a Login */}
            <Route path="*" element={<Login />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
