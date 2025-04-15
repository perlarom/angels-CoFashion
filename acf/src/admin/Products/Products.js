import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "font-awesome/css/font-awesome.min.css";
import Sidebar from "../../components/Sidebar.js";
import "./Products.css";
import Pagination from "../../components/Pagination";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const productsPerPage = 10;

  useEffect(() => {
    setLoading(true);
    fetch("http://127.0.0.1:8000/api/products/")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
          setTotalProducts(data.length);
        } else if (Array.isArray(data.products)) {
          setProducts(data.products);
          setTotalProducts(data.total || data.products.length);
        } else {
          console.error("Formato inesperado de la API:", data);
          setProducts([]);
          setTotalProducts(0);
        }
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setProducts([]);
        setTotalProducts(0);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleView = (id) => {
    navigate(`/admin/productos/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/products/${id}/`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData?.detail || "Error al eliminar el producto");
        }
  
        // Actualizamos el estado de productos eliminando el producto que fue borrado
        setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
        alert("Producto eliminado con éxito.");
      } catch (error) {
        console.error("Error:", error);
        alert(error.message || "Hubo un error al eliminar el producto.");
      }
    }
  };    
  
  return (
    <div className="main-container">
      <Sidebar />
      <div className="content">
        <h2>Productos</h2>
        {loading ? (
          <p>Cargando Productos...</p>
        ) : products.length === 0 ? (
          <div>
            <p>No hay productos disponibles.</p>
            <div className="add-product-button">
              <Link to="/admin/agregar-producto">
                <button>Agregar Producto</button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <table className="products-table">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.description}</td>
                    <td>${product.price}</td>
                    <td>{product.total_stock}</td>
                    <td className="actions-column">
                      <i className="fa fa-eye" onClick={() => handleView(product.id)}></i>
                      <i className="fa fa-trash" onClick={() => handleDelete(product.id)}></i>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="add-product-button">
              <Link to="/admin/agregar-producto">
                <button>Agregar Producto</button>
              </Link>
            </div>
          </>
        )}
        {totalProducts > productsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalProducts={totalProducts}
            productsPerPage={productsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default Products;