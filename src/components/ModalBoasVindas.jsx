import React from 'react';
import '../styles/ModalBoasVindas.css';
import { useNavigate } from 'react-router-dom';

export default function ModalBoasVindas({ isOpen, message }) {
  if (!isOpen) return null;

  const navegar = useNavigate()


  return (
    <div className="modal-overlayBV">
      <div className="modal-contentBV">
        <div className='texto'>{message}</div>
        <button onClick={()=>{navegar('/CurriculoForm')}} className="close-btn">Preencher curriculo Vitea</button>
      </div>
    </div>
  );
}
