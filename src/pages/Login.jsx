import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../providers/UserProvider";
import {login} from '../api/api';

const Login = ()=>{
    const [credentials,setCredentials]= useState({username:"",password:""});

    const navigate = useNavigate();

    const {setUser}=useUserContext();

    const handleLogin = async ()=>{
        console.log('credenciales antes de hacer login:',credentials);
        try{
            const response = await login (credentials);

            console.log('respuesta del login:', response);
            setUser(response);
            navigate("/");
        }catch(error){
            console.error("Error durante logn:",error);
            <p>No se pudo iniciar sesion, intente de nuevo</p>
        }
    };


    const handleRegister = ()=>{
        navigate("/register");
    }
return(
   <div className="contenido">
    <div className="card-container">
        <div className="login-form">
            <h1>Iniciar Sesión</h1>
            <input type="text" placeholder="Usuario" onChange={(e)=> setCredentials({...credentials,username: e.target.value})}/>

            <input type="password" placeholder="contraseña" onChange={(e) =>setCredentials({...credentials,password: e.target.value})}/>

            <button onClick={handleLogin}>Iniciar Sesión</button>
            <button className="register-button"
            onClick={handleRegister}>Regístrate</button>
        </div>

        <div className="login-image">

        </div>
    </div>
   </div>
)
}
export default Login;