import { useState } from "react";
import { registro } from "../api/api";

const Register = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [isFlexible, setIsFlexible] = useState(false);
  const [eurosPerHour, setEurosPerHour] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

    try {
      const userData = {
        username,
        name,
        lastName,
        password,
        eurosPerHour,
        isFlexible,
      };
      const response = await registro(userData);

      setSuccessMessage("Registro exitoso. Puedes iniciar sesión."), response;
    } catch (err) {
      // Asegúrate de capturar el error específico del backend
      setError(
        err.response
          ? err.response.data
          : "Error al registrar el usuario. Intenta de nuevo."
      );
    }
  };

  return (
    <div>
      <h2>Registro</h2>
      <form onSubmit={handleRegister}>
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

        {error && <p style={{ color: "red" }}>{error}</p>}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default Register;
