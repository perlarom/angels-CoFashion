import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Inicio.css";

const Inicio = () => {
  const [products, setProducts] = useState([]);
  const [likedProducts, setLikedProducts] = useState([]);
  const navigate = useNavigate(); 
  const isAuthenticated = localStorage.getItem("authToken");

  useEffect(() => {
    fetch("http://localhost:8000/api/ultimos-productos/")
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error al obtener productos:", error));

      const token = localStorage.getItem("authToken");
      if (token) {
        fetch("http://localhost:8000/api/products/likes/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (Array.isArray(data)) {
              setLikedProducts(data);
            } else {
              console.warn("La respuesta no es un arreglo:", data);
              setLikedProducts([]);
            }
          })
          .catch((error) => {
            console.error("Error al obtener productos liked:", error);
            setLikedProducts([]);
          });
      } else {
        setLikedProducts([]); 
      }
    }, []);

  const handleViewProduct = (productId) => {
    navigate(`/ver-producto/${productId}`);
  };

  const handleLike = async (productId) => {
    if (!isAuthenticated) {
      alert("Debes iniciar sesión para dar me gusta.");
      return;
    }

    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(`http://localhost:8000/api/products/${productId}/like/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        let updatedLikes;
        const product = products.find((product) => product.id === productId);

        const alreadyLiked =
          Array.isArray(likedProducts) &&
          likedProducts.some((p) => p.id === productId);

        if (alreadyLiked) {
          updatedLikes = likedProducts.filter((p) => p.id !== productId);
        } else {
          updatedLikes = [...likedProducts, product];
          setTimeout(() => {
            if (window.confirm("¿Quieres ver tus Me Gusta?")) {
              navigate("/likes");
            }
          }, 200);
        }

        setLikedProducts(updatedLikes);
        localStorage.setItem("likedProducts", JSON.stringify(updatedLikes));
      } else {
        console.error("Error:", result.error);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  // const handleAddToCart = (productId) => {
  //   if (!isAuthenticated) {
  //     alert("Debes iniciar sesión para agregar al carrito.");
  //     return;
  //   }
  //   console.log(`Producto ${productId} agregado al carrito`);
  // };

  return (
    <>
      <Header />
      <section className="welcome-section">
        <div className="welcome-content">
          <h1 className="welcome-title">Moda sin reglas. Encuentra tu estilo único en Angels & Co. Fashion.</h1>
          <Link to="/tienda">
            <button className="welcome-button">Descubre la Colección</button>
          </Link>
        </div>
      </section>

      <section className="products-section">
        <h2 className="products-title">Productos Nuevos</h2>
        <div className="grid gap-6">
          {products.map((product) => (
            <div key={product.id} className="product-item">
              {product.images && product.images.length > 0 ? (
                <img src={`http://localhost:8000${product.images[0]}`} alt={product.name} />
              ) : (
                <p>No hay imagen disponible</p>
              )}
              <h3 className="product-title">{product.name}</h3>
              <p className="product-price">${product.price}</p>

              <button
                className="product-button"
                onClick={() => handleViewProduct(product.id)}
              >
                Ver más
              </button>

              {isAuthenticated ? (
                <div className="product-actions">
                  <button
                    className="like-button"
                    onClick={() => handleLike(product.id)}
                  >
                    <i
                      className={`fa ${
                        Array.isArray(likedProducts) &&
                        likedProducts.some((p) => p.id === product.id)
                          ? "fa-heart"
                          : "fa-heart-o"
                      }`}
                      style={{
                        color:
                          Array.isArray(likedProducts) &&
                          likedProducts.some((p) => p.id === product.id)
                            ? "red"
                            : "black",
                      }}
                    ></i>
                  </button>
                  {/* <button 
                    className="add-to-cart-button" 
                    onClick={() => handleAddToCart(product.id)}>
                    Agregar al carrito
                  </button> */}
                </div>
              ) : (
                <p>Inicia sesión para interactuar con los productos.</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Inicio;
