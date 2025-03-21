import React, { useState, useEffect } from 'react';  
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import './AddProducts.css'; // Importamos el archivo CSS externo

const AddProduct = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [imageError, setImageError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    subcategories: [],
    images: [],
    stock: {},
    totalStock: 0
  });
  
  const navigate = useNavigate(); // Crear la instancia de navigate
  
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/categories/')
      .then(response => setCategories(response.data))
      .catch(error => console.error('Error fetching categories:', error));

    axios.get('http://127.0.0.1:8000/api/subcategories/')
      .then(response => setSubcategories(response.data))
      .catch(error => console.error('Error fetching subcategories:', error));

    axios.get('http://127.0.0.1:8000/api/sizes/')
      .then(response => setSizes(response.data))
      .catch(error => console.error('Error fetching sizes:', error));
  }, []);

  const handleSubcategoryChange = (subcategoryId) => {
    setFormData(prevState => {
      const newSubcategories = prevState.subcategories.includes(subcategoryId)
        ? prevState.subcategories.filter(id => id !== subcategoryId)
        : [...prevState.subcategories, subcategoryId];
      return { ...prevState, subcategories: newSubcategories };
    });
  };

  const handleSizeChange = (size, event) => {
    const stockValue = event.target.value;
    setFormData(prevState => {
      const updatedStock = { ...prevState.stock, [size]: stockValue };
      const totalStock = Object.values(updatedStock).reduce((acc, stock) => acc + parseInt(stock), 0);
      return { ...prevState, stock: updatedStock, totalStock };
    });
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + formData.images.length > 5) {
      setImageError('Solo puedes subir hasta 5 imágenes.');
      return;
    }
    setImageError('');
    setFormData(prevState => ({
      ...prevState,
      images: [...prevState.images, ...files]
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData();

    // Campos requeridos
    if (!formData.name || !formData.description || !formData.price || !formData.subcategories.length) {
      alert("Por favor complete todos los campos requeridos.");
      return;
    }

    // Agregar los datos al FormData
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);

    formData.subcategories.forEach(subcategory => {
      data.append('subcategories[]', subcategory);
    });

    const totalStock = Object.values(formData.stock).reduce((acc, stock) => acc + Number(stock), 0);
    data.append('total_stock', totalStock);

    formData.images.forEach(image => data.append('images', image));

    // Validar y agregar tamaños de stock
    Object.entries(formData.stock).forEach(([sizeName, stock]) => {
      const sizeId = sizes.find(size => size.name === sizeName)?.id;
      if (sizeId !== undefined) {
        if (isNaN(stock)) {
          alert(`El stock para el tamaño ${sizeName} no es un número válido.`);
          return;
        }
        data.append(`sizes[${sizeId}]`, stock);
      }
    });

    // Verificar si el FormData está correctamente configurado
    console.log("Datos enviados:", Object.fromEntries(data));

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/products/create/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Producto creado con éxito');
      navigate('/admin/productos');
    } catch (error) {
      console.error('Error creating product:', error.response?.data);
      alert('Hubo un error al crear el producto: ' + error.response?.data?.message || 'Desconocido');
    }
  };

  const handleCancel = () => {
    navigate('/admin/productos'); // Redirigir a la página de productos
  };

  return (
    <div>
      <h2 className="centered-text">Crear Producto</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre</label>
          <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
        </div>

        <div>
          <label>Descripción</label>
          <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
        </div>

        <div>
          <label>Precio</label>
          <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
        </div>

        {categories.map(category => (
          <div key={category.id} className="category-container">
            <span className="category-title">{category.name}</span>
            <div className="subcategory-container">
              {subcategories.filter(sub => sub.category === category.id).map(subcategory => (
                <button 
                  key={subcategory.id} 
                  type="button" 
                  className={`subcategory-button ${formData.subcategories.includes(subcategory.id) ? 'selected' : ''}`} 
                  onClick={() => handleSubcategoryChange(subcategory.id)}
                >
                  {subcategory.name}
                </button>
              ))}
            </div>
          </div>
        ))}
        
        <div>
          <label>Imágenes (Máximo 5)</label>
          <input type="file" multiple onChange={handleImageChange} accept="image/*" />
          {imageError && <p style={{ color: 'red' }}>{imageError}</p>}

          <div className="image-preview-container">
            {formData.images.map((image, index) => (
              <img
                key={index}
                src={URL.createObjectURL(image)}
                alt={`preview-${index}`}
                className="image-preview"
              />
            ))}
          </div>
        </div>

        <div>
          <label>Stock por Talla</label>
          {sizes.map(size => (
            <div key={size.id}>
              <label>{size.name}</label>
              <input type="number" value={formData.stock[size.name] || 0} onChange={(e) => handleSizeChange(size.name, e)} min="0" />
            </div>
          ))}
        </div>

        <div>
          <label>Stock Total: {formData.totalStock}</label>
        </div>

        <button type="submit">Guardar Producto</button>
        <button type="button" onClick={handleCancel}>Cancelar</button> {/* Botón de cancelar */}
      </form>
    </div>
  );
};

export default AddProduct;
