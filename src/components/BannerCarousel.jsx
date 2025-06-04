import React, { useRef } from 'react';
import './BannerCarousel.css';
import { useNavigate } from 'react-router-dom';
const BannerCarousel = ({ banners }) => {
  const scrollContainerRef = useRef(null);
 const navegar = useNavigate()
  const scrollTo = (index) => {
    if (scrollContainerRef.current) {
      const width = scrollContainerRef.current.offsetWidth;
      scrollContainerRef.current.scrollTo({
        left: width * index,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="carousel-wrapper">
      <h2 className="section-highlight-title">🔥 Em Alta</h2>
      <div className="carousel-container" ref={scrollContainerRef}>
        {banners.map((item, index) => (
          <div className="banner-container" key={item.id}>
            <img src={item.image} alt={item.title} className="banner-image" />
            <div className="banner-text-container">
              <span className="banner-title">{item.title}</span>
              <span className="app-rating">{item.rating} ⭐</span>
              <button className="install-button" onClick={()=>{navegar(`/perfil/${item.userid}`)}}>Perfil</button>
            </div>
          </div>
        ))}
      </div>

      {/* Paginação (pontos) */}
      <div className="pagination-dots">
        {banners.map((_, index) => (
          <button
            key={index}
            className="dot"
            onClick={() => scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;
