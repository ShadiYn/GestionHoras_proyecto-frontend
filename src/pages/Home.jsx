import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from "../providers/UserProvider";
import '../app/Home.css'; 
import { getUserIntervals, getWorkDaysForCurrentMonth, getTotalWorkedHoursForCurrentMonth, checkAndCreateAutoWorkday, functionCheckOut, getAllIntervals, getCurrentInterval } from '../api/api';

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

  const handleCheckAndCreate = async () => {
    try {
      const response = await checkAndCreateAutoWorkday();
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

  const handleCheckOut = async () => {
    try {
      const interval = await getCurrentInterval();
      console.log("Interval obtenido:", interval); 
      
      if (!interval || !interval.id) {
        console.error("No se encontró un intervalo válido.");
        return;
      }
  
      await functionCheckOut(interval.id); 
  
      await loadIntervals();  
      alert("Check-out registrado correctamente!");
    } catch (error) {
      console.error("Error al registrar el check-out:", error);
      alert("Tienes que hacer check-in para poder realizar el check-out");
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

  
  
  
  
  // Solo cargar los intervalos si no estamos en estado de carga
  useEffect(() => {
    if (!isLoading && intervalId) {
      loadIntervals(); // Cargar los intervalos solo cuando el intervalId esté disponible
    }
  }, [isLoading, intervalId]); // Dependencias para que se ejecute cuando intervalId esté disponible
  
  useEffect(() => {
    // Este useEffect solo se ejecuta cuando intervalId está disponible
    if (intervalId) {
      loadIntervals();
    }
  }, [intervalId]);  // Solo se ejecuta cuando intervalId cambia
  


  // Cargar intervalos de usuario
  const loadIntervals = async () => {
    if (!intervalId || isNaN(intervalId)) {
      console.error("Interval ID no es válido:", intervalId);
      setError("Interval ID no definido o no es válido.");
      return;  
    }
  
    try {
      const response = await getUserIntervals(intervalId);
      console.log("Respuesta de getUserIntervals:", response);
      
      if (!response || !response.intervalsList) {
        console.error("La respuesta no contiene intervalos válidos");
        setError("No se pudieron cargar los intervalos.");
        return;
      }
  
      let userIntervals = response.intervalsList || [];
      if (userIntervals.length === 0) {
        userIntervals = await getAllIntervals(); // Si no hay intervalos, obtenemos todos los intervalos
      }
  
      setIntervals(userIntervals);
    } catch (error) {
      console.error("Error al cargar los intervalos:", error);
      setError("Error al obtener los intervalos.");
    }
  };
  

  
  

  // Efecto para cargar intervalos si intervalId está disponible y no está en carga
  useEffect(() => {
    if (intervalId && !isLoading) {
      loadIntervals();
    } else {
      console.warn("Interval ID aún no está disponible o está en carga.");
    }
  }, [intervalId, isLoading]); // Se ejecuta solo cuando intervalId cambia o la carga de intervalId termina

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
  }, []); // Se ejecuta solo una vez cuando el componente se monta

  useEffect(() => {
    const loadWorkDays = async () => {
      try {
        const response = await getWorkDaysForCurrentMonth();
        console.log("Respuesta de la API de WorkDays:", response);
        
        // Verificar que la respuesta sea un array con datos
        if (Array.isArray(response) && response.length > 0) {
          setWorkDays(response);  // Establecer el estado correctamente
          calculateTotalHours(response);  // Calcular las horas totales
        } else {
          console.warn("La respuesta no contiene datos de WorkDays o está vacía:", response);
          setWorkDays([]);  // Si no hay datos, establecer un arreglo vacío
        }
      } catch (error) {
        console.error("Error al cargar los WorkDays:", error);
      }
    };
  
    if (userId) {
      loadWorkDays();  // Llamada para cargar los workdays cuando el userId esté disponible
    }
  }, [userId]);  // Dependencia: se ejecuta cuando `userId` cambia // Ejecutar cuando el userId cambie
  
  
  // Función para calcular la duración en horas, valida si las fechas son correctas
  const duration = (start, end) => {
    console.log("Start:", start, "End:", end);  // Verifica los valores de las fechas
    if (start && end && !isNaN(start) && !isNaN(end)) {
      if (end >= start) {
        return (end - start) / 1000 / 60 / 60;  // Convertir a horas
      } else {
        console.warn("La fecha de fin es anterior a la de inicio.");
        return 0;
      }
    }
    console.warn("Fechas no válidas:", start, end);
    return 0;
  };


// Calcular las horas totales trabajadas para el mes
const calculateTotalHours = (workDays) => {
  if (!Array.isArray(workDays) || workDays.length === 0) {
    console.warn("workDays no es un arreglo válido o está vacío.");
    setTotalHours(0);
    return;
  }

  let total = 0;
  workDays.forEach(workDay => {
    const intervals = workDay.intervalsList || []; 
    intervals.forEach(interval => {
      const { start_time, end_time } = interval;

      // Validar los valores antes de pasarlos a convertTimeToDate
      if (!start_time || !end_time) {
        console.warn("Intervalo inválido:", interval);
        return; // Saltar este intervalo si es inválido
      }

      const startDate = convertTimeToDate(start_time);
      const endDate = convertTimeToDate(end_time);

      total += duration(startDate, endDate);
    });
  });

  setTotalHours(total);
  console.log(`Total de horas trabajadas este mes: ${total.toFixed(2)} horas`);
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
          <button onClick={handleCheckOut}>Cerrar Intervalo</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      </div>

      <div>
    {intervals.length === 0 ? (
      <p>No se han encontrado intervalos</p>
    ) : (
      intervals.map(interval => (
        <div key={interval.id}>
          {/* Muestra información del intervalo aquí */}
        </div>
      ))
    )}
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
