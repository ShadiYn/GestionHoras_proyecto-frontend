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

      
    <div>
      <button>Check-in</button>
        <button>Check-out</button>
    </div>
       
        <div className="card">
          <h3>Horas del mes</h3>
          <p>{/*summary.totalHours || 0*/}suma total de las horas hechas hasta ahora del mes</p>
        </div>
        <div className="card">
          <h3>Ausencias</h3>
          <p>{/*summary.absences || 0*/}total ausencias</p>
        </div>
        <div className="card">
          <h3>Horas Complementarias</h3>
          <p>{/*summary.totalOvertime || 0*/} dependiendo de las horas que tenga</p>
        </div>

        <div className="footer">

          <h2>Total aproximado a cobrar: </h2>
          <p>
          Total a cobrar = Horas mes * precio fijo + Horas Complementarias * PrecioHora compleemntaria
            </p>

            </div>




      <br></br>
      <div className="explicación">
       
        <p>
          Se podrán hacer más de un check in/check out para contar los descansos
          realizados
        </p>
        <p>
          finalmente una targeta que implementa las horas trabajadas ese día
    </p>

      </div>
    </div>
  );
};
export default Home;
