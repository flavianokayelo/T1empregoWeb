import React from 'react';
import { IoClose } from 'react-icons/io5';

const ModalImage = ({ imageUrl, onClose }) => {
  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeButton} onClick={onClose}>
          <IoClose size={24} color="#fff" />
        </button>
        <img src={imageUrl} alt="Imagem ampliada" style={styles.image} />
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  modal: {
    position: 'relative',
    backgroundColor: '#fff',
    borderRadius: 12,
    maxWidth: '90vw',
    maxHeight: '90vh',
    padding: 10,
    boxShadow: '0 0 15px rgba(0,0,0,0.3)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    maxWidth: '100%',
    maxHeight: '80vh',
    borderRadius: 10,
    objectFit: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#225b79',
    border: 'none',
    borderRadius: '50%',
    padding: 5,
    cursor: 'pointer',
  },
};

export default ModalImage;
