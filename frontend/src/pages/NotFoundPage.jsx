import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage = () => (
  <div className="not-found">
    <div className="not-found__card">
      <h1>404</h1>
      <p>Página não encontrada.</p>
      <Link to="/" className="button">
        Voltar para o início
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
