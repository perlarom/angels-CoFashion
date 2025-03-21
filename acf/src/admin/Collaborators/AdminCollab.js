import React, { useEffect, useState } from "react";
import axios from 'axios';
import "./AdminCollab.css";
import Sidebar from "../../components/Sidebar.js";

const AdminCollab = () => {
  const [users, setUsers] = useState([]);

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
      </div>
    </div>
  );
};

export default AdminCollab;
