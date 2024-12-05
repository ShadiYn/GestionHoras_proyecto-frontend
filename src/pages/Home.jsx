import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from "../providers/UserProvider";
import axios from 'axios';  // Asegúrate de tener axios instalado
import '../app/Home.css'; 
import { endInterval, getUserIntervals, startInterval,getOrCreateCurrentWorkDay } from '../api/api';

const Home = () => {
  const { setUser } = useUserContext();
  const navigate = useNavigate();
  const { user } = useUserContext(); // Obtener el usuario desde el contexto
  const [intervals, setIntervals] = useState([]);
  const [intervalId, setIntervalId] = useState(null); // ID del intervalo activo
  const [totalHours, setTotalHours] = useState(0);
  const userId = user?.id; // Si user es undefined, userId será undefined

  const handleStartInterval = async () => {
    // Verificar si el userId está disponible y no es undefined o null
    console.log("Valor de userId:", userId); // Esto te ayudará a verificar que el userId está bien
    if (!userId) {
      console.error("userId no está definido o es inválido");
      return;
    }
    try {
      const newIntervalId = await startInterval(userId);
      setIntervalId(newIntervalId); // guardar el id del intervalo
      console.log("intervalo iniciado en:", newIntervalId);
    } catch (error) {
      console.error("Error al iniciar el intervalo", error);
    }
  };

  //obtener o crear workday
  useEffect(() => {
    const initWorkDay = async () => {
        try {
            if (userId) {
                const workDay = await getOrCreateCurrentWorkDay();
                console.log("WorkDay inicializado:", workDay);
                // Aquí podrías guardar el WorkDay en un estado si es necesario
            } else {
                console.error("El userId es undefined. No se puede inicializar el WorkDay.");
            }
        } catch (error) {
            console.error("Error al inicializar el WorkDay:", error);
        }
    };

    initWorkDay();
}, [userId]);
  
  

  const handleEndInterval = async ()=>{
    try{
      await endInterval(intervalId);
      setIntervalId(null);
      console.log("intervalo finalizado");
      loadIntervals();
    }catch(error){
      console.error("Error al finalizar el intervalo",error);
    }
  };
  const loadIntervals = async () => {
    try {
      const userIntervals = await getUserIntervals(userId);
      console.log("Intervalos recibidos:", userIntervals);
      
      // Verifica si la respuesta es un solo objeto, lo convierte a un array
      const intervals = Array.isArray(userIntervals) ? userIntervals : [userIntervals];
      
      setIntervals(intervals); // Siempre manejamos como un array
      calculateTotalHours(intervals); // Calculamos las horas totales
    } catch (error) {
      console.error("Error al cargar los intervalos:", error);
    }
  };
  

  useEffect(() => {
    if (userId) {
      loadIntervals();
    } else {
      console.error("El userId es undefined. No se puede cargar los intervalos.");
    }
  }, [userId]);  // Dependemos de `userId` para que se ejecute correctamente
  
  

  useEffect(() => {
    if (userId) {
      loadIntervals();
    } else {
      console.error("El userId es undefined. No se puede cargar los intervalos.");
    }
  }, [userId]);  // Dependemos de `userId` para que se ejecute correctamente
  
  



  //calculat total horas
  const calculateTotalHours = (intervals) => {
    if (!Array.isArray(intervals)) {
      console.error("Expected intervals to be an array, but received:", intervals);
      return;
    }
  
    let total = 0;
    intervals.forEach(({ start_time, end_time }) => {
      if (start_time && end_time) {
        const currentDate = new Date(); // Fecha actual
        const [startHour, startMinute] = start_time.split(":").map(Number);
        const [endHour, endMinute] = end_time.split(":").map(Number);
  
        // Crear objeto Date con fecha actual y hora/minutos específicos
        const start = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate(), // Cambié getDay() por getDate() para obtener el día del mes
          startHour,
          startMinute
        );
  
        const end = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate(), // Cambié getDay() por getDate()
          endHour,
          endMinute
        );
  
        // Calcular la duración en horas
        const duration = (end - start) / (1000 * 60 * 60); // Convertido en horas
        total += duration;
      }
    });
  
    setTotalHours(total);
  };
  


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
