import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/About.css";
import logo from "../assets/imgs/Angels1.png";

const About = () => {
  const navigate = useNavigate();

  return (
    <>
<div className="title-logo-container">
  <h1 className="text-4xl font-bold text-center">Sobre Nosotros</h1>
  <img src={logo} alt="Angels & Co. Fashion" className="logo" />
</div>


      <div className="about-container">
        <section className="mission mb-12">
          <h2 className="text-3xl font-semibold mb-4">Misión</h2>
          <p className="text-lg text-gray-700">
            Ofrecer una experiencia de compra eficiente y moderna, combinando tecnología 
            avanzada con atención personalizada.
          </p>
        </section>

        <section className="vision mb-12">
          <h2 className="text-3xl font-semibold mb-4">Visión</h2>
          <p className="text-lg text-gray-700">
            Ser la plataforma líder en venta de ropa y calzado en línea, 
            destacando por nuestra innovación tecnológica y experiencia de compra única.
          </p>
        </section>

        <section className="target-audience mb-12">
          <h2 className="text-3xl font-semibold mb-4">¿A quién va dirigido?</h2>
          <p className="text-lg text-gray-700">
            Angels & Co. Fashion está dirigido a personas que buscan prendas modernas y versátiles para
            cualquier ocasión. Nos enfocamos en quienes desean expresar su estilo personal sin sacrificar la
            calidad y la comodidad. Tanto hombres como mujeres pueden encontrar lo que buscan en nuestra colección.
          </p>
        </section>

        <div className="back-button-container">
          <button onClick={() => navigate(-1)} className="back-button">
            Regresar
          </button>
        </div>
      </div>
    </>
  );
};

export default About;
