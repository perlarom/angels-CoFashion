import React from "react";
import Sidebar from "../../components/Sidebar.js"; 
import "./AdminDashboard.css"; 

const AdminDashboard = () => {
  return (
    <div>
      <Sidebar />
            <div className="main-content">
        <h2>Bienvenido al Panel de Administración</h2>
        <p>Información del Administrador y más...</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
