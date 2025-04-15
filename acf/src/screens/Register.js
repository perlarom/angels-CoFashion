import React, { useState } from 'react';
import axios from 'axios';
import "../styles/Register.css";
import { useNavigate } from "react-router-dom";
import "font-awesome/css/font-awesome.min.css";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: ""
  });

  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const checkUsernameAvailability = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/check-username", { username: formData.username });
      setUsernameAvailable(response.data.available);
    } catch (error) {
      setError("Error al verificar el nombre de usuario");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const form = new FormData();
      form.append("first_name", formData.firstName);
      form.append("last_name", formData.lastName);
      form.append("username", formData.username);
      form.append("email", formData.email);
      form.append("address", formData.address);
      form.append("password", formData.password);
      form.append("confirm_password", formData.confirmPassword);

      const response = await axios.post("http://127.0.0.1:8000/api/register", form, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (response.data.success) {
        setSuccess("Usuario registrado exitosamente");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(response.data.error || "Error al registrar usuario");
      }
    } catch (error) {
      setError("Hubo un problema al enviar los datos");
    }
  };

  const handleCancel = () => {
    navigate("/login");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="register-container">
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleSubmit}>
        <h2>Registro de Usuario</h2>

        <div className="input-group">
          <label>Nombre</label>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
        </div>

        <div className="input-group">
          <label>Apellidos</label>
          <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
        </div>

        <div className="input-group">
          <label>Nombre de usuario</label>
          <input type="text" name="username" value={formData.username} onChange={handleInputChange} onBlur={checkUsernameAvailability} required />
          {usernameAvailable === false && <p className="error-message">El nombre de usuario no está disponible</p>}
          {usernameAvailable === true && <p className="success-message">El nombre de usuario está disponible</p>}
        </div>

        <div className="input-group">
          <label>Correo electrónico</label>
          <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
        </div>

        <div className="input-group">
          <label>Dirección</label>
          <input type="text" name="address" value={formData.address} onChange={handleInputChange} required />
        </div>

        <div className="input-group password-group">
          <label>Contraseña</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
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

        <div className="input-group password-group">
          <label>Confirmar Contraseña</label>
          <div className="password-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
            <span className="password-toggle" onClick={toggleConfirmPasswordVisibility}>
              <i className={showConfirmPassword ? "fa fa-eye" : "fa fa-eye-slash"}></i>
            </span>
          </div>
        </div>

        <div className="button-group">
          <button type="submit" className="btn btn-primary">Registrar</button>
          <button type="button" onClick={handleCancel} className="btn btn-secondary">Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default Register;
