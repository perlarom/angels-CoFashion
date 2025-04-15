import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css";
import logo from "../assets/imgs/Angels1.png";
import "font-awesome/css/font-awesome.min.css";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
        localStorage.setItem("authToken", result.access_token);
        localStorage.setItem("user", JSON.stringify(result.user));

        alert("Inicio de sesión exitoso");
        if (result.user.is_admin || result.user.is_staff) {
          navigate("/admin/dashboard");
        } else {
          navigate("/inicio");
        }
      } else {
        setError(result.error || "Error al iniciar sesión");
      }
    } catch (error) {
      setError("Hubo un problema con la conexión");
    }
  };

  return (
    <div className="login-body"> 
      <div className="login-container">
        <div className="login-form">
          <div className="logo-container">
            <img src={logo} alt="Logo" />
          </div>
          <h2>Iniciar sesión</h2>
          {error && <p className="error-message">{error}</p>}
          <form 
            onSubmit={handleSubmit}
            style={{
              width: "100%",
              maxWidth: "400px",
              margin: "0 auto",
              padding: "20px",
              backgroundColor: "#fff",
              borderRadius: "10px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
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

            <div className="form-group password-group">
              <label htmlFor="password">Contraseña</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <span className="password-toggle" onClick={togglePasswordVisibility}>
                  <i className={showPassword ? "fa fa-eye" : "fa fa-eye-slash"}></i>
                </span>
              </div>
            </div>

            <button type="submit">Iniciar sesión</button>
          </form>

          <p className="register-link">
            ¿No tienes cuenta? <Link to="/registrar">Registrar</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
