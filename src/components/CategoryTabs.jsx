import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css'; // Certifique-se que o CSS atualizado esteja aqui

const categories = ['Hoje', 'Feed', 'Prestadores de serviços', 'Serviços'];

export default function CategoryTabs({ activeCategory, setActiveCategory }) {
  const navigate = useNavigate();

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
    if (cat === 'Feed') navigate('/Feed');
    if (cat === 'Hoje') navigate('/');
    if (cat === 'Serviços') navigate('/Buscar');
    if (cat === 'Prestadores de serviços') navigate('/PrestadorServico');
  };

  return (
    <div className="category-banner">
      {categories.map((cat) => (
        <div
          key={cat}
          className={`category-item ${activeCategory === cat ? 'active' : ''}`}
          onClick={() => handleCategoryClick(cat)}
        >
          <span>{cat}</span>
          {activeCategory === cat && <div className="active-underline" />}
        </div>
      ))}
    </div>
  );
}
