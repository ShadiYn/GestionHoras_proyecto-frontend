import { useState } from "react";
import { loginUser } from "../api/api";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../providers/UserProvider";
import "../app/Auth.css"; // Importa los estilos

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
      setError("Credenciales incorrectas. Intenta de nuevo.",err);
    }
  };

  const handleRegister = () => navigate("/register");

  return (
    <div className="auth-container elegant-login">
      <div className="login-card-container">
        {/* Logo al lado del formulario */}
        <div className="login-card-logo">
        </div>
        <div className="login-card">
          <img src="/logo_img.png" alt="Logo" className="LogoImage" />

          <form className="auth-formLogin" onSubmit={handleLogin}>
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
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="auth-error">{error}</p>}
            <button type="submit" className="login-button">
              Login
            </button>
            <button
              type="button"
              className="register-button"
              onClick={handleRegister}
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
