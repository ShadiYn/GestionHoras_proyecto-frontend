import axios from "axios";
//crear la url base
const baseUrl = axios.create({
  baseURL: "http://localhost:8080",
});

//funcoin de login
export const loginUser = async ({ username, password }) => {
  // Generar token de autenticación
  const token = btoa(username + ":" + password);

  // Log para ver el token generado
  console.log("Generando token para login:", token);
  localStorage.setItem("authToken", token);

  try {
    // Log para verificar los datos enviados
    console.log(
      "Realizando solicitud POST para login a /login con los encabezados: ",
      {
        Authorization: "Basic " + token,
        "Content-Type": "application/json",
      }
    );

    // Realizar la solicitud POST para login
    const response = await baseUrl.post(
      "/login",
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + token,
        },
      }
    );

    // Log para ver la respuesta del login
    console.log("Respuesta del login:", response.data);

    // Guardar el token en la configuración de axios para futuras solicitudes
    setAuth(token);

    return response.data; // Retorna la respuesta del login (por ejemplo, token o mensaje)
  } catch (error) {
    // Log de error si la solicitud falla
    console.error(
      "Error al hacer login:",
      error.response ? error.response.data : error.message
    );
    throw error; // Lanzar el error para que pueda ser manejado en el componente
  }
  try {
    const response = await baseUrl.post(
      "/login",
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${token}`,
        },
      }
    );

    if (!response.data.id || isNaN(Number(response.data.id))) {
      throw new Error("La respuesta del servidor no contiene un ID válido");
    }

    setAuth(token); // Configurar token
    return response.data; // Retorna la respuesta
  } catch (error) {
    console.error("Error al hacer login:", error.message);
    throw error;
  }
};

// Configurar el token de autenticación en axios
const setAuth = async (token) => {
  console.log("Configurando autorización con token:", token);
  baseUrl.defaults.headers.common.Authorization = `Basic ${token}`;
};

// Función de registro de usuario
export const registro = async (userData) => {
  try {
    const response = await baseUrl.post(
      "/register", // Endpoint
      userData // Datos del formulario
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data; // Manejar errores del servidor
    }
    throw error.message; // Otros errores
  }
};

export const userDetails = async () => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error(
        "No se encontró un token de autenticación. Inicia sesión nuevamente."
      );
    }

    const response = await baseUrl.get("/usersettings", {
      headers: {
        Authorization: `Basic ${token}`,
      },
    });

    return response.data; // Axios devuelve la respuesta directamente como JSON
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.error("Error 401: No autorizado. Verifica el token.");
    } else {
      console.error("Error al cargar detalles del usuario:", error.message);
    }
    return {};
  }
};

//obtener/crear workday
export const getOrCreateCurrentWorkDay = async () => {
  try {
    const response = await baseUrl.get("/workdays/current");
    console.log("WorkDay actual creado o encontrado:", response.data);
    return response.data; // Devuelve el WorkDay del día actual
  } catch (error) {
    console.error("Error al obtener o crear el WorkDay actual:", error);
    throw error;
  }
};

//check-in
export const handleCheckIn = async (intervalId) => {
  try {
    await axios.get(`/intervals/start/${intervalId}`);
    alert("Check-in registrado!");
  } catch (error) {
    console.error("Error al registrar el check-in:", error);
  }
};

//check out
export const handleCheckOut = async (intervalId) => {
  try {
    await axios.get(`/intervals/end/${intervalId}`);
    alert("Check-out registrado!");
  } catch (error) {
    console.error("Error al registrar el check-out:", error);
  }
};

//obtener horas
// Función para iniciar el intervalo (y crear el WorkDay si no existe)
export const startInterval = async (intervalId) => {
  try {
    // Validar el token en el almacenamiento local
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error(
        "No se encontró un token de autenticación. Inicia sesión nuevamente."
      );
    }

    // Configurar encabezados con el token
    const response = await axios.get(
      `http://localhost:8080/intervals/start/${intervalId}`,
      {
        headers: {
          Authorization: `Basic ${token}`,
        },
      }
    );

    console.log("Intervalo iniciado:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al iniciar el intervalo:", error.message);
    throw error;
  }
};

