import { FaFacebook, FaInstagram, FaTwitter, FaCcVisa, FaCcMastercard, FaCcPaypal } from "react-icons/fa";
import "../styles/Footer.css"

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-container">

        <div>
          <h3>Enlaces Rápidos</h3>
          <ul>
            <li><a href="/acerca-de">Acerca de Nosotros</a></li>
            <li><a href="/policies">Políticas y Términos</a></li>
            <li><a href="/contacto">Contacto</a></li>
          </ul>
        </div>

        <div className="contact-info">
          <h3>Ubicación & Soporte</h3>
          <p>📍 Ciudad de México, México</p>
          <p>✉ contacto@angelscofashion.com</p>
          <p>📞 +52 55 1234 5678</p>
        </div>

        <div>
          <h3>Síguenos</h3>
          <div className="social-icons">
            <a href="https://www.facebook.com" className="hover:text-gray-400"><FaFacebook /></a>
            <a href="https://www.facebook.com" className="hover:text-gray-400"><FaInstagram /></a>
            <a href="https://www.facebook.com" className="hover:text-gray-400"><FaTwitter /></a>
          </div>
          <h3>Métodos de Pago</h3>
          <div className="payment-icons">
            <FaCcVisa />
            <FaCcMastercard />
            <FaCcPaypal />
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Angels & Co. Fashion - Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
