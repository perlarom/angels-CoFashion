import React from "react";
import { Link } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
  };

  return (
    <div className="sidebar">
      <Link to="/admin/dashboard">
        <h2>Panel de Administración</h2>
      </Link>

      <Link to="/admin/productos" className="active">
        Productos
      </Link>
      <Link to="/admin/usuarios">Usuarios Registrados</Link>
      {/* <Link to="/admin/pedidos">Pedidos</Link> */}
      <Link to="/admin/admin-colab">Administradores y Colaboradores</Link>
      <Link to="/admin/mensajes">Mensajes</Link>
      <Link to="/inicio">Ver Página</Link>
      <Link to="/login" onClick={handleLogout} className="logout-link">
        Cerrar Sesión
      </Link>
    </div>
  );
};

export default Sidebar;
