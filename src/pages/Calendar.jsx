import "./Calendar.css";
import { useNavigate } from "react-router-dom";

const Calendar = () => {
  const daysInMonth = new Date().getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const navigate = useNavigate();

  const handleHomeButton = () => {
    navigate("/home");
  };

  const handleProfileButton = () => {
    navigate("/perfil");
  };
  return (
    <>
      <div>
        <nav className="navbar">
          <div className="navbar-links">
            <button className="nav-btn" onClick={handleHomeButton}>
              Home
            </button>
            <button className="nav-btn" onClick={handleProfileButton}>
              Profile
            </button>
          </div>
        </nav>
      </div>
      <div className="calendar-container">
        {daysArray.map((day) => (
          <div key={day} className="calendar-day">
            {day}
          </div>
        ))}
      </div>
    </>
  );
};
export default Calendar;
