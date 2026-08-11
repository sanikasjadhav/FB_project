import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import { FaInstagram, FaWhatsapp, FaYoutube } from "react-icons/fa";


function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Logo */}
        <div className="footer-section">
          <h2>Fashion Boutique</h2>
          <p>
            Learn Fashion Designing, Tailoring, Embroidery and Boutique
            Management through practical training and expert guidance.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/courses">Courses</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Courses */}
        <div className="footer-section">
          <h3>Courses</h3>
          <ul>
            <li>Fashion Designing</li>
            <li>Tailoring</li>
            <li>Embroidery</li>
            <li>Boutique Management</li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h3>Contact</h3>
          <p>📍 Vaduj, Satara, Maharashtra</p>
          <p>📞 +91 7741851198</p>
          <p>✉️ fashionboutique111@gmail.com</p>


        <div className="social-icons">
          {/* Instagram */}
          <a
            href="https://www.instagram.com/mayuri_07k/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/917741851198"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
          >
            <FaWhatsapp />
          </a>

          {/* YouTube */}
          <a
            href="https://www.youtube.com/@fashionboutique111"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
          >
            <FaYoutube />
          </a>
        </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Fashion Boutique. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;