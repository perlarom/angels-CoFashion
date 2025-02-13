import React, { useState } from "react";
import { useNavigate} from "react-router-dom";
import { FaInstagram, FaFacebookF, FaEnvelope } from "react-icons/fa"; 
import "../styles/Contact.css"; 

const Contact = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    mensaje: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/api/enviar-mensaje/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.success) {
        alert("Mensaje enviado con éxito");
        setFormData({ nombre: "", correo: "", mensaje: "" }); 
      } else {
        alert("Error al enviar el mensaje: " + result.error);
      }
    } catch (error) {
      alert("Hubo un problema con la solicitud");
    }
  };

  return (
    <div className="contact-page">
      <h1 className="text-4xl font-bold text-center mb-6">Contacto</h1>

      <div className="social-media">
        <h2 className="text-2xl font-semibold mb-4">Síguenos en nuestras redes</h2>
        <div className="social-icons">
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram size={40} className="social-icon" />
          </a>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebookF size={40} className="social-icon" />
          </a>
          <a href="mailto:contacto@angelsco.com">
            <FaEnvelope size={40} className="social-icon" />
          </a>
        </div>
      </div>

      <div className="form-container">
        <h2 className="text-3xl font-semibold mb-4">Envíanos un mensaje</h2>
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="input-group">
            <label htmlFor="name">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="correo">Correo</label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={formData.correo}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="mensaje">Mensaje</label>
            <textarea
              id="mensaje"
              name="mensaje"
              value={formData.mensaje}
              onChange={handleInputChange}
              rows="5"
              required
            ></textarea>
          </div>
          <button type="submit" className="submit-button">Enviar</button>
        </form>
      </div>

      <div className="back-button-container">
          <button onClick={() => navigate(-1)} className="back-button">
            Regresar
          </button>
        </div>

    </div>
  );
};

export default Contact;
