import React, { useState } from 'react';
import Header from "../components/Header.js";
import axios from 'axios'; // Necesario para hacer la solicitud al backend
import "../styles/Register.css";
import { useNavigate } from "react-router-dom"; 


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

  const [usernameAvailable, setUsernameAvailable] = useState(null); // Estado para mostrar disponibilidad del username
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const checkUsernameAvailability = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/check-username", { username: formData.username });
      setUsernameAvailable(response.data.available); // El backend debe devolver un objeto con { available: true/false }
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
      form.append("password", formData.password); // Se agrega la contraseña
      form.append("confirm_password", formData.confirmPassword); // Se agrega la confirmación de la contraseña

      const response = await axios.post("http://127.0.0.1:8000/api/register", form, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
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
    navigate("/login"); // Redirigir al login cuando se haga clic en "Cancelar"
  };

  return (
    <div>
      <Header />
      <h1>Registro de Usuario</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Apellidos</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Nombre de usuario</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            onBlur={checkUsernameAvailability} // Verifica disponibilidad al salir del campo
            required
          />
          {usernameAvailable === false && <p style={{ color: 'red' }}>El nombre de usuario no está disponible</p>}
          {usernameAvailable === true && <p style={{ color: 'green' }}>El nombre de usuario está disponible</p>}
        </div>

        <div>
          <label>Correo electrónico</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Dirección</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Contraseña</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label>Confirmar Contraseña</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit">Registrar</button>
        <button type="button" onClick={handleCancel}>Cancelar</button> {/* Botón de cancelar */}
      </form>
    </div>
  );
};

export default Register;
