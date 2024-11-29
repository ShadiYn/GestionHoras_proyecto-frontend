import React, { useState } from "react";
import { loginUser } from "../api/api";
import { useNavigate } from "react-router-dom"; // Importar useNavigate de React Router v6

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Usar useNavigate en lugar de useHistory

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Resetear errores

    try {
      const credentials = { username, password };
      const result = await loginUser(credentials);

      // Aquí puedes guardar el token o ID de usuario en el estado global o en localStorage
      console.log("Login exitoso:", result);
      
      // Redirige al dashboard u otra página
      navigate("/dashboard"); // Redirige con navigate en lugar de history.push

    } catch (err) {
      setError("Credenciales incorrectas. Intenta de nuevo.");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
