import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaBars } from "react-icons/fa";
import "../styles/Header.css";
import logo from "../assets/imgs/Angels.png";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="logo" className="logo-img" />
        </Link>
      </div>
      <nav>
        <ul className="nav-menu">
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/categoria">Categoría</Link></li>
          <li><Link to="/ofertas">Ofertas</Link></li>
          <li><Link to="/contacto">Contacto</Link></li>
          <li><Link to="/login">Iniciar Sesión / Registrarse</Link></li>
        </ul>
      </nav>
      <div className="cart-icon">
        <Link to="/carrito">
          <FaShoppingCart size={24} />
        </Link>
      </div>
      <div className="menu-icon" onClick={toggleMenu}>
        <FaBars size={30} />
      </div>
    </header>
  );
};

export default Header;
