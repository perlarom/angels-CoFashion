import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css";
import Header from "../components/Header.js";
import logo from "../assets/imgs/Angels1.png";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        // Guardar el access_token en localStorage
        localStorage.setItem("authToken", result.access_token);
        localStorage.setItem("user", JSON.stringify(result.user));

        alert("Inicio de sesión exitoso");
        navigate("/inicio");
      } else {
        setError(result.error || "Error al iniciar sesión");
      }
    } catch (error) {
      setError("Hubo un problema con la conexión");
    }
  };

  return (
    <>
      <Header />
      <div className="login-container">
        <div className="login-form">
          <div className="logo-container">
            <img src={logo} alt="Logo" />
          </div>
          <h2>Iniciar sesión</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Nombre de usuario</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <div className="input-container">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <button type="submit">Iniciar sesión</button>
          </form>

          <p className="register-link">
            ¿No tienes cuenta? <Link to="/registrar">Registrar</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
