import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Tienda.css";

const Tienda = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("http://localhost:8000/api/categories/");
      const data = await res.json();
      setCategories(data);
    };

    const fetchSubcategories = async () => {
      const res = await fetch("http://localhost:8000/api/subcategories/");
      const data = await res.json();
      setSubcategories(data);
    };

    fetchCategories();
    fetchSubcategories();
  }, []);

  const filterSubcategories = (categoryId) => {
    if (!categoryId) return subcategories;
    return subcategories.filter((subcategory) => subcategory.category === categoryId);
  };

  const handleSubcategoryClick = (subcategoryName) => {
    navigate(`/productos/${subcategoryName}`);
  };

  return (
    <div className="tienda-container">
      <Header />
      <div className="tienda-layout">
        <aside className="categories-container">
          <h2>Categorías</h2>
          {categories.map((category) => (
            <button key={category.id} onClick={() => setSelectedCategory(category.id)}>
              {category.name}
            </button>
          ))}
          <button onClick={() => setSelectedCategory(null)}>Ver Todo</button>
        </aside>
        <main className="products-container">
          <div className="subcategory-list">
            {filterSubcategories(selectedCategory).map((subcategory) => (
              <div key={subcategory.id} className="subcategory-item">
                <h3
                  className="subcategory-name"
                  onClick={() => handleSubcategoryClick(subcategory.name)}
                >
                  {subcategory.name}
                </h3>
              </div>
            ))}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Tienda;
