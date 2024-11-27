import axios from 'axios';
//crear la url base
const baseUrl = axios.create({
    baseURL: 'http://localhost:8080/'
});

//funcoin de login
export const login = async ({
    username,password})=>{
        //para generar el token de autenticación

        const token = btoa(username+':'+password);

        //ver el token generado
        console.log('Generando token para el login:',token);

        try{
            //verificar los datos que hemos enviado

            const response = await baseUrl.post('/login',{},{
                headers:{
                    'Content-Type':
                'application/json',
                'Authorization': 'Basic ' + token
                }
            });
            //respuesta del login
            console.log('Respuesta del login:',response.data);

            //guardamos el token en axios para futuras solicitudes

            setAuth(token);

            //devolvemos la respuesta del login - token o mensaje
            return response.data

        }catch(error){
            console.error('error al hacer login: ',error.response ? error.response.data : error.message);
            throw error;

        }
    }

    //configuramos el token de autenticación en axios

    const setAuth = async (token)=>{
        console.log('configuranto autenticación con token:',token);

        baseUrl.defaults.headers.common.Authorization = `Basic ${token}`;
    };


    //funcoin registro
    export const registro = async (formData) =>{
        try{
            //log pa mostrar los datos de registro
            console.log("enviando datos de registro:",formData);

            const response = await axios.post('http://localhost:8080/url/register',formData,{
                headers: {
                   'Content-Type': 'application/json', 
                },
            });


            //log respuesta correcta en el registro
            console.log('Registro EXITOSO',response.data);
            return response.data;
        }catch(error){
            console.error('error al registrar usuario:',error);
            throw error;
        }
    };