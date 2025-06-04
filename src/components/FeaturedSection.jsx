import React, { useState, useEffect, useRef } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import './FeaturedSection.css';

export default function FeaturedSection({ featured, onSeeAll, title }) {
  const [selectedImage, setSelectedImage] = useState(null);
const [showImageModal, setShowImageModal] = useState(false);

const openImageModal = (imgUrl) => {
  setSelectedImage(imgUrl);
  setShowImageModal(true);
};


  return (
    <>
      <div className="header HHMo">
        <div>
          <h2 className="title">{title}</h2>
        </div>
        <div>
          <button onClick={onSeeAll} className="see-more">
            <FaArrowRight size={30} color="#225b79" />
          </button>
        </div>
      </div>

    <div className="list">
  {featured.map((item) => (
    <div key={item.id} className="item">
      <img
        src={`http://t1emprego.com/${item.img}`}
        className="image"
        alt={item.name}
        onClick={() => openImageModal(`http://t1emprego.com/${item.img}`)}
        style={{ cursor: 'pointer' }}
      />
      <p className="text">{item.name}</p>
    </div>
  ))}
</div>

{showImageModal && (
  <div className="modal-overlayFPPerfil" onClick={() => setShowImageModal(false)}>
    <div className="modal-contentFPPerfil" onClick={(e) => e.stopPropagation()}>
      <img src={selectedImage} alt="Imagem em destaque" className="full-avatar" />
    </div>
  </div>
)}

    </>
  );
}
