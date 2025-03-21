import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProductDetail.css";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/products/${id}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}: Producto no encontrado`);
        }
        return response.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
        // Obtener las subcategorías utilizando los IDs del producto
        const subcategoryIds = data.subcategories;
        fetchSubcategories(subcategoryIds);
      })
      .catch((error) => {
        console.error("Error al obtener el producto:", error);
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  // Función para obtener los detalles de las subcategorías
  const fetchSubcategories = (ids) => {
    fetch("http://127.0.0.1:8000/api/subcategories/")
      .then((response) => response.json())
      .then((data) => {
        // Filtrar las subcategorías que corresponden a los IDs
        const filteredSubcategories = data.filter(sub => ids.includes(sub.id));
        setSubcategories(filteredSubcategories);
      })
      .catch((error) => {
        console.error("Error al obtener las subcategorías:", error);
      });
  };

  if (loading) return <p className="loading">Cargando...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!product) return <p className="error-message">Producto no encontrado</p>;

  return (
    <div className="container">
      <h2 className="title">Detalles del Producto</h2>
      <div className="productDetails">
        <p><strong>ID:</strong> {product.id}</p>
        <p><strong>Nombre:</strong> {product.name}</p>
        <p><strong>Descripción:</strong> {product.description}</p>
        <p><strong>Precio:</strong> ${product.price}</p>
        <p><strong>SKU:</strong> {product.sku}</p>
        <p><strong>Stock Total:</strong> {product.total_stock}</p>

        {/* Tallas y Stock */}
        <div className="sizesContainer">
          <h3>Tallas y Stock:</h3>
          {product?.sizes?.length > 0 ? (
            <ul>
              {product.sizes.map((size, index) => (
                <li key={index}>
                  <strong>{size.size.name}:</strong> {size.stock} en stock
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay tallas disponibles.</p>
          )}
        </div>

        {/* Imágenes */}
        <div className="imagesContainer">
          <h3>Imágenes:</h3>
          {product?.images?.length > 0 ? (
            product.images.map((image, index) => (
              <img
                key={index}
                src={image.image_url}
                alt={`Imagen del producto ${index + 1}`}
                className="image"
              />
            ))
          ) : (
            <p>No hay imágenes disponibles.</p>
          )}
        </div>

        {/* Subcategorías */}
        <div className="subcategoriesContainer">
          <h3>Subcategorías:</h3>
          {subcategories.length > 0 ? (
            <ul>
              {subcategories.map((subcategory, index) => (
                <li key={index} className="subcategoryItem">
                  {subcategory.name}
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay subcategorías disponibles.</p>
          )}
        </div>

        {/* Botón de Volver */}
        <button onClick={() => navigate(-1)} className="backButton">
          Volver
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
