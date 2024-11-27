import Router from "./app/Router";

import { useUserContext } from "./providers/UserProvider";

import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Asegúrate de importar Routes y Route

import Login from './Pages/Login'

import Register from './pages/Register'

const App = () => {
  const { user } = useUserContext();
  return (
    <BrowserRouter>
      <Routes>
        {/* El componente Router debería manejar las rutas internas */}
        {user ? (
          <Route path="*" element={<Router />} />
        ) : (
          <>
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Login />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
