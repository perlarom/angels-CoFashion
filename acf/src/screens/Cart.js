import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Cart.css";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]); // Estado para almacenar los productos del carrito
  const [totalPrice, setTotalPrice] = useState(0); // Estado para el precio total

  useEffect(() => {
    // Cargar los productos desde localStorage o una API
    const storedItems = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedItems);

    // Calcular el precio total
    const total = storedItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  }, []);

  const handleRemoveItem = (productId) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Actualizar el carrito en localStorage
    // Recalcular el precio total
    const total = updatedCart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length > 0) {
      navigate("/checkout"); // Redirigir a la página de pago
    } else {
      alert("Tu carrito está vacío. Agrega productos para proceder.");
    }
  };

  return (
    <div>
      <Header />
      <div className="cartContainer">
        <h1>Carrito de Compras</h1>
        {cartItems.length === 0 ? (
          <p>Tu carrito está vacío.</p>
        ) : (
          <div className="cartItems">
            {cartItems.map((item) => (
              <div key={item.id} className="cartItem">
                <img
                  src={`http://127.0.0.1:8000${item.image}`}
                  alt={item.name}
                  className="cartItemImage"
                />
                <div className="cartItemDetails">
                  <h3>{item.name}</h3>
                  <p>Talla: {item.size}</p>
                  <p>Cantidad: {item.quantity}</p>
                  <p>Precio: ${item.price}</p>
                  <p>Total: ${item.price * item.quantity}</p>
                </div>
                <button
                  className="removeButton"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="cartSummary">
          <h3>Total: ${totalPrice}</h3>
          <button onClick={handleProceedToCheckout} className="checkoutButton">
            Proceder al Pago
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
