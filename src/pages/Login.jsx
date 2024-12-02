// Login.jsx
import { useState } from "react";
import { loginUser } from "../api/api";
import { useNavigate } from "react-router-dom"; // Usamos el hook de navegación
import { useUserContext } from "../providers/UserProvider"; // Accedemos al contexto de usuario

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUserContext(); // Accedemos a setUser para actualizar el contexto

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Limpiar errores previos

    try {
      const credentials = { username, password };
      const result = await loginUser(credentials);
      console.log(22222, result);
      if (result) {
        // Si el login es exitoso, guardamos el token y el usuario en el contexto
        localStorage.setItem("authToken", result.token); // Guardamos el token en localStorage
        setUser({
          token: result.token,
          username: result.username,
          name: result.name,
          lastname: result.lastName,
        }); // Actualizamos el estado del usuario
        console.log(1111111);
        // Redirigimos a la página de Home
        navigate("/home");
      }
    } catch (err) {
      setError("Credenciales incorrectas. Intenta de nuevo.");
    }
  };

  const handleRegister = () => {
    navigate("/register");
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
        <br />
        {!localStorage.getItem("authToken") && (
          <button type="button" onClick={handleRegister}>
            Register
          </button>
        )}
      </form>
    </div>
  );
};

export default Login;
