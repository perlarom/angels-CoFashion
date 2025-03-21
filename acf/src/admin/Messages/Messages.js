import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar.js";
import "./Messages.css";
import "font-awesome/css/font-awesome.min.css";
import Pagination from "../../components/Pagination";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalMessages, setTotalMessages] = useState(0);
  const messagesPerPage = 10;
  const navigate = useNavigate();

  // Fetch de los mensajes
  useEffect(() => {
    fetchMessages();
  }, [currentPage]);

  const fetchMessages = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/messages/");  // Endpoint para obtener mensajes
      if (!response.ok) throw new Error("Error al obtener los mensajes");

      const data = await response.json();
      setMessages(data.messages);
      setTotalMessages(data.total || data.messages.length);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Calcular el índice de los mensajes por página
  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = messages.slice(indexOfFirstMessage, indexOfLastMessage);

  const handleView = (id) => {
    navigate(`/admin/messages/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este mensaje?")) {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`http://127.0.0.1:8000/api/messages/${id}/`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Error al eliminar el mensaje");

        setMessages(messages.filter((message) => message.id !== id));
      } catch (error) {
        console.error("Error al eliminar:", error);
        setError(error.message);
      }
    }
  };

  return (
    <div className="main-container">
      <Sidebar />
      <div className="content">
        <h2>Lista de Mensajes</h2>
        {loading ? (
          <p>Cargando mensajes...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <div>
            <table className="messages-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Mensaje</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentMessages.length > 0 ? (
                  currentMessages.map((message) => (
                    <tr key={message.id}>
                      <td>{message.id}</td>
                      <td>{message.nombre}</td>
                      <td>{message.correo}</td>
                      <td>{message.mensaje}</td>
                      <td className="actions-column">
                        <i
                          className="fa fa-eye"
                          onClick={() => handleView(message.id)}
                        ></i>
                        <i
                          className="fa fa-trash"
                          onClick={() => handleDelete(message.id)}
                        ></i>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No hay mensajes registrados.</td>
                  </tr>
                )}
              </tbody>
            </table>

            {totalMessages > messagesPerPage && (
              <Pagination
                currentPage={currentPage}
                totalMessages={totalMessages}
                messagesPerPage={messagesPerPage}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
