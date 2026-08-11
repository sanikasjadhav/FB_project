import React from "react";
import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">

      {/* Logo */}
      <div className="logo">
        <img src="/images/logofbn.jpg" alt="Fashion Boutique Logo" />
        <div className="logo-text">
          <p>FASHION</p>
          <p>BOUTIQUE</p>
        </div>
      </div>

      {/* Navigation */}
      <ul className="nav-links">
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/about">About</NavLink></li>
        <li><NavLink to="/courses">Courses</NavLink></li>
        <li><NavLink to="/gallery">Gallery</NavLink></li>
        <li><NavLink to="/contact">Contact</NavLink></li>
      </ul>

      {/* Login */}
      <Link to="/login">
        <button className="download-btn">Login</button>
      </Link>

    </nav>
  );
}

export default Navbar;