import React from 'react';
import './ModalFeedback.css';
import PrimaryBtn from './PrimaryBtn';
export default function ModalFeedback({ isOpen, onClose, message,listaSer=false,onClick }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlayFBB">
      <div className="modal-contentFBB">
        <p>{message}</p>
        {
          listaSer === true && (
            <>
             <PrimaryBtn onClick={onClick}>Comfirmar</PrimaryBtn>
            </>
          )
        }
        <button onClick={onClose} className="close-btn">Fechar</button>
      </div>
    </div>
  );
}
