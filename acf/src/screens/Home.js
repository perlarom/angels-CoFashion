import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "../styles/Home.css"
import imag1 from "../assets/imgs/img1.jpg";
import imag2 from "../assets/imgs/imgs2.webp";
import imag3 from "../assets/imgs/img3.webp";
import imag4 from "../assets/imgs/img4.webp";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={true}
        className="absolute w-full h-full"
      >
        <SwiperSlide>
          <img 
            src={imag1} 
            alt="Moda 1" 
            className="w-full h-full object-cover object-center"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img 
            src={imag2} 
            alt="Moda 2" 
            className="w-full h-full object-cover object-center"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img 
            src={imag3} 
            alt="Moda 3" 
            className="w-full h-full object-cover object-center"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img 
            src={imag4} 
            alt="Moda 4" 
            className="w-full h-full object-cover object-center"
          />
        </SwiperSlide>
      </Swiper>

      <div className="overlay">
        <nav className="navbar">
          <ul className="navbar-links">
          <Link to="/acerca-de">Acerca de</Link>
          <li><a href="/contacto">Contacto</a></li>
          </ul>
        </nav>
        
        <h1>Bienvenido a Angels & Co. Fashion</h1>
        <h3>Donde el estilo se encuentra con cada ángel</h3>
        <button 
          onClick={() => navigate("/inicio")}>
            Comienza tu viaje
        </button>
      </div>
    </div>
  );
};

export default Home;
