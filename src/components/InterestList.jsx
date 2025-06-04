import React, { useEffect, useState } from 'react';
import {
  FaBolt, FaLaptop, FaTint, FaLeaf, FaCar, FaBaby, FaPalette, FaQuestion
} from 'react-icons/fa';
import '../styles/CategoriaLista.css'
const iconMap = {
  'Eletricista': <FaBolt size={24} color="#4285F4" />,
  'TI / Informática': <FaLaptop size={24} color="#4285F4" />,
  'Encanador': <FaTint size={24} color="#4285F4" />,
  'Jardineiro': <FaLeaf size={24} color="#4285F4" />,
  'Mecânico': <FaCar size={24} color="#4285F4" />,
  'Babá': <FaBaby size={24} color="#4285F4" />,
  'Pintor': <FaPalette size={24} color="#4285F4" />,
};

export default function InterestList({ onSelect }) {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    fetch('https://t1emprego.com/api/getCategorias.php')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCategorias(data);
      })
      .catch(err => console.error('Erro ao buscar categorias:', err));
  }, []);

  return (
  <div className="ContainInter">
  <h3>🔎 Procurando algo específico?</h3>
  <div className="list">
    {categorias.map((item) => (
      <div key={item.id} onClick={() => onSelect(item.nome)} className="itemLista">
        {iconMap[item.nome] || <FaQuestion size={18} color="#4285F4" />}
        <span className="label">{item.nome}</span>
      </div>
    ))}
  </div>
</div>


  );
}

const styles = {
  container: {
    marginTop: '30px',
    marginBottom: '10px',
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    paddingLeft: '16px',
    marginBottom: '10px',
    color: '#333',
  },
  list: {
    display: 'flex',
    flexDirection: 'row',
    overflowX: 'auto',
    paddingLeft: '16px',
  },
item: {
  backgroundColor: '#ffffff',
  padding: '16px 12px',
  borderRadius: '16px',
  alignItems: 'center',
  marginRight: '16px',
  width: '210px',
  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.08)',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
},

  label: {
    marginTop: '8px',
    fontSize: '13px',
    textAlign: 'center',
    color: ' #225b79',
    fontWeight:'bold'
  },
};
