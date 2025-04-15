import React, { useEffect, useState } from "react";
import axios from 'axios';
import "./AdminCollab.css";
import Sidebar from "../../components/Sidebar.js";
import { useNavigate } from 'react-router-dom';  // Importar useNavigate para redirigir

const AdminCollab = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();  // Hook de useNavigate para la redirección

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/superusuarios/");
        setUsers(response.data);
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleAddAdmin = () => {
    navigate('/admin/agregar-admin');  // Redirigir al formulario de agregar admin
  };

  return (
    <div className="main-container">
      <Sidebar />
      <div className="content">
        <h2>Administradores y Usuarios con Permisos</h2>
        <table className="user-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Usuario</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{user.first_name || "N/A"}</td>
                <td>{user.last_name || "N/A"}</td>
                <td>{user.username || "N/A"}</td>
                <td>{user.email || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="button-container">
          <button className="add-admin-btn" onClick={handleAddAdmin}>
            Agregar Administrador
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminCollab;
