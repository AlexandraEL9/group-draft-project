import "../../../index.scss";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./hamburger.scss"; 


function Hamburger() {
const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <button
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
        aria-haspopup="true"
        aria-expanded={menuOpen}
        aria-controls="navbar-menu"
      >
        ☰
      </button>
      {menuOpen && (
        <div
          className="menu"
          id="navbar-menu"
          role="menu"
          onMouseLeave={() => setMenuOpen(false)} // close when cursor leaves
        >
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link to="/login" onClick={() => setMenuOpen(false)}>
            Login
          </Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>
            Our Team
          </Link>
        </div>
        )}
  </>);
}
export default Hamburger;