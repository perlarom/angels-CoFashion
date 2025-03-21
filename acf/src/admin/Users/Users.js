import React, { useEffect, useState } from "react";
import "./Users.css";
import Sidebar from "../../components/Sidebar.js";


const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/usuarios/");
        const data = await response.json();
        setUsers(data);
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
      <h2>Usuarios Registrados</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Usuario</th>
            <th>Email</th>
            <th>Dirección</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.first_name || "N/A"}</td>
              <td>{user.last_name || "N/A"}</td>
              <td>{user.username || "N/A"}</td>
              <td>{user.email || "N/A"}</td>
              <td>{user.address || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default Users;
