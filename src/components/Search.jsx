import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

export default function Search() {
  const [busca, setBusca] = useState('');

  return (
    <div style={styles.searchBox}>
      <FiSearch size={20} color="#888" />
      <input
        type="text"
        placeholder="Digite o nome do serviço ou do prestador de serviço"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        style={styles.input}
      />
    </div>
  );
}

const styles = {
    searchBox: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: '12px',
      padding: '10px 12px',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      marginBottom: '20px',
    },
    input: {
      marginLeft: '10px',
      flex: 1,
      fontSize: '16px',
      border: 'none',
      outline: 'none',
      width: '100%',
    },
  };