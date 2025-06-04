// src/components/FilterBar.jsx
import React from 'react';
import styles from './FilterBar.module.css';

const filters = ['Windows', 'Telemóvel', 'Tablet', 'TV', 'Chromebook', 'Relógio'];

function FilterBar() {
  return (
    <div className={styles.filterBar}>
      {filters.map((filter) => (
        <button key={filter} className={styles.filterButton}>
          {filter}
        </button>
      ))}
    </div>
  );
}

export default FilterBar;