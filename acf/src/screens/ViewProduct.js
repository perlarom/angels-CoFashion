import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/ViewProduct.css";

const VerProducto = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(""); // Asegúrate de que sea un string vacío al inicio
  const [selectedSize, setSelectedSize] = useState(null);
  const [showCartMessage, setShowCartMessage] = useState(false);
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const navigate = useNavigate();

  // Simulación de estado de usuario logueado
  const isLoggedIn = true;

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/products/${id}/`)
      .then((response) => response.json())
      .then((data) => {
        setProduct(data);
        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0].image_url);
          console.log("Imagen principal cargada:", data.images[0].image_url); // Verifica que la imagen principal es correcta
        }
      })
      .catch((error) => console.error("Error al obtener el producto", error));
  }, [id]);

  const handleSizeSelect = (size) => {
    setSelectedSize(size); // Actualiza la talla seleccionada
  };

  const handleLike = () => {
    if (isLoggedIn) {
      setIsLiked(!isLiked);
      fetch(`http://127.0.0.1:8000/product/${id}/like/`, {
        method: isLiked ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      alert("Debes estar logueado para dar me gusta");
    }
  };

  const handleAddToCart = () => {
    if (isLoggedIn) {
      setIsInCart(true);
      fetch(`http://127.0.0.1:8000/cart/add/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: id, sizeId: selectedSize?.size.id }),
      })
      .then(() => {
        setShowCartMessage(true);
        setIsMessageVisible(true);
        setTimeout(() => {
          setIsMessageVisible(false);
        }, 3000);
      });
    } else {
      alert("Debes estar logueado para agregar al carrito");
    }
  };

  return (
    <div>
      <Header />
      <div>
        {product ? (
          <div className="productDetails">
            {/* Nombre en grande */}
            <h1 className="productName">{product.name}</h1>

            <div className="productContainer">
              <div className="productImageContainer">
                <div className="mainImage">
                  {/* Asegúrate de que selectedImage contiene un valor válido */}
                  {selectedImage && (
                    <img
                      src={selectedImage}
                      alt="Imagen principal"
                      className="largeImage"
                    />
                  )}
                </div>
              </div>

              <div className="productInfoContainer">
                <p><strong>Descripción:</strong> {product.description}</p>
                <div className="sizesContainer">
                  <h3>Tallas</h3>
                  {product.sizes && product.sizes.length > 0 ? (
                    <div className="tallas-container">
                      {product.sizes.map((size, index) => (
                        <button
                          key={index}
                          className={`talla-btn ${selectedSize?.size.id === size.size.id ? "selected" : ""}`}
                          onClick={() => handleSizeSelect(size)}
                        >
                          {size.size.name}
                        </button>
                      ))}
                      {selectedSize && (
                        <div className="stockInfo">
                          <strong>Disponible:</strong> {selectedSize.stock || 0}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p>No hay tallas disponibles.</p>
                  )}
                </div>

                {/* SKU */}
                <div className="skuContainer">
                  <h3>SKU:</h3>
                  <textarea
                    value={product.sku}
                    readOnly
                    className="skuInput"
                    onClick={(e) => e.target.select()}
                  />
                </div>

                {/* Acciones */}
                <div className="actionsContainer">
                  <button onClick={handleLike} className="likeButton">
                    {isLiked ? "Quitar Me Gusta" : "Dar Me Gusta"}
                  </button>
                  <button onClick={handleAddToCart} className="addToCartButton">
                    {isInCart ? "Producto en el carrito" : "Agregar al carrito"}
                  </button>
                </div>

                {/* Mensaje de éxito */}
                {isMessageVisible && showCartMessage && (
                  <div className="cartMessage">
                    <p>¡Producto agregado al carrito!</p>
                    <button onClick={() => navigate("/cart")} className="viewCartButton">
                      Ver Carrito
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Miniaturas de las imágenes */}
            <div className="thumbnailImages">
              {product.images && product.images.length > 0 ? (
                product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image.image_url}
                    alt={`Imagen del producto ${index + 1}`}
                    className={`thumbnail ${selectedImage === image.image_url ? "selected" : ""}`}
                    onClick={() => setSelectedImage(image.image_url)} // Cambia la imagen principal al hacer clic
                  />
                ))
              ) : (
                <p>No hay imágenes disponibles.</p>
              )}
            </div>

            <button onClick={() => navigate(-1)} className="backButton">Volver</button>
          </div>
        ) : (
          <p>Cargando...</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default VerProducto;