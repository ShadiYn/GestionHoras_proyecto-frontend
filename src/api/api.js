import axios from 'axios';
//crear la url base
const baseUrl = axios.create({
    baseURL: 'http://localhost:8080'
});

//funcoin de login
export const loginUser = async ({ username, password }) => {
    // Generar token de autenticación
    const token = btoa(username + ':' + password);

    // Log para ver el token generado
    console.log('Generando token para login:', token);
    localStorage.setItem("authToken", token);

    try {
        // Log para verificar los datos enviados
        console.log('Realizando solicitud POST para login a /login con los encabezados: ', {
            'Authorization': 'Basic ' + token,
            'Content-Type': 'application/json'
        });

        // Realizar la solicitud POST para login
        const response = await baseUrl.post('/login', {}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + token
            }
        });

        // Log para ver la respuesta del login
        console.log('Respuesta del login:', response.data);

        // Guardar el token en la configuración de axios para futuras solicitudes
        setAuth(token);

        return response.data;  // Retorna la respuesta del login (por ejemplo, token o mensaje)
    } catch (error) {
        // Log de error si la solicitud falla
        console.error('Error al hacer login:', error.response ? error.response.data : error.message);
        throw error;  // Lanzar el error para que pueda ser manejado en el componente
    }
};
  
// Configurar el token de autenticación en axios
const setAuth = async (token) => {
    console.log('Configurando autorización con token:', token);
    baseUrl.defaults.headers.common.Authorization = `Basic ${token}`;
};

    // Función de registro de usuario
    export const registro = async (userData) => {
        try {
            const response = await baseUrl.post(
                '/register', // Endpoint
                userData // Datos del formulario
            );
            console.log(response.data)
            return response.data;
            
        } catch (error) {
            if (error.response) {
                throw error.response.data; // Manejar errores del servidor
            }
            throw error.message; // Otros errores
        }
    };

export const userDetails = async (token) => {
  try {
    console.log("44444444444444444444444444444444", token)
    const response = await baseUrl.get("/usersettings"
        
        /*
        , {
      headers: { Authorization: `Bearer ${token}` },
    }
      */);
    console.log("Result.data", response.data)
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


// Función para iniciar el intervalo (y crear el WorkDay si no existe)
export // Asegurarte de que userId es un número
const startInterval = async (intervalId) => {
  try {
    // Asegúrate de que userId es un número
    if (typeof userId !== "number") {
      console.error("userId debe ser un número");
      return;
    }
    
    const response = await axios.get(`http://localhost:8080/intervals/start/${intervalId}`);
    console.log("Intervalo iniciado:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al iniciar el intervalo", error);
  }
};

  

//funcion para finalizar el intervalo
export const endInterval = async(intervalId)=> { 
    try{
        const response = await baseUrl.get(`/intervals/end/${intervalId}`);
        console.log("fin del intervalo",response.data);
        return response.data;
    }catch(error){
        console.error("error al finalizar intervalo:",error);
        throw error;
    }
};


//funcion obtener intervalos de un usuario

export const getUserIntervals = async (userId) => {
    if (!userId) {
      throw new Error("User ID is missing");
    }
    try {
      const response = await baseUrl.get(`/intervals/${userId}`);
      console.log("intervalos del usuario:", response.data);
      return response.data;
    } catch (error) {
      console.error("No se han obtenido los intervalos", error);
      throw error;
    }
  };
  

    