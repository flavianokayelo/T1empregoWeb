import React from 'react';
import { useNavigate } from 'react-router-dom';
import userImg from '../assets/placeholder-image.jpg';
import '../styles/AppCard.css'
export default function AppCard({ item}) {
  const navegar = useNavigate()
  return (
    <div className='listaAppCard'>
       <div style={styles.cardContainer} onClick={()=>{
      navegar(`/perfil/${item.userid}`)
    }} className='CardContanermOa'>
      <img  src={
              item.profile_image && item.profile_image !== 'https://t1emprego.com/'
                ? item.profile_image
                : userImg
            } style={styles.cardImage} />

      <h3 style={styles.cardName}>{item.username}</h3>
      <span className={`online ${item.online === 'online' ? 'ativo' : ''}`}>
      {item.online}
      </span>
      <p style={styles.cardProfession}>{item.profissao}</p>
      {
        item.rating? <p style={styles.cardRating}>{item.rating} ⭐</p>:
        <p style={styles.cardRating}></p>
      }
     
    </div>
    </div>
  );
}

const styles = {

  cardImage: {
    width: '100px',
    height: '100px',
    borderRadius: '20px',
    objectFit: 'cover',
    marginBottom: '12px',
  },
  cardName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#222',
    marginBottom: '4px',
  },
  cardProfession: {
    fontSize: '12px',
    color: '#666',
    marginBottom: '4px',
  },
  cardRating: {
    fontSize: '13px',
    color: '#f4b400',
  },
};
