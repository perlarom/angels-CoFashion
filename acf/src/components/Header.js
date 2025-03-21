import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaBars } from "react-icons/fa";
import "../styles/Header.css";
import logo from "../assets/imgs/Angels.png";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

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
        <ul className={`nav-menu ${menuOpen ? "active" : ""}`}>
          <li><Link to="/inicio">Inicio</Link></li>
          <li><Link to="/tienda">Tienda</Link></li>
          <li>
            {user ? (
              <Link to="/perfil">Perfil</Link> 
            ) : (
              <Link to="/login">Iniciar Sesión</Link>
            )}
          </li>
        </ul>
      </nav>
      <div className="cart-icon">
        <Link to="/cart">
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
