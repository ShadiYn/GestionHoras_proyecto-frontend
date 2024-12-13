import axios from "axios";
//crear la url base
const baseUrl = axios.create({
  baseURL: "http://localhost:8080",
});

//funcoin de login
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
 
};


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

export const getAllIntervals = async () => {
  try {
    const response = await baseUrl.get('/intervals');
    console.log("Todos los intervalos:", response.data);
    return response.data;
    await baseUrl.get(`/intervals/start/${intervalId}`);
    alert("Check-in registrado!");
  } catch (error) {
    console.error("Error al obtener todos los intervalos:", error.message);
    throw error;
  }
};




//check out
export const handleCheckOut = async (intervalId) => {
  try {
    await baseUrl.get(`/intervals/end/${intervalId}`);
    await baseUrl.get(`/intervals/end/${intervalId}`);
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
    const response = await baseUrl.get(
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
        Authorization: `Basic ${token}`, // El token debe ser enviado en el encabezado
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

    const response = await baseUrl.get(`/intervals/month/${userId}`);
    console.log(response.data); // Manejar los intervalos obtenidos
    return response.data;
  } catch (error) {
    console.error("Error obteniendo los intervalos del mes:", error.message);
    return [];
  }
};


export const getIntervalIdFromDB = async () => {
  const response = await baseUrl.get("/intervals/current");
  return response.data;
};

export const getUserIntervals = async (intervalId) => {
  try {
    // Obtener el token de localStorage
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("Token no encontrado. Por favor, inicia sesión.");
      return;
    }
    
    const response = await baseUrl.get("/intervals/currentinterval", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    console.log('respuesta 11111111111111111111', response.data)

    return response.data;
  } catch (error) {
    console.error("Error al obtener los intervalos:", error);
    throw error; // Lanzamos el error para que sea manejado en el componente
  }
};

export const getCurrentInterval = async () => {
  try {
    const token = localStorage.getItem('authToken');
    console.log("Token recuperado:", token);

    if (!token) {
      throw new Error("Token no disponible.");
    }

    const response = await baseUrl.get("/intervals/currentinterval", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    // Verifica el código de estado de la respuesta
    console.log('Respuesta de getCurrentInterval:', response);
    return response.data;
  } catch (error) {
    console.error('Error al obtener el intervalo actual:', error);
    
    // Verifica si el error tiene una respuesta del servidor
    if (error.response) {
      console.error('Respuesta del servidor:', error.response.data);
      console.error('Código de estado:', error.response.status);
    } else if (error.request) {
      console.error('No se recibió respuesta del servidor:', error.request);
    } else {
      console.error('Error inesperado:', error.message);
    }

    throw error; // Lanza el error nuevamente para que lo maneje el componente que llamó a esta función
  }
};


// api.js

// Si 'fetchTotalHours' está definida en este archivo, asegúrate de exportarla
export const fetchTotalHours = async () => {
  try {
    const hours = await getTotalWorkedHoursForCurrentMonth();
    console.log("Horas obtenidas del mes:", hours);  // Verifica lo que se recibe de la API
    return hours;  // Devolver las horas totales
  } catch (error) {
    console.error("Error al obtener las horas trabajadas:", error);
    throw error;
  }
};




export const getCurrentInterval = async () => {
  try {
    const response = await baseUrl.get("/intervals/currentinterval");
    return response.data;
  } catch (error) {
    console.error("Error al obtener el ultimo intervalo", error.message);
    throw error;
  }
};

export const updatePassword = async (payload) => {
  try {
    const token = localStorage.getItem("authToken");
    const decodeToken = atob(token);
    const [username,] = decodeToken.split(":");
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
    const newUsername = obj.username;
    const newToken = btoa(newUsername + ":" + password);

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

// Función para crear un WorkDay con el primer intervalo automáticamente
export const createWorkDayWithFirstInterval = async () => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error(
        "No se encontró un token de autenticación. Inicia sesión nuevamente."
      );
    }

    // Crear el WorkDay y el primer intervalo usando el endpoint del backend
    const response = await baseUrl.post(
      "/workdays/checkandcreateautoworkday",
      {},
      {
        headers: {
          Authorization: `Basic ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error al crear el WorkDay con el primer intervalo:",
      error.message
    );
    throw error;
  }
};
