import React, { useState } from "react";
import { loginUser } from "../api/api";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../providers/UserProvider";
import "../app/Auth.css"; // Estilos compartidos

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUserContext();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const result = await loginUser({ username, password });
      if (result) {
        setUser({
          token: result.token,
          id: result.id,
          username: result.username,
          name: result.name,
          lastname: result.lastName,
          salary: result.eurosPerHour,
          schedule: result.isFlexible,
        });
        navigate("/home");
      }
    } catch (err) {
      setError("Credenciales incorrectas. Intenta de nuevo.");
    }
  };

  const handleRegister = () => navigate("/register");

  return (
    <div className="auth-container">
      <h2 className="auth-header">Login</h2>
      <form className="auth-form" onSubmit={handleLogin}>
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
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="auth-error">{error}</p>}
        <button type="submit">Login</button>
        <button
          type="button"
          className="secondary-button"
          onClick={handleRegister}
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Login;
