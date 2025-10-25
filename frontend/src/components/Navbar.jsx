import React from 'react';
import './Navbar.css';

const Navbar = ({ title, onLogout }) => (
  <header className="navbar">
    <h1 className="navbar__title">{title}</h1>
    <button type="button" className="navbar__logout" onClick={onLogout}>
      Sair
    </button>
  </header>
);

export default Navbar;
