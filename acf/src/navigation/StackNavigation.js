import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../screens/Home.js";
import Principal from "../screens/Principal.js";
import About from "../screens/About.js";
import Contact from "../screens/Contacto.js";

const StackNavigation = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/acerca-de" element={<About/>}/>
        <Route path="/contacto" element={<Contact/>}/>
        <Route path="/principal" element={<Principal />} />
      </Routes>
    </Router>
  );
};

export default StackNavigation;
