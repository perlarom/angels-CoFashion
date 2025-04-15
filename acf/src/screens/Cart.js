import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Cart.css";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [editingItemId, setEditingItemId] = useState(null);
  const [newQuantity, setNewQuantity] = useState(1);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/cart/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        const data = await response.json();
        setCartItems(data);

        const total = data.reduce(
          (acc, item) => acc + item.product_price * item.quantity.value,
          0
        );
        setTotalPrice(total);
      } catch (error) {
        console.error('Error al cargar el carrito:', error);
      }
    };

    fetchCartItems();
  }, []);

  const handleRemoveItem = async (productId) => {
    try {
      await fetch(`http://127.0.0.1:8000/cart/remove/${productId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      const updatedItems = cartItems.filter(item => item.id !== productId);
      setCartItems(updatedItems);
      const updatedTotal = updatedItems.reduce(
        (acc, item) => acc + item.product_price * item.quantity.value,
        0
      );
      setTotalPrice(updatedTotal);
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length > 0) {
      navigate("/checkout");
    } else {
      alert("Tu carrito está vacío. Agrega productos para proceder.");
    }
  };

  const handleEditQuantity = (item) => {
    setEditingItemId(item.id);
    setNewQuantity(item.quantity.value);
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
  };

  const handleSaveQuantity = async (itemId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/cart/update/${itemId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) throw new Error("Error al actualizar cantidad");

      const updatedCart = cartItems.map(item =>
        item.id === itemId ? { ...item, quantity: { ...item.quantity, value: newQuantity } } : item
      );
      setCartItems(updatedCart);

      const updatedTotal = updatedCart.reduce(
        (acc, item) => acc + item.product_price * item.quantity.value,
        0
      );
      setTotalPrice(updatedTotal);
      setEditingItemId(null);
    } catch (error) {
      console.error("Error al guardar la nueva cantidad:", error);
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
                  src={`http://127.0.0.1:8000${item.product_image}`}
                  alt={item.product_name}
                  className="cartItemImage"
                />
                <div className="cartItemDetails">
                  <h3>{item.product_name}</h3>
                  <p>Talla: {item.size_description}</p>
                  <p>
                    Cantidad:{" "}
                    {editingItemId === item.id ? (
                      <select
                        value={newQuantity}
                        onChange={(e) => setNewQuantity(Number(e.target.value))}
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                    ) : (
                      item.quantity.value
                    )}
                  </p>
                  <p>Precio: ${item.product_price}</p>
                  <p>Total: ${item.product_price * item.quantity.value}</p>
                </div>

                <div className="cartItemActions">
                  {editingItemId === item.id ? (
                    <>
                      <button onClick={() => handleSaveQuantity(item.id)}>Guardar cambios</button>
                      <button onClick={handleCancelEdit}>Cancelar</button>
                    </>
                  ) : (
                    <button onClick={() => handleEditQuantity(item)}>
                      Editar Cantidad
                    </button>
                  )}
                  {/* <button onClick={() => handleAddToFavorites(item.id)}>
                    Agregar a Me gusta
                  </button> */}
                  <button
                    className="removeButton"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    Eliminar
                  </button>
                </div>
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