// Función para obtener y calcular las horas trabajadas en el mes actual
// Función para obtener y calcular el total de horas trabajadas en el mes actual
export const getTotalWorkedHoursForCurrentMonth = async () => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error(
        "No se encontró un token de autenticación. Inicia sesión nuevamente."
      );
    }

    // Obtener los workdays para el mes actual
    const response = await baseUrl.get("/workdays/current-month", {
      headers: {
        Authorization: `Basic ${token}`,
      },
    });

    const workdays = response.data; // Suponiendo que la respuesta contiene los workdays

    // Calcular el total de horas
    let totalHours = 0;

    workdays.forEach((workday) => {
      // Verificar si el workday tiene intervalos
      if (workday.intervals && Array.isArray(workday.intervals)) {
        workday.intervals.forEach((interval) => {
          const start = new Date(interval.startTime); // Hora de inicio
          const end = new Date(interval.endTime); // Hora de fin

          // Asegurarse de que las fechas sean válidas
          if (start && end && !isNaN(start) && !isNaN(end)) {
            const duration = (end - start) / 1000 / 60 / 60; // Calculando en horas
            totalHours += duration;
          }
        });
      }
    });

    console.log("Total horas trabajadas en el mes:", totalHours);
    return totalHours;
  } catch (error) {
    console.error("Error al obtener los workdays del mes:", error);
    throw error;
  }
};

//obtener todos los workdays del mes actual
export const getWorkDaysForCurrentMonth = async () => {
  try {
    const token = localStorage.getItem("authToken"); // Obtener el token de autenticación desde el localStorage
    if (!token) {
      throw new Error(
        "No se encontró un token de autenticación. Inicia sesión nuevamente."
      );
    }

    const response = await baseUrl.get("/workdays/current-month", {
      headers: {
        Authorization: `Basic ${token}`, // Añadir el token al encabezado de la solicitud
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error al obtener los WorkDays del mes:", error);
    throw error;
  }
};

//funcion para finalizar el intervalo
export const endInterval = async (intervalId) => {
  try {
    const response = await baseUrl.get(`/intervals/end/${intervalId}`);
    console.log("fin del intervalo", response.data);
    return response.data;
  } catch (error) {
    console.error("error al finalizar intervalo:", error);
    throw error;
  }
};
//intervalos de cada mes
export const getIntervalsForMonth = async (userId) => {
  try {
    if (!userId || isNaN(Number(userId))) {
      throw new Error("User ID debe ser un número válido");
    }

    const response = await axios.get(`/intervals/month/${userId}`);
    console.log(response.data); // Manejar los intervalos obtenidos
    return response.data;
  } catch (error) {
    console.error("Error obteniendo los intervalos del mes:", error.message);
    return [];
  }
};

//funcion obtener intervalos de un usuario

export const getUserIntervals = async (userId) => {
  try {
    if (!userId || isNaN(Number(userId))) {
      throw new Error("User ID debe ser un número válido");
    }

    const response = await baseUrl.get(`/intervals/interval/${userId}`);
    console.log("Intervalos del usuario:", response.data);
    return response.data;
  } catch (error) {
    console.error("No se han obtenido los intervalos:", error.message);
    throw error;
  }
};

export const updatePassword = async (payload) => {
  try {
    const token = localStorage.getItem("authToken");
    const decodeToken = atob(token);
    const [username, password] = decodeToken.split(":");
    const newPassword = payload.password;
    const newToken = btoa(username + ":" + newPassword);
    localStorage.setItem("authToken", newToken);

    const response = await baseUrl.put("/usersettings/updatepassword", payload);

    setAuth(newToken);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar la contraseña:", error.message);
    throw error;
  }
};

export const updateUserDetails = async (obj) => {
  try {
    const token = localStorage.getItem("authToken");
    const decodedToken = atob(token);
    const [username, password] = decodedToken.split(":");

    console.log("Username decodificado:", username);
    console.log("Password decodificado:", password);
    console.log("Objeto a actualizar:", obj.username);

    const newUsername = obj.username;

    const newToken = btoa(newUsername + ":" + password);
    console.log("Nuevo token generado para actualizar:", newToken);
    localStorage.setItem("authToken", newToken);

    const response = await baseUrl.put("/usersettings/updateuser", obj);
    setAuth(newToken); // Configurar el nuevo token en axios

    return response.data;
  } catch (error) {
    console.error(
      "Error al actualizar los detalles del usuario:",
      error.message
    );
    throw error;
  }
};
