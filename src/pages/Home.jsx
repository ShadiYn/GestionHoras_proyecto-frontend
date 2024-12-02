import { useNavigate } from "react-router-dom";
import { useUserContext } from "../providers/UserProvider";

const Home = () => {
  const { setUser } = useUserContext();
  const navigate = useNavigate();

  const handleCalendar = () => {
    navigate("/calendar");
  };
  const handlePerfil = () => {
    navigate("/Perfil");
  };
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    navigate("/login");
  };

  return (
    <div>
      <div className="navbar">
        <button className="Calendar-btn" onClick={handleCalendar}>
          Calendario
        </button>

        <button className="Perfil-btn" onClick={handlePerfil}>
          Perfil
        </button>

        <button className="Perfil-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="explicación">
        <p>
          Aquí tengo pensado que aparecerá una targeta/botón - que sea para el
          check in/check out de ese mismo día
        </p>
        <p>
          Se podrán hacer más de un check in/check out para contar los descansos
          realizados
        </p>
        <p>
          finalmente una targeta que implementa las horas trabajadas ese día
        </p>
        <p>
          Es decir la targeta contará las horas checkeadas chekc in y check out
          con el concepto de trabajo y no de descanso o algo así
        </p>
      </div>
    </div>
  );
};
export default Home;
