import React from 'react';
import styles from './Card.module.css';
import Card from './Card';

function CardCarousel({ items }) {
  return (
    <div className={styles.carousel}>
      {items.map((item) => (
        <Card key={item.id} item={item} />
      ))}
    </div>
  );
}

export default CardCarousel;
