import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = () => {
  // Usamos useLocation para obtener la ruta actual y ver cuál está activa
  const location = useLocation();

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    localStorage.removeItem("token");
  };

  return (
    <div className="sidebar">
      <Link to="/admin/dashboard">
        <h2>Panel de Administración</h2>
      </Link>

      <Link
        to="/admin/productos"
        className={location.pathname === "/admin/productos" ? "active" : ""}
      >
        Productos
      </Link>
      <Link
        to="/admin/usuarios"
        className={location.pathname === "/admin/usuarios" ? "active" : ""}
      >
        Usuarios Registrados
      </Link>
      <Link
        to="/admin/admin-colab"
        className={location.pathname === "/admin/admin-colab" ? "active" : ""}
      >
        Administradores y Colaboradores
      </Link>
      <Link
        to="/admin/mensajes"
        className={location.pathname === "/admin/mensajes" ? "active" : ""}
      >
        Mensajes
      </Link>
      <Link
        to="/inicio"
        className={location.pathname === "/inicio" ? "active" : ""}
      >
        Ver Página
      </Link>
      <Link to="/login" onClick={handleLogout} className="logout-link">
        Cerrar Sesión
      </Link>
    </div>
  );
};

export default Sidebar;
