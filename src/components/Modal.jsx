import React from 'react';
import './Modal.css';

const Modal = ({ title, children, onClose, show }) => {
  if (!show) return null; // NÃO renderiza nada se show for false

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        {title && <h3>{title}</h3>}
        <div className="modal-content">{children}</div>
       
      </div>
    </div>
  );
};

export default Modal;
