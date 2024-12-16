import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from "../providers/UserProvider";
import '../app/Home.css'; 
import {getNumberUnattended, getUserIntervals, getWorkDaysForCurrentMonth, getTotalWorkedHoursForCurrentMonth,   getAllIntervals, getCurrentInterval, createWorkDayWithFirstInterval, handleCheckOut} from '../api/api';

const Home = () => {
  const { setUser } = useUserContext();
  const navigate = useNavigate();
  const { user } = useUserContext();
  const [intervals, setIntervals] = useState([]); 
  const [intervalId, setIntervalId] = useState(null);
  const [totalHours, setTotalHours] = useState(0);  
  const userId = user?.id;
  const [error, setError] = useState(null);
  const [, setWorkDays] = useState([]);  
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true); 
  const [unattended, setUnattended] = useState(27); 

  const handleCheckAndCreate = async () => {
    try {
      const response = await createWorkDayWithFirstInterval();
      if (response.status === 201) {
        setStatusMessage(response.data);
        console.log("Operación exitosa:", response.data);
      }
    } catch (error) {
      if (error.response?.status === 400) {
        setStatusMessage(error.response.data);
      } else {
        setStatusMessage("Error inesperado al procesar la solicitud.");
      }
      console.error("Error en el manejo de la operación:", error.response?.data || error.message);
    }
  };

  const handleCheckOutClick = async () => {
    try {
      const interval = await getCurrentInterval();
      console.log("Intervalo obtenido:", interval); 
      
      if (!interval || !interval.id) {
        console.error("No se encontró un intervalo válido.");
        alert("Tienes que hacer check-in para poder realizar el check-out.");
        return;
      }
  
      // Llamar la función de check-out desde api.js
      await handleCheckOut(interval.id); 
  
      // Recargar los intervalos después del check-out
      await loadIntervals();  
      alert("Check-out registrado correctamente!");
    } catch (error) {
      console.error("Error al registrar el check-out:", error);
      alert("Hubo un error al registrar el check-out.");
    }
  };
  
  const convertTimeToDate = (timeStr) => {
    if (!timeStr || typeof timeStr !== 'string') {
        console.warn("Invalid time string received:", timeStr);
        return new Date(0); // Devuelve una fecha por defecto o maneja el error según el caso
    }

    const [hours, minutes, seconds] = timeStr.split(":");
    const [sec, milli] = seconds ? seconds.split(".") : [0, 0]; // Maneja casos donde `seconds` puede ser undefined
    const date = new Date();
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10), parseInt(sec, 10), parseInt(milli || 0, 10));
    return date;
  };

  useEffect(() => {
    const fetchCurrentInterval = async () => {
      setIsLoading(true);
      try {
        const interval = await getCurrentInterval();
        console.log('Respuesta completa de getCurrentInterval:', interval);  // Ver toda la respuesta
        
        if (interval && interval.id) {
          setIntervalId(interval.id);
        } else {
          console.warn("No se encontró un intervalo válido.");
          setIntervalId(null);
        }
      } catch (error) {
        console.error('Error al obtener el intervalo actual:', error);
        setIntervalId(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCurrentInterval();
  }, []); 

  useEffect(() => {
    if (!isLoading && intervalId) {
      loadIntervals(); 
    }
  }, [isLoading, intervalId]); 

  const loadIntervals = async () => {
  if (!intervalId || isNaN(intervalId)) {
    console.error("Interval ID no es válido:", intervalId);
    setError("Interval ID no definido o no es válido.");
    return;  
  }

  try {
    const response = await getCurrentInterval();
    console.log("Respuesta de getUserIntervals:", response);

    let userIntervals = response.intervalsList || [];
    if (userIntervals.length === 0) {
      userIntervals = await getAllIntervals(); // Si no hay intervalos, obtenemos todos los intervalos
    }

    setIntervals(userIntervals);
  } catch (error) {
    console.error("Error al cargar los intervalos:", error);
    
  }
};

  useEffect(() => {
    const fetchTotalHours = async () => {
      try {
        const hours = await getTotalWorkedHoursForCurrentMonth();
        setTotalHours(hours); 
      } catch (error) {
        console.error("Error al obtener las horas trabajadas:", error);
      }
    };

    fetchTotalHours(); 
  }, []); 

  useEffect(() => {
    const fetchUnattended = async () => {
      try {
        const unattended = await getNumberUnattended();
        setUnattended(unattended); 
      } catch (error) {
        console.error("Error al obtener las horas trabajadas:", error);
      }
    };

    fetchUnattended(); 
  }, []); 


  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    navigate("/login");
  };
  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-links">
          <button className="nav-btn" onClick={() => navigate("/calendar")}>Calendario</button>
          <button className="nav-btn" onClick={() => navigate("/Perfil")}>Perfil</button>
          <button className="nav-btn logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {/* Check-in and Check-out Buttons */}
      <div className="action-buttons">
        <div className="home">
          <h1>Gestión de WorkDays</h1>
          <button onClick={handleCheckAndCreate}>Registrar Check-in</button>
          {statusMessage && <p>{statusMessage}</p>}
        </div>

        <div>
          <h1>Cerrar Intervalo</h1>
          <p>Intervalo ID: {intervalId}</p>
          <button onClick={handleCheckOutClick}>Cerrar Intervalo</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      </div>



      {/* Info Cards */}
      <div className="info-cards">
        <div className="card">
          <h3>Horas del mes</h3>
          <p>{totalHours.toFixed(2)} horas</p>
        </div>
        <div className="card">
          <h3>Ausencias</h3>
          <p>{unattended}</p>
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
