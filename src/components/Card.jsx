import React from 'react';
import styles from './Card.module.css';

function Card({ item }) {
  return (
    <div className={styles.card}>
      <img src={item.image} alt={item.title} className={styles.thumbnail} />
      <div className={styles.info}>
        <strong>{item.title}</strong>
        <p>{item.category}</p>
        <span>⭐ {item.rating}</span>
      </div>
    </div>
  );
}

export default Card;