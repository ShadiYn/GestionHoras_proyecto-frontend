import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../providers/UserProvider";
import "../app/Home.css";
import {
  createWorkdayflexible,
  getNumberUnattended,
  getUserIntervals,
  getAllIntervals,
  getCurrentInterval,
  createWorkDayWithFirstInterval,
  handleCheckOut,
  getWorkDaysForCurrentMonth,
  getIntervalsForWorkDay,
  userDetails,
} from "../api/api";

const Home = () => {
  const { setUser } = useUserContext();
  const navigate = useNavigate();
  const { user } = useUserContext();
  const [, setIntervals] = useState([]);
  const [intervalId, setIntervalId] = useState(null);
  const [totalHours, setTotalHours] = useState(0);
  const userId = user?.id;
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [unattended, setUnattended] = useState(27);
  const [, setLoading] = useState(true);
  const [, setExtraHours] = useState(0);
  const [totalToCharge, setTotalToCharge] = useState(0);
  const [userInfo, setUserInfo] = useState(null);
  const [isFlexibleInputVisible, setFlexibleInputVisible] = useState(false);
  const [flexibleInput, setFlexibleInput] = useState(""); // State to store the input value

  // UseEffect para obtener los datos del usuario cuando se monte el componente
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          const userData = await userDetails(token); // Suponiendo que userDetails es la función para obtener datos del backend.
          setUserInfo(userData);
        } else {
          console.log("Token no encontrado");
        }
      } catch (error) {
        console.error("Error al obtener los detalles del usuario:", error);
      } finally {
        setIsLoading(false); // Cambiar estado de carga a false después de recibir los datos.
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    if (userInfo && userInfo.requiredHours != null) {
      const eurosPerHour = userInfo.eurosPerHour || 0;
      const eurosExtraPerHour = userInfo.eurosPerExtraHours || 0;

      const extra = calculateExtraHours();
      const totalHoursMinusExtra = totalHours - extra;
      const total =
        totalHoursMinusExtra * eurosPerHour + extra * eurosExtraPerHour;

      setExtraHours(extra);
      setTotalToCharge(total);

      // También puedes establecer las horas restantes aquí si lo necesitas
      const horasMes = userInfo.requiredHours * 4;
      const horasPorCumplir = horasMes - totalHours;
      console.log("Horas restantes:", horasPorCumplir);
    }
  }, [userInfo, totalHours]);

  useEffect(() => {
    const fetchUserMonthlyHours = async () => {
      if (userId) {
        await fetchAndCalculateUserMonthlyHours(userId);
      }
    };

    fetchUserMonthlyHours();
  }, [userId]);

  const calculateExtraHours = () => {
    if (!userInfo || userInfo.requiredHours == null) {
      return 0; // Si userInfo es null o requiredHours no está definido, retornamos 0
    }

    const MonthHours = userInfo.requiredHours * 4;
    if (totalHours > MonthHours) {
      const extraTotal = totalHours - MonthHours;
      console.log("Respuesta horas extra:", extraTotal);
      return extraTotal;
    }
    return 0; // Si no hay horas extra
  };

  const handleFlexible = () => {
    setFlexibleInputVisible(true); // Show the input and button
  };
  // Handle the button click to process the input
  const handleFlexibleSubmit = () => {
    createWorkdayflexible(flexibleInput);
    console.log("Flexible input value:", flexibleInput);
    setFlexibleInput(""); // Clear the input field
    setFlexibleInputVisible(false); // Hide the input and button after submission
  };
  const handleCheckAndCreate = async () => {
    try {
      const response = await createWorkDayWithFirstInterval();
      if (response === "User is flexible.") {
        handleFlexible();
        setStatusMessage(response.data);
        console.log("Operación exitosa:", response.data);
      }
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
      console.error(
        "Error en el manejo de la operación:",
        error.response?.data || error.message
      );
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
    } catch (error) {
      console.error("Error al registrar el check-out:", error);
      alert("Hubo un error al registrar el check-out.");
    }
  };

  const convertToFullDate = (timeStr) => {
    if (!timeStr) return null;

    const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
    let fullDateStr = timeStr.includes("T") ? timeStr : `${today}T${timeStr}Z`;
    const date = new Date(fullDateStr);

    if (isNaN(date.getTime())) {
      console.warn("Hora inválida:", timeStr);
      return null; // Si no es válida, devolvemos null
    }

    return date;
  };

  const fetchAndCalculateUserMonthlyHours = async () => {
    try {
      const response = await getUserIntervals(); // Llamada a la API

      let intervals2 = response.data || []; // Asignamos un array vacío si no hay datos

      if (!Array.isArray(intervals2)) {
        intervals2 = []; // Asegurarnos de que sea un array
      }

      // Filtramos los intervalos (por ejemplo, para fechas válidas)
      const validIntervals = intervals2.filter((interval) => {
        console.log(
          "Start Time:",
          interval.startTime,
          "End Time:",
          interval.endTime
        ); // Verifica los valores
        return interval.startTime && interval.endTime;
      });
      console.log("Intervalos válidos:", validIntervals); // Verifica los intervalos válidos

      // Calculamos las horas totales
      const totalHours = validIntervals.reduce((total, interval) => {
        const start = convertToFullDate(interval.startTime); // Convertir a Date
        const end = convertToFullDate(interval.endTime); // Convertir a Date

        if (start && end) {
          // Si ambas fechas son válidas, calculamos la diferencia en horas
          total += (end - start) / 1000 / 60 / 60; // Calculamos en horas
        }
        return total;
      }, 0);

      console.log("Total horas trabajadas en el mes:", totalHours);
      setTotalHours(totalHours); // Actualizamos el estado con el total de horas
    } catch (error) {
      console.error(
        "Error al calcular las horas mensuales del usuario:",
        error
      );
    }
  };

  useEffect(() => {
    const fetchUserMonthlyHours = async () => {
      if (userId) {
        await fetchAndCalculateUserMonthlyHours(userId); // Llamada para obtener y calcular las horas
      }
    };

    fetchUserMonthlyHours();
  }, [userId]); // Se ejecuta cada vez que el userId cambia

  useEffect(() => {
    const fetchCurrentInterval = async () => {
      setIsLoading(true);
      try {
        const interval = await getCurrentInterval();
        console.log("Respuesta completa de getCurrentInterval:", interval); // Verifica toda la respuesta

        if (interval && interval.id) {
          setIntervalId(interval.id);
        } else {
          console.warn("No se encontró un intervalo válido.");
          setIntervalId(null);
        }
      } catch (error) {
        console.error("Error al obtener el intervalo actual:", error);
        setIntervalId(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCurrentInterval();
  }, []);

  useEffect(() => {
    // Función para obtener los workdays y calcular las horas trabajadas
    const fetchTotalWorkedHours = async () => {
      try {
        // Obtener los Workdays del mes actual
        const workdays = await getWorkDaysForCurrentMonth();

        let totalHoursWorked = 0;

        for (const workday of workdays) {
          // Obtener los intervalos de cada workday
          const intervals = await getIntervalsForWorkDay(workday.id);

          intervals.forEach((interval) => {
            const { start_time, end_time } = interval;

            // Calcular la duración del intervalo en horas usando la función
            const duration = calculateDurationInHours(start_time, end_time);

            totalHoursWorked += duration;
          });
        }

        setTotalHours(totalHoursWorked);
      } catch (error) {
        console.error("Error al obtener las horas trabajadas del mes:", error);
        setError("Error al obtener las horas trabajadas.");
      } finally {
        setLoading(false); // Finalizar carga
      }
    };

    fetchTotalWorkedHours();
  }, []);

  // Función para calcular la duración en horas de un intervalo
  const calculateDurationInHours = (startTime, endTime) => {
    const start = convertToFullDate(startTime);
    const end = convertToFullDate(endTime);

    if (start && end) {
      return (end - start) / 1000 / 60 / 60; // Calculamos la diferencia en horas
    }
    return 0;
  };

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

  // useEffect(() => {
  //   const fetchIntervals = async () => {
  //     try {
  //       const intervals = await getAllIntervals();
  //       console.log("Intervalos obtenidos:", intervals);
  //       setIntervals(intervals);
  //     } catch (error) {
  //       console.error("Error al obtener los intervalos:", error);
  //     }
  //   };
  //   fetchIntervals();
  // }, []);

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
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-links">
          <button className="nav-btn" onClick={() => navigate("/calendar")}>
            Calendar
          </button>
          <button className="nav-btn" onClick={() => navigate("/Perfil")}>
            Profile
          </button>
          <button className="nav-btn logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>
      <div className="home-container">
        <div className="centered">
          <h1 className="titleWelcome">
            Welcome, {userInfo ? userInfo.name : "Loading..."}{" "}
          </h1>
          {/* Check-in and Check-out Buttons */}
          <div className="action-buttons">
            <div className="home">
              <button className="check-in-btn" onClick={handleCheckAndCreate}>
                Check-in
              </button>
              {statusMessage && <p>{statusMessage}</p>}
            </div>

            <div>
              <button className="check-out-btn" onClick={handleCheckOutClick}>
                Check-out
              </button>
              {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
          </div>

          {isFlexibleInputVisible && (
            <div className="flexible-input-container">
              <input
                type="number"
                value={flexibleInput}
                onChange={(e) => setFlexibleInput(e.target.value)}
                placeholder="Enter value..."
                className="flexible-input"
              />
              <button
                onClick={handleFlexibleSubmit}
                className="flexible-submit-btn"
              >
                Submit
              </button>
            </div>
          )}

          {/* Info Cards */}
          <div className="info-cards">
            <div className="card">
              <h3>Total worked hours:</h3>
              <p>{totalHours.toFixed(2)} Hours</p>
              <img
                src="/logo_img.png"
                alt="Total Hours"
                className="card-image"
              />
            </div>

            <div className="card">
              <h3>Absences</h3>
              <p>{unattended}</p>
            </div>
            <div className="card">
              <h3>Overtime</h3>
              <p>{calculateExtraHours().toFixed(2)} Hours</p>
            </div>
          </div>

          {/* Footer */}
          <div className="footer">
            <h2>Aproximated to be charged:</h2>
            <p>{totalToCharge.toFixed(2)}€</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
