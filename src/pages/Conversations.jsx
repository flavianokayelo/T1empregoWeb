import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import RodapeNavegacao from '../components/RodapeNavegacao';
import placeholderimg from '../assets/placeholder-image.jpg';

const Url = "https://t1emprego.com/";
import '../styles/Conversations.css';

export default function Conversations() {
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('userData'));
  
  useEffect(() => {
    if (user) {
      fetch(`https://t1emprego.com/api/get_conversations.php?userid=${user.userid}`)
        .then(res => res.json())
        .then(data => setConversations(data))
       
        .catch(err => console.error('Erro ao carregar conversas:', err));
    }
  }, [user]);
// tempo decorrido 

  return (
    <>
      <Header />
      <div className="conversations-container">
        <h2>Suas conversas</h2>
        <ul className="conversation-list">
          {conversations.length === 0 && <p>Você ainda não tem conversas.</p>}
          {conversations.map((conv) => (
            <li
              key={conv.userid}
              onClick={() => navigate(`/ChatApp/${conv.userid}`)}
              className="conversation-item"
            >
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <img
                  src={conv.photo ? Url + conv.photo : placeholderimg}
                  alt={conv.name || 'Usuário'}
                  className="avatar"
                />
                {conv.unread_count > 0 && (
                  <span style={styles.badge}>
                    {conv.unread_count > 9 ? '9+' : conv.unread_count}
                  </span>
                )}
              </div>
              <div className="conversation-info">
                <strong>{conv.name}</strong>
                   <span className={`online ${conv.online === 'online' ? 'ativo' : ''}`}>
      {conv.online}
      </span>
                <p>{conv.last_message}</p>
                <small>{new Date(conv.last_message_time).toLocaleString('pt-BR')}</small>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <RodapeNavegacao />
    </>
  );
}

const styles = {
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ff3d00',
    color: '#fff',
    borderRadius: '999px',
    padding: '2px 6px',
    fontSize: '11px',
    fontWeight: 'bold',
    minWidth: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 4px rgba(0,0,0,0.3)',
  },
};

