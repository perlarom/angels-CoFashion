import React, { useState, useEffect } from "react"; 
import { Link, useNavigate } from "react-router-dom";  
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Inicio.css";

const Inicio = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();  // Hook de navegación
  const isAuthenticated = localStorage.getItem("authToken");  

  useEffect(() => {
    fetch("http://localhost:8000/api/ultimos-productos/")
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error al obtener productos:", error));
  }, []);

  const handleViewProduct = (productId) => {
    navigate(`/ver-producto/${productId}`);  // Redirige a la página de ver producto
  };

  const handleLike = (productId) => {
    if (isAuthenticated) {
      console.log(`Producto ${productId} marcado como "me gusta"`);
    } else {
      alert("Debes iniciar sesión para dar me gusta.");
    }
  };

  const handleAddToCart = (productId) => {
    if (isAuthenticated) {
      console.log(`Producto ${productId} agregado al carrito`);
    } else {
      alert("Debes iniciar sesión para agregar al carrito.");
    }
  };

  return (
    <>
      <div>
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
                  onClick={() => handleViewProduct(product.id)}  // Redirige al producto
                >
                  Ver más
                </button>
                
                {isAuthenticated && (
                  <div className="product-actions">
                    <button className="like-button" onClick={() => handleLike(product.id)}>
                      Me gusta
                    </button>
                    <button className="add-to-cart-button" onClick={() => handleAddToCart(product.id)}>
                      Agregar al carrito
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="benefits-section mx-auto">
          <h2 className="benefits-title">Beneficios de Comprar con Nosotros</h2>
          <div className="grid grid-cols-3 gap-2 w-full place-items-center">
            {['Envíos Gratis', 'Devoluciones Fáciles', 'Asesoría Personalizada'].map((beneficio, index) => (
              <div key={index} className="benefit-item flex items-center justify-center w-auto px-6 py-4">
                <p>{beneficio}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default Inicio;
