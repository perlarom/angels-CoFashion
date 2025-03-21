import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddProducts.css";

const EditarProducto = () => {
  const { id } = useParams();  // Obtener el ID del producto desde la URL
  const [producto, setProducto] = useState(null);
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: [],
    image: [],
    selectedSizes: [],
    stockPerSize: {},
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener categorías y tamaños
    axios.get("http://localhost:8000/api/categories/")
      .then((response) => setCategories(response.data))
      .catch((error) => console.error("Error al cargar categorías:", error));

    axios.get("http://localhost:8000/api/sizes/")
      .then((response) => setSizes(response.data))
      .catch((error) => console.error("Error al cargar tallas:", error));

    // Obtener los datos del producto que se desea editar
    axios.get(`http://localhost:8000/api/products/${id}/`)
      .then((response) => {
        setProducto(response.data);
        setNewProduct({
          name: response.data.name,
          description: response.data.description,
          price: response.data.price,
          category: response.data.category,
          image: response.data.image,
          selectedSizes: response.data.sizes,
          stockPerSize: response.data.stockPerSize,
        });
      })
      .catch((error) => console.error("Error al cargar el producto:", error));
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setNewProduct((prev) => {
      const updatedCategories = checked
        ? [...prev.category, value]
        : prev.category.filter((cat) => cat !== value);
      return { ...prev, category: updatedCategories };
    });
  };

  const handleSizeChange = (e) => {
    const { value, checked } = e.target;
    setNewProduct((prev) => {
      let updatedSizes = [...prev.selectedSizes];
      if (checked) {
        updatedSizes.push(value);
      } else {
        updatedSizes = updatedSizes.filter((size) => size !== value);
      }

      return { ...prev, selectedSizes: updatedSizes };
    });
  };

  const handleStockChange = (e, size) => {
    const { value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      stockPerSize: { ...prev.stockPerSize, [size]: parseInt(value, 10) || 0 },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("description", newProduct.description);
      formData.append("price", parseFloat(newProduct.price).toFixed(2));
  
      newProduct.category.forEach((category) => {
        formData.append("categories", category);
      });
  
      newProduct.selectedSizes.forEach((size) => {
        formData.append("sizes", size);
        formData.append(`stock_${size}`, newProduct.stockPerSize[size] || 0);
      });
  
      newProduct.image.forEach((image) => {
        formData.append('images', image);
      });
  
      // Enviar solicitud PUT para actualizar el producto
      await axios.put(`http://localhost:8000/api/products/${id}/`, formData);
      console.log("Producto actualizado");
      navigate(`/product/${id}`);  // Navegar a la página de detalles del producto
    } catch (error) {
      setErrorMessage("Error al actualizar el producto.");
      console.error(error);
    }
  };  
  

  if (!producto) {
    return <p>Cargando producto...</p>;
  }

  return (
    <div>
      <h2>Editar Producto</h2>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={newProduct.name}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="description"
          placeholder="Descripción"
          value={newProduct.description}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Precio"
          value={newProduct.price}
          onChange={handleInputChange}
          required
        />

        <label>Categorías:</label>
        {categories.map((cat) => (
          <label key={cat.id}>
            <input
              type="checkbox"
              value={cat.name}
              checked={newProduct.category.includes(cat.name)}
              onChange={handleCategoryChange}
            />{" "}
            {cat.name}
          </label>
        ))}

        <label>Tallas:</label>
        {sizes.map((size) => (
          <label key={size.id}>
            <input
              type="checkbox"
              value={size.name}
              checked={newProduct.selectedSizes.includes(size.name)}
              onChange={handleSizeChange}
            />{" "}
            {size.name}
          </label>
        ))}

        {newProduct.selectedSizes.length > 0 && newProduct.selectedSizes.map((size) => (
          <div key={size}>
            <label>
              Stock para {size}:
              <input
                type="number"
                value={newProduct.stockPerSize[size] || ""}
                onChange={(e) => handleStockChange(e, size)}
                placeholder={`Stock para ${size}`}
              />
            </label>
          </div>
        ))}

        <button type="submit" className="submit-product-btn">Actualizar Producto</button>
      </form>
    </div>
  );
};

export default EditarProducto;
