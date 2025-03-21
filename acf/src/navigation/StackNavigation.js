import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../screens/Home.js";
import Inicio from "../screens/Inicio.js";
import Tienda from "../screens/Tienda.js";
import About from "../screens/About.js";
import Contact from "../screens/Contacto.js";
import Login from "../screens/Login.js";
import Register from "../screens/Register.js"
import Profile from "../screens/Profile.js"
import AdminDashboard from "../admin/AdminDashboard/AdminDashboard.js"
import Products from "../admin/Products/Products.js"
import AddProducts from "../admin/Products/AddProducts.js"
import ProductDetail from "../admin/Products/ProductDetail.js"
import EditarProducto from "../admin/Products/EditProduct.js"
import Users from "../admin/Users/Users.js"
import AdminCollab from "../admin/Collaborators/AdminCollab.js"
import Messages from "../admin/Messages/Messages.js"
import VerProducto from "../screens/ViewProduct.js"
import Cart from "../screens/Cart.js"
import SubcategoryProducts from "../screens/SubcategoryProducts.js"
import Likes from "../screens/Likes.js"


const StackNavigation = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/acerca-de" element={<About/>}/>
        <Route path="/contacto" element={<Contact/>}/>
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/tienda" element={<Tienda />} />
        <Route path="/login" element={<Login />}/>
        <Route path="/registrar" element={<Register />}/>
        <Route path="/perfil" element={<Profile />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/productos" element={<Products />} />
        <Route path="/admin/usuarios" element={<Users />} />
        <Route path="/admin/agregar-producto" element={<AddProducts />} />
        <Route path="/admin/productos/:id" element={<ProductDetail />} />
        <Route path="/admin/productos/edit/:id" element={<EditarProducto />} />
        <Route path="/admin/admin-colab" element={<AdminCollab />} />
        <Route path="/admin/mensajes" element={<Messages />} />
        <Route path="/ver-producto/:id" element={<VerProducto />} />
        <Route path="/productos/:subcategoryName" element={<SubcategoryProducts />} /> 
        <Route path="/cart" element={<Cart />} />
        <Route path="/likes" element={<Likes />} />
      </Routes>
    </Router>
  );
};

export default StackNavigation;
