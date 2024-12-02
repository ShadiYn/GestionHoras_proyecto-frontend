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
    