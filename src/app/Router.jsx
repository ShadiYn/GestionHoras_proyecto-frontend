import { Route, Routes } from "react-router-dom";

import Home from '../pages/Home';
import Calendar from '../pages/Calendar';

const Router = ()=>(
    <Routes>
    <Route index element={<Home />} />

    <Route path="/calendar" element={<Calendar />} />
    


   
    {/* Es muy recomendable añadir esta ruta para obtener un mensaje de error en el caso de que la ruta no exista. De lo contrario, si la ruta no existe llegaremos a una página en blanco */}
    <Route path="*" element={<div>404</div>} />
  </Routes>
);

export default Router;