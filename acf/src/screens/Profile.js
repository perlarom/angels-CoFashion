import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import "../styles/Profile.css";
import Header from "../components/Header.js";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      let userData = JSON.parse(storedUser);
      setUser(userData);
    } else {
      navigate('/login'); // Redirige al login si no hay usuario
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/login'); // Redirige al login después de cerrar sesión
  };

  return (
    <>
      <Header />
      <div className="profile-container">
        {user ? (
          <div className="profile-info">
            <h2>Perfil de {user.username}</h2>
            <p>Email: {user.email}</p>
            {user.is_admin && <p className="admin-tag">Administrador</p>}

            {user.is_admin && <Link to="/admin/dashboard">Ir al Dashboard</Link>}

            {!user.is_admin && (
              <div>
                <Link to="/likes"><button>Me gusta</button></Link>
                {/* <Link to="/purchases"><button>Ver compras</button></Link>
                <Link to="/edit-profile"><button>Editar perfil</button></Link> */}
              </div>
            )}

            {/* Aquí se muestra el botón de cerrar sesión solo en el perfil */}
            <button className="logout-btn" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        ) : (
          <p>Cargando...</p>
        )}
      </div>
    </>
  );
};

export default Profile;
