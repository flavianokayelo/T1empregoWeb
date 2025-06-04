import React, { useState } from 'react';
import styles from './Section.module.css';
import Card from './Card';

function Section({ title, items }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Função para navegar para o próximo card
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  // Função para navegar para o card anterior
  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + items.length) % items.length
    );
  };

  return (
    <div className={styles.section}>
      <h2>{title}</h2>
      <div className={styles.carouselWrapper}>
        <div
          className={styles.carousel}
          style={{
            transform: `translateX(-${currentIndex * 100}%)`, // Movimentação horizontal
          }}
        >
          {items.map((item) => (
            <div key={item.id} className={styles.cardWrapper}>
              <Card item={item} />
            </div>
          ))}
        </div>
      </div>

      {/* Botões de navegação */}
      <div className={styles.controls}>
        <button onClick={prevSlide} className={styles.controlButton}>←</button>
        <button onClick={nextSlide} className={styles.controlButton}>→</button>
      </div>
    </div>
  );
}

export default Section;
