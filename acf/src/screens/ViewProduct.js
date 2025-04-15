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
  const [selectedImage, setSelectedImage] = useState(""); 
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);  // Estado para la cantidad
  const [showCartMessage, setShowCartMessage] = useState(false);
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem("authToken");

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/products/${id}/`)
      .then((response) => response.json())
      .then((data) => {
        setProduct(data);
        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0].image_url);
          console.log("Imagen principal cargada:", data.images[0].image_url);
        }

        const savedLikes = JSON.parse(localStorage.getItem("likedProducts")) || [];
        setIsLiked(savedLikes.includes(id)); // Verifica si el producto está en los "me gusta"
      })
      .catch((error) => console.error("Error al obtener el producto", error));
  }, [id]);

  const handleSizeSelect = (size) => {
    setSelectedSize(size); 
  };

  const handleQuantityChange = (event) => {
    setSelectedQuantity(event.target.value);  // Actualiza la cantidad seleccionada
  };

  const handleLike = async () => {
    if (!isLoggedIn) {
      alert("Debes estar logueado para dar me gusta.");
      return;
    }

    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(`http://localhost:8000/api/products/${id}/like/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        const likedProducts = JSON.parse(localStorage.getItem("likedProducts")) || [];
        let updatedLikes;

        if (isLiked) {
          updatedLikes = likedProducts.filter((productId) => productId !== id); // Elimina el "like"
        } else {
          updatedLikes = [...likedProducts, id]; // Agrega el "like"
        }

        setIsLiked(!isLiked);  // Actualiza el estado de "like"
        localStorage.setItem("likedProducts", JSON.stringify(updatedLikes));

        if (!isLiked) {
          setTimeout(() => {
            if (window.confirm("¿Quieres ver tus Me Gusta?")) {
              navigate("/likes");
            }
          }, 200);
        }
      } else {
        console.error("Error:", result.error);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      alert("Debes estar logueado para agregar al carrito.");
      return;
    }

    if (!selectedSize) {
      alert("Por favor selecciona una talla antes de agregar al carrito.");
      return;
    }

    fetch(`http://127.0.0.1:8000/cart/add/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify({
        productId: id,
        sizeId: selectedSize.size.id,
        quantity: selectedQuantity,
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Error al agregar al carrito");
        setIsInCart(true);
        setShowCartMessage(true);
        setIsMessageVisible(true);
        setTimeout(() => setIsMessageVisible(false), 3000);
      })
      .catch((error) => console.error(error));
  }; 

  return (
    <div>
      <Header />
      <div>
        {product ? (
          <div className="productDetails">
            <h1 className="productName">{product.name}</h1>

            <div className="productContainer">
              <div className="productImageContainer">
                <div className="mainImage">
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

                {/* Selección de cantidad */}
                {selectedSize && (
                  <div className="quantityContainer">
                    <h3>Cantidad</h3>
                    <select
                      value={selectedQuantity}
                      onChange={handleQuantityChange}
                    >
                      {[...Array(5)].map((_, index) => (
                        <option key={index} value={index + 1}>
                          {index + 1}
                        </option>
                      ))}
                    </select>
                    <span className="unitText">{selectedQuantity === 1 ? "Unidad" : "Unidades"}</span>
                  </div>
                )}

                <div className="skuContainer">
                  <h3>SKU:</h3>
                  <textarea
                    value={product.sku}
                    readOnly
                    className="skuInput"
                    onClick={(e) => e.target.select()}
                  />
                </div>

                <div className="actionsContainer">
                  <button onClick={handleLike} className="likeButton">
                    {isLiked ? "Quitar Me Gusta" : "Dar Me Gusta"}
                  </button>
                  <button onClick={handleAddToCart} className="addToCartButton">
                    {isInCart ? "Producto en el carrito" : "Agregar al carrito"}
                  </button>
                </div>

                {isMessageVisible && showCartMessage && (
                  <div className="cartMessage">
                    <p>¡Producto agregado al carrito!</p>
                    <button 
                      onClick={() => navigate("/cart")} 
                      className="viewCartButton">
                      Ver Carrito
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="thumbnailImages">
              {product.images && product.images.length > 0 ? (
                product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image.image_url}
                    alt={`Imagen del producto ${index + 1}`}
                    className={`thumbnail ${selectedImage === image.image_url ? "selected" : ""}`}
                    onClick={() => setSelectedImage(image.image_url)}
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
