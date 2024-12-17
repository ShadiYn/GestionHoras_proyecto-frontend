import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registro } from "../api/api";
import "../app/Register.css"; // Importa los estilos

const Register = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isFlexible, setIsFlexible] = useState(false);
  const [eurosPerHour, setEurosPerHour] = useState("");
  const [eurosPerExtraHours, setEurosPerExtraHours] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const eurosPerHourFloat = parseFloat(eurosPerHour);
    const eurosPerExtraHoursFloat = parseFloat(eurosPerExtraHours);

    if (isNaN(eurosPerHourFloat) || isNaN(eurosPerExtraHoursFloat)) {
      setError("Los valores de salario deben ser números válidos.");
      return;
    }

    try {
      await registro({
        username,
        name,
        lastName,
        password,
        eurosPerHour: eurosPerHourFloat,
        eurosPerExtraHours: eurosPerExtraHoursFloat,
        isFlexible,
      });
      setSuccessMessage("Registro exitoso. Puedes iniciar sesión.");
      navigate("/login"); // Redirect to login page after successful registration
    } catch (err) {
      setError(
        err.response
          ? err.response.data
          : "Error al registrar el usuario. Intenta de nuevo."
      );
    }
  };

  const handleLogin = async () => {
    navigate("/login");
  };

  return (
    <div className="auth-container elegant-register">
      <div className="register-card">
        <h2 className="auth-header">Create an Account</h2>
        <form className="auth-form" onSubmit={handleRegister}>
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>First Name</label>
            <input
              type="text"
              placeholder="Enter your first name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Last Name</label>
            <input
              type="text"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Schedule</label>
            <div>
              <label>
                <input
                  type="radio"
                  name="schedule"
                  value="normal"
                  checked={!isFlexible}
                  onChange={() => setIsFlexible(false)}
                />
                Normal
              </label>
              <label>
                <input
                  type="radio"
                  name="schedule"
                  value="flexible"
                  checked={isFlexible}
                  onChange={() => setIsFlexible(true)}
                />
                Flexible
              </label>
            </div>
          </div>
          <div className="input-group">
            <label>Salary/h</label>
            <input
              type="text"
              value={eurosPerHour}
              onChange={(e) => setEurosPerHour(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Extra Hours Salary/h</label>
            <input
              type="text"
              value={eurosPerExtraHours}
              onChange={(e) => setEurosPerExtraHours(e.target.value)}
            />
          </div>
          {error && <p className="auth-error">{error}</p>}
          {successMessage && <p className="auth-success">{successMessage}</p>}
          <button type="submit" className="submit-button">Register</button>
          <button type="button" className="link-button" onClick={handleLogin}>
            Already have an account? Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
