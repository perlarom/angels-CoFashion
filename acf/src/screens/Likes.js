import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Likes.css";

const Likes = () => {
  const [likedProducts, setLikedProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLikedProducts = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Debes iniciar sesión para ver tus productos favoritos.");
        return;
      }

      try {
        const res = await fetch("http://localhost:8000/api/products/likes/", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setLikedProducts(data); // Aquí el estado de liked debe venir desde la API
      } catch (error) {
        console.error("Error al obtener productos favoritos:", error);
      }
    };

    fetchLikedProducts();
  }, []);

  const handleAddToCart = (productId) => {
    console.log(`Producto con id: ${productId} agregado al carrito`);
  };

  const handleLikeToggle = async (productId) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Debes iniciar sesión para dar me gusta.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/products/${productId}/like/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok) {
        if (data.liked) {
          setLikedProducts((prev) => [...prev, data.product]);
          localStorage.setItem("likedProducts", JSON.stringify([...likedProducts, data.product])); // Actualizar en localStorage
          alert("Me gusta agregado con éxito");
        } else {
          setLikedProducts((prev) => prev.filter(product => product.id !== productId));
          const updatedLikes = likedProducts.filter(product => product.id !== productId);
          localStorage.setItem("likedProducts", JSON.stringify(updatedLikes)); // Eliminar de localStorage
          alert("Se quitó de los me gusta");
        }
      } else {
        console.error("Error al actualizar los me gusta:", data.error);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  return (
    <div className="likes-container">
      <Header />
      <section className="likes-section">
        <h2 className="likes-title">Mis productos favoritos</h2>
        <div className="likes-grid gap-6">
          {likedProducts.length > 0 ? (
            likedProducts.map((product) => (
              <div key={product.id} className="product-item-likes">
                <div className="product-image-container-likes">
                  {product.images && product.images.length > 0 ? (
                    <img src={`${product.images[0].image_url}`} alt={product.name} />
                  ) : (
                    <p>No hay imagen disponible</p>
                  )}
                </div>
                <h3 className="product-title-likes">{product.name}</h3>
                <p className="product-price-likes">${product.price}</p>

                <button className="product-button-likes" onClick={() => navigate(`/ver-producto/${product.id}`)}>
                  Ver más
                </button>

                <div className="product-actions-likes">
                  <button
                    className="like-button-likes"
                    onClick={() => handleLikeToggle(product.id)}
                  >
                    <i
                      className={`fa ${product.liked ? "fa-heart" : "fa-heart-o"}`}
                      style={{ color: product.liked ? "red" : "black" }}
                    ></i>
                  </button>
                  <button className="add-to-cart-button-likes" onClick={() => handleAddToCart(product.id)}>
                    Agregar al carrito
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No tienes productos favoritos.</p>
          )}
        </div>
      </section>
      <div className="footer-wrapper">
        <Footer />
      </div>
    </div>
  );
};

export default Likes;
