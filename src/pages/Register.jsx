import  { useState } from "react";
import { registro } from "../api/api";
import "../app/Auth.css"; // Estilos compartidos

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
    } catch (err) {
      setError(
        err.response
          ? err.response.data
          : "Error al registrar el usuario. Intenta de nuevo."
      );
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-header">Registro</h2>
      <form className="auth-form" onSubmit={handleRegister}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Schedule:</label>
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
        <div>
          <label>Salary/h:</label>
          <input
            type="text"
            value={eurosPerHour}
            onChange={(e) => setEurosPerHour(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Extra Hours Salary/h:</label>
          <input
            type="text"
            value={eurosPerExtraHours}
            onChange={(e) => setEurosPerExtraHours(e.target.value)}
          />
        </div>
        {error && <p className="auth-error">{error}</p>}
        {successMessage && <p className="auth-success">{successMessage}</p>}
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default Register;
