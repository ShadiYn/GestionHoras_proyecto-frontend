import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from "../providers/UserProvider";
import '../app/Home.css'; 
import { endInterval, getUserIntervals, startInterval, getWorkDaysForCurrentMonth, getTotalWorkedHoursForCurrentMonth } from '../api/api';

const Home = () => {
  const { setUser } = useUserContext();
  const navigate = useNavigate();
  const { user } = useUserContext(); // Obtener el usuario desde el contexto
  const [, setIntervals] = useState([]); 
  const [intervalId, setIntervalId] = useState(null); 
  const [totalHours, setTotalHours] = useState(0);  
  const userId = user?.id; // Si user es undefined, userId será undefined
  const [workDays, setWorkDays] = useState([]); // Asegúrate de inicializar correctamente




  // Función para convertir un tiempo de formato "HH:mm:ss.SSS" a objeto Date
  const convertTimeToDate = (timeStr) => {
    const [hours, minutes, seconds] = timeStr.split(":");
    const [sec, milli] = seconds.split(".");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes), parseInt(sec), parseInt(milli || 0));
    return date;
  };
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

  // Llamar a la API para obtener las horas totales trabajadas al cargar el componente
  useEffect(() => {
    const fetchTotalHours = async () => {
      try {
        const hours = await getTotalWorkedHoursForCurrentMonth();
        setTotalHours(hours); // Actualiza el estado solo si es necesario
      } catch (error) {
        console.error("Error al obtener las horas trabajadas:", error);
      }
    };

    fetchTotalHours(); // Llamada al cargar el componente
  }, []); 

  // Finalizar el intervalo de trabajo
  const handleEndInterval = async () => {
    try {
      await endInterval(intervalId);
      setIntervalId(null);
      loadIntervals(); 
    } catch (error) {
      console.error("Error al finalizar el intervalo", error);
    }
  };

  // Cargar los intervalos de trabajo para el mes actual
  const loadIntervals = async () => {
    try {
      const currentMonth = new Date().getMonth() + 1;  
      const currentYear = new Date().getFullYear();  
      const userIntervals = await getUserIntervals(userId, currentYear, currentMonth);
      
      const intervals = Array.isArray(userIntervals) ? userIntervals : [userIntervals];
      setIntervals(intervals);
      calculateTotalHours(intervals); 
    } catch (error) {
      console.error("Error al cargar los intervalos:", error);
    }
  };

  // Calcular las horas totales trabajadas para el mes
   // Calcular las horas totales trabajadas para el mes
   const calculateTotalHours = (workDays) => {
    let total = 0;

    workDays.forEach(workDay => {
      const intervals = workDay.intervalsList;

      intervals.forEach(interval => {
        const { start_time, end_time } = interval;

        if (start_time && end_time) {
          // Convertir start_time y end_time a objetos Date
          const startDate = convertTimeToDate(start_time);
          const endDate = convertTimeToDate(end_time);
          
          // Calcular la diferencia en milisegundos
          const durationInMillis = endDate - startDate;
          const durationInHours = durationInMillis / (1000 * 60 * 60); // Convertir a horas

          total += durationInHours;
        }
      });
    });

    setTotalHours(total); // Actualizar el total de horas
    console.log(`Total de horas trabajadas este mes: ${total.toFixed(2)} horas`);
  };

    // Obtener los días de trabajo y calcular las horas totales
    useEffect(() => {
      const loadWorkDays = async () => {
        try {
          const response = await getWorkDaysForCurrentMonth();
          setWorkDays(response); 
          calculateTotalHours(response); // Calcular las horas totales cuando los datos cambien
        } catch (error) {
          console.error('Error al cargar los WorkDays:', error);
        }
      };
  
      if (userId) {
        loadWorkDays();
      }
    }, [userId]);

  // Función que obtiene los días de trabajo del mes actual
  useEffect(() => {
    const loadWorkDays = async () => {
      try {
        const response = await getWorkDaysForCurrentMonth();
        setWorkDays(response); 
        calculateTotalHours(response); 
      } catch (error) {
        console.error('Error al cargar los WorkDays:', error);
      }
    };

    if (userId) {
      loadWorkDays();
    }
  }, [userId]); 

  // Verifica si los datos de WorkDays están siendo correctamente actualizados
  useEffect(() => {
    if (workDays.length > 0) {
      calculateTotalHours(workDays);
    }
  }, [workDays]); 

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
        <button className="action-btn" onClick={handleStartInterval} disabled={!!intervalId}>Check-in</button>
        <button className="action-btn" onClick={handleEndInterval} disabled={!!intervalId}>Check-out</button>
      </div>

      {/* Info Cards */}
      <div className="info-cards">
        <div className="card">
          <h3>Horas del mes</h3>
          <p>{totalHours.toFixed(2)} horas</p>
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
