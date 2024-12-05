import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from "../providers/UserProvider";
import '../app/Home.css'; 
import { endInterval, getUserIntervals, startInterval, getOrCreateCurrentWorkDay } from '../api/api';

const Home = () => {
  const { setUser } = useUserContext();
  const navigate = useNavigate();
  const { user } = useUserContext(); // Obtener el usuario desde el contexto
  const [, setIntervals] = useState([]);
  const [intervalId, setIntervalId] = useState(null); // ID del intervalo activo
  const [totalHours, setTotalHours] = useState(0);
  const userId = user?.id; // Si user es undefined, userId será undefined
  const [, setWorkdayId] = useState(null);

  // Iniciar el intervalo de trabajo
  const handleStartInterval = async () => {
    if (!userId) {
      console.error("userId no está definido o es inválido");
      return;
    }
    try {
      const newIntervalId = await startInterval(userId);
      setIntervalId(newIntervalId);
    } catch (error) {
      console.error("Error al iniciar el intervalo", error);
    }
  };

  // Finalizar el intervalo de trabajo
  const handleEndInterval = async () => {
    try {
      await endInterval(intervalId);
      setIntervalId(null);
      loadIntervals();  // Vuelve a cargar los intervalos después de finalizar
    } catch (error) {
      console.error("Error al finalizar el intervalo", error);
    }
  };

  // Cargar los intervalos de trabajo para el mes actual
  const loadIntervals = async () => {
    try {
      const currentMonth = new Date().getMonth() + 1;  // Mes actual (1-12)
      const currentYear = new Date().getFullYear();  // Año actual

      // Llamar a la API para obtener los intervalos de ese mes
      const userIntervals = await getUserIntervals(userId, currentYear, currentMonth);
      
      // Filtrar y manejar la respuesta como un array
      const intervals = Array.isArray(userIntervals) ? userIntervals : [userIntervals];
      
      setIntervals(intervals);
      calculateTotalHours(intervals); // Calcula el total de horas para este mes
    } catch (error) {
      console.error("Error al cargar los intervalos:", error);
    }
  };

  // Calcular las horas totales trabajadas para el mes
  const calculateTotalHours = (intervals) => {
    let total = 0;
    
    // Recorre todos los intervalos
    intervals.forEach(({ start_time, end_time }) => {
      if (start_time && end_time) {
        const [startHour, startMinute] = start_time.split(":").map(Number);
        const [endHour, endMinute] = end_time.split(":").map(Number);

        // Crear objetos Date para la hora de inicio y fin del intervalo
        const currentDate = new Date();  // Usamos la fecha actual para no cambiar el día, solo hora y minutos
        const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), startHour, startMinute);
        const end = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), endHour, endMinute);

        // Calcular la duración en horas
        const duration = (end - start) / (1000 * 60 * 60); // Convertido en horas
        total += duration; // Sumar la duración al total
      }
    });

    setTotalHours(total); // Establecer el total de horas en el estado
  };

  // Inicializar o obtener el WorkDay del usuario
  useEffect(() => {
    const initWorkDay = async () => {
      if (userId) {
        const workDay = await getOrCreateCurrentWorkDay();
        setWorkdayId(workDay.id); // Establecer el ID del WorkDay
      }
    };

    initWorkDay();
  }, [userId]);

  // Cargar los intervalos cuando el usuario cambia
  useEffect(() => {
    if (userId) {
      loadIntervals();
    }
  }, [userId]);

  // Navegar al calendario
  const handleCalendar = () => {
    navigate("/calendar");
  };

  // Navegar al perfil
  const handlePerfil = () => {
    navigate("/Perfil");
  };

  // Cerrar sesión
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
          <button className="nav-btn" onClick={handleCalendar}>Calendario</button>
          <button className="nav-btn" onClick={handlePerfil}>Perfil</button>
          <button className="nav-btn logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {/* Check-in and Check-out Buttons */}
      <div className="action-buttons">
        <button className="action-btn" onClick={handleStartInterval} disabled={!!intervalId}>Check-in</button>
        <button className="action-btn" onClick={handleEndInterval} disabled={!!intervalId}>Check-out</button>
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
