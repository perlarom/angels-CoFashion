import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Tienda.css"; // Si tienes un archivo CSS para estilos
import { useNavigate } from "react-router-dom"; // Usamos useNavigate para la redirección
import axios from "axios";

const Tienda = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate(); // Usamos useNavigate para la redirección

  // Obtener las categorías desde la API
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/categories/')
      .then(response => setCategories(response.data))
      .catch(error => console.error('Error al obtener categorías', error));
  }, []);

  // Obtener subcategorías de una categoría seleccionada
  useEffect(() => {
    if (selectedCategory) {
      axios.get(`http://127.0.0.1:8000/api/categories/${selectedCategory.id}/subcategories/`)
        .then(response => setSubcategories(response.data))
        .catch(error => console.error('Error al obtener subcategorías', error));
    }
  }, [selectedCategory]);

  // Obtener productos según la subcategoría seleccionada
  useEffect(() => {
    if (selectedSubcategory) {
      axios.get(`http://127.0.0.1:8000/api/products/?subcategory=${selectedSubcategory.id}`)
        .then(response => setProducts(response.data))
        .catch(error => console.error('Error al obtener productos', error));
    }
  }, [selectedSubcategory]);

  // Manejar la selección de una subcategoría
  const handleSubcategorySelect = (subcategory) => {
    setSelectedSubcategory(subcategory);
    navigate(`/tienda/${subcategory.id}`); // Redirige a la página de productos de la subcategoría
  };

  return (
    <div className="tienda-container">
      <Header />
      <section className="tienda-content">
        <div className="sidebar">
          <h3>Categorías</h3>
          {/* Muestra las categorías en el menú lateral */}
          <ul>
            {categories.map((category) => (
              <li key={category.id} onClick={() => setSelectedCategory(category)}>
                {category.name}
              </li>
            ))}
          </ul>

          {/* Muestra las subcategorías si se ha seleccionado una categoría */}
          {selectedCategory && (
            <div className="subcategories">
              <h3>Subcategorías de {selectedCategory.name}</h3>
              <ul>
                {subcategories.map((subcategory) => (
                  <li key={subcategory.id} onClick={() => handleSubcategorySelect(subcategory)}>
                    {subcategory.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Lista de productos */}
        <div className="product-list">
          <h1 className="tienda-title">Productos</h1>
          {products.length === 0 ? (
            <p>No hay productos disponibles en esta subcategoría.</p>
          ) : (
            products.map((product) => (
              <div key={product.id} className="product-item">
                <img src={product.image} alt={product.name} className="product-image" />
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">${product.price}</p>
                <button className="product-button">Ver más</button>
              </div>
            ))
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Tienda;
