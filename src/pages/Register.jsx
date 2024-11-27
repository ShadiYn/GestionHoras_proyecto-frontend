import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registro } from "../api/api";



const Register = ()=>{
    const [formData,setFormData]= useState({
        //colocar los datos necesarios para iniciar sesión!
    });

    const navigate = useNavigate();

    const handleChange = (e)=>{
        const {name,value} = e.target;
        setFormData({...formData,[name]: value});
    };

    const handleSubmit = async (e)=>{

        e.preventDefault();
        try{
            await registro(formData);
            console.log('Registro exitoso');
            navigate("/");
        }catch(error){
            console.error('error en el registro intentalo de nuevo:', error)
            throw error;
        }
    };





    return(
        <div className="contenido">
            <div className="card-container">
                <div className="register-form">
                    <h1>Registrarse</h1>
                    <form onSubmit={handleSubmit}>
                        <input type="text"
                        name="username"
                        placeholder="nombre completo?"
                        value={formData.username}
                        onChange={handleChange}
                        required/>

                        {
                            //lo mismo pero con los demás campos necesarios que falta por identificar
                        }

                        <button type="submit">Registrarse</button>
                    </form>
                    <button className="login-button" onClick={()=> navigate("/")}>Volver a Login</button>
                </div>
                <div className="register-image">

                </div>
            </div>
        </div>
    )
}
export default Register;