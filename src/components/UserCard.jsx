import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaStar } from 'react-icons/fa';
import userImg from '../assets/user_male.jpg';
import '../styles/UserCard.css'
export default function UserCard({ item }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/perfil/${item.userid}`);
  };

  return (
  <div style={styles.cardContainer} className='CardContair' onClick={handleClick}>
      <img
      src={
        item.profile_image && item.profile_image !== 'https://t1emprego.com/'
          ? item.profile_image
          : userImg
      }
      alt={item.username}
      style={styles.cardImage}
    />

     

      <div style={styles.cardInfo} className='cardInfo'>
        <div style={styles.cardHeader}>
          <h3 style={styles.cardTitle}>{item.username}</h3>
                
          <FaCheckCircle size={18} color="#4CAF50" style={{ marginLeft: 6 }} />
        </div>
        <span className={`online ${item.online === 'online' ? 'ativo' : ''}`}>
      {item.online}
      </span>
        <div style={styles.cardRating}>
          <FaStar size={20} color="#FFD700" />
          <span style={styles.cardRatingText}>{item.rating}</span>
        </div>
        <p style={styles.cardSubtitle}>Profissão: {item.profissao}</p>
      </div>
    </div>
  );
}

const styles = {
  cardContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: '12px',
    margin: '8px 16px',
    padding: '12px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer', // Adiciona o cursor de ponteiro para indicar que é clicável
  },
  cardImage: {
    width: '80px',
    height: '80px',
    borderRadius: '40px',
    marginRight: '12px',
  },
  cardInfo: {
    flex: 1,
  },
  cardHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '4px',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
  },
  cardRating: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '4px',
  },
  cardRatingText: {
    marginLeft: '4px',
    color: '#555',
    fontSize: '14px',
  },
  cardSubtitle: {
    color: '#666',
    fontSize: '13px',
  },
};
