import React from 'react';
import { CATEGORIES } from '../constants/categories';

export default function CategoryFilter({ selectedCategory, onSelect }) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        {CATEGORIES.map((cat, index) => (
          <button
            key={index}
            style={{
              ...styles.item,
              ...(selectedCategory === cat ? styles.selected : {}),
            }}
            onClick={() => onSelect(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    position: 'sticky',
    top: 0,
    zIndex: 999,
    backgroundColor: '#fff',
    padding: '10px 10px 0 10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  container: {
    display: 'flex',
    overflowX: 'auto',
    paddingBottom: '10px',
    gap: '10px',
    scrollBehavior: 'smooth',
  },
  item: {
    backgroundColor: '#ddd',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '13px',
    border: 'none',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'background-color 0.3s ease',
  },
  selected: {
    backgroundColor: '#225b79',
    color: '#fff',
  },
};
