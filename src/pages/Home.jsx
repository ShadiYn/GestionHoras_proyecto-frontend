import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from "../providers/UserProvider";
import axios from 'axios';  // Asegúrate de tener axios instalado
import '../app/Home.css'; 

const Home = () => {
  const { setUser } = useUserContext();
  const navigate = useNavigate();
  
  // Estado para almacenar los intervalos y las horas trabajadas
  const [intervals, setIntervals] = useState([]);
  const [totalHours, setTotalHours] = useState(0);
  
  const userId = 1;  // Suponiendo que el userId es 1 por ahora

  const handleCalendar = () => {
    navigate("/calendar");
  };
  
  const handlePerfil = () => {
    navigate("/Perfil");
  };
  
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    navigate("/login");
  };

  

  // Función para calcular el total de horas trabajadas
  



  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-links">
          <button className="nav-btn" onClick={handleCalendar}>Calendario</button>
          <button className="nav-btn" onClick={handlePerfil}>Perfil</button>
          <button className="nav-btn logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {/* Check-in and Check-out Buttons */}
      <div className="action-buttons">
        <button className="action-btn">Check-in</button>
        <button className="action-btn">Check-out</button>
      </div>

      {/* Info Cards */}
      <div className="info-cards">
        <div className="card">
          <h3>Horas del mes</h3>
          <p>{totalHours.toFixed(2)} horas trabajadas hasta ahora</p>
        </div>
        <div className="card">
          <h3>Ausencias</h3>
          <p>total ausencias</p>
        </div>
        <div className="card">
          <h3>Horas Complementarias</h3>
          <p>dependiendo de las horas que tenga</p>
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <h2>Total aproximado a cobrar:</h2>
        <p>Total a cobrar = Horas mes * precio fijo + Horas Complementarias * PrecioHora complementaria</p>
      </div>

      {/* Explanation Section */}
      <div className="explicacion">
        <p>Se podrán hacer más de un check-in/check-out para contar los descansos realizados</p>
        <p>Finalmente, una tarjeta que implementa las horas trabajadas ese día</p>
      </div>
    </div>
  );
};

export default Home;
