import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/SubcategoryProducts.css";
import "font-awesome/css/font-awesome.min.css";

const SubcategoryProducts = () => {
  const { subcategoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [likedProducts, setLikedProducts] = useState([]); // Almacenar productos con "me gusta"
  const navigate = useNavigate();

  // Cargar productos con "me gusta" desde localStorage
  useEffect(() => {
    // Recuperamos los productos con "me gusta" de localStorage
    const savedLikes = JSON.parse(localStorage.getItem("likedProducts")) || [];
    setLikedProducts(savedLikes);

    // Fetch de productos por subcategoría
    const fetchProductsBySubcategory = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/products/subcategory/${subcategoryName}`);
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };

    fetchProductsBySubcategory();
  }, [subcategoryName]);

  // Manejar el "me gusta"
  const handleLike = async (productId) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      alert("Debes iniciar sesión para dar me gusta.");
      return;
    }

    try {
      let updatedLikes;

      if (likedProducts.includes(productId)) {
        // Si ya estaba marcado, lo desmarcamos (quitamos el "me gusta")
        updatedLikes = likedProducts.filter((id) => id !== productId);

        // Mostrar mensaje de que se quitó el "me gusta"
        alert("Se quitó de los me gusta");
      } else {
        // Si no estaba marcado, lo agregamos
        updatedLikes = [...likedProducts, productId];
      }

      // Actualizamos el estado de likedProducts
      setLikedProducts(updatedLikes);

      // Guardamos los productos con "me gusta" en localStorage
      localStorage.setItem("likedProducts", JSON.stringify(updatedLikes));

      // Si la respuesta fue exitosa, mostramos mensaje de éxito
      if (!likedProducts.includes(productId)) {
        alert("Me gusta agregado con éxito");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  const handleViewProduct = (productId) => {
    navigate(`/ver-producto/${productId}`);
  };

  const handleAddToCart = (productId) => {
    console.log(`Producto con id: ${productId} agregado al carrito`);
  };

  return (
    <div className="productos-container">
      <Header />
      <section className="productos-section">
        <h2 className="products-title">{`Productos de la subcategoría: ${subcategoryName}`}</h2>
        <div className="grid gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="product-item">
                <div className="product-image-container">
                  {product.images && product.images.length > 0 ? (
                    <img src={`http://localhost:8000${product.images[0]}`} alt={product.name} />
                  ) : (
                    <p>No hay imagen disponible</p>
                  )}
                </div>
                <h3 className="product-title">{product.name}</h3>
                <p className="product-price">${product.price}</p>

                <button className="product-button" onClick={() => handleViewProduct(product.id)}>
                  Ver más
                </button>

                <div className="product-actions">
                  <button
                    className="like-button"
                    onClick={() => handleLike(product.id)}
                  >
                    <i
                      className={`fa ${likedProducts.includes(product.id) ? "fa-heart" : "fa-heart-o"}`}
                      style={{ color: likedProducts.includes(product.id) ? "red" : "black" }}
                    ></i>
                  </button>
                  <button className="add-to-cart-button" onClick={() => handleAddToCart(product.id)}>
                    Agregar al carrito
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No hay productos disponibles para esta subcategoría.</p>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default SubcategoryProducts;
