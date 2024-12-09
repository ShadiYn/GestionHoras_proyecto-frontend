import { useEffect, useState } from "react";
import { userDetails } from "../api/api";

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null); // Estado para almacenar los datos del usuario

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("authToken");
        console.log('8888888888888888888', token); // Obtener el token del localStorage
        if (token) {
          const userData = await userDetails(token); // Llamada a la API
          setUserInfo(userData); // Actualizar el estado con los datos del usuario
        } else {
          console.log("No se encontro el token");
        }
      } catch (error) {
        console.error("Error al obtener los detalles del usuario:", error);
      }
    };

    fetchUserDetails(); // Llamar a la función para obtener los detalles del usuario
  }, []); // Se ejecuta solo una vez cuando el componente se monta

  // Mostrar mensaje mientras se cargan los datos
  if (!userInfo) return <div>Cargando...</div>;

  // Renderizar los datos del usuario una vez que estén disponibles
  return <div>Hola, {userInfo.name}</div>;
};

export default Profile;
