import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/SubcategoryProducts.css";
import "font-awesome/css/font-awesome.min.css";

const SubcategoryProducts = () => {
  const { subcategoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [likedProducts, setLikedProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener los productos "liked" desde el localStorage
    const savedLikes = JSON.parse(localStorage.getItem("likedProducts")) || [];
    setLikedProducts(savedLikes);

    // Obtener los productos de la subcategoría desde la API
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

  const handleViewProduct = (productId) => {
    navigate(`/ver-producto/${productId}`);
  };

  const handleLike = async (productId) => {
    // Verificar si el usuario está autenticado (si es necesario)
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Debes iniciar sesión para dar me gusta.");
      return;
    }

    // Actualizar los "likes" en el estado
    let updatedLikes;
    if (likedProducts.some((product) => product.id === productId)) {
      updatedLikes = likedProducts.filter((product) => product.id !== productId);
    } else {
      const product = products.find((product) => product.id === productId);
      updatedLikes = [...likedProducts, product];
    }

    // Guardar los productos "liked" en el localStorage
    setLikedProducts(updatedLikes);
    localStorage.setItem("likedProducts", JSON.stringify(updatedLikes));

    // Realizar la solicitud para marcar el producto como "liked"
    try {
      const response = await fetch(`http://localhost:8000/api/products/${productId}/like/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (!response.ok) {
        console.error("Error al agregar el like:", result.error);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
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
                      className={`fa ${likedProducts.some((likedProduct) => likedProduct.id === product.id) ? "fa-heart" : "fa-heart-o"}`}
                      style={{ color: likedProducts.some((likedProduct) => likedProduct.id === product.id) ? "red" : "black" }}
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
