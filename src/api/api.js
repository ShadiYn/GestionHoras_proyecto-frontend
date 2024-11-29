import axios from 'axios';
//crear la url base
const baseUrl = axios.create({
    baseURL: 'http://localhost:8080'
});

//funcoin de login
// Función para hacer login
// Función para hacer login
export const loginUser = async (formData) => {
  try {
    // Realiza la solicitud POST al endpoint de login
    const response = await baseUrl.post('/login', formData);
    return response.data; // Devuelve la respuesta del login, que debe incluir el token
  } catch (error) {
    console.error("Error en el login:", error);
    throw error.response ? error.response.data : error.message;
  }
};


    //configuramos el token de autenticación en axios

// Configurar el token de autenticación en axios
export const setAuth = (token) => {
  console.log('Configurando autenticación con token:', token);

  // Establece el encabezado Authorization con el token básico
  baseUrl.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};



    //funcoin registro
    // Función de registro de usuario
export const registro = async (userData) => {
  try {
    // Muestra los datos que se van a enviar para el registro
    console.log("Enviando datos de registro:", userData);

    // Solicita el registro del nuevo usuario
    const response = await baseUrl.post('/register', userData);

    // Muestra la respuesta cuando el registro es exitoso
    console.log('Registro EXITOSO', response.data);
    return response.data; // Devuelve la respuesta del registro
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    throw error;
  }
};

