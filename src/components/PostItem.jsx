// ==== PostItem.js ====
import React, { useState } from 'react';
import { FaPhoneAlt, FaRegCommentDots, FaShareAlt, FaFileDownload } from 'react-icons/fa';
import { FiMoreHorizontal } from 'react-icons/fi';
import ModalFeedback from './ModalFeedback';
import '../styles/PostItem.css'
import { useNavigate } from 'react-router-dom';
export default function PostItem({ item }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
const navegar = useNavigate()

  function GotoChat(userid) {
     navegar(`/ChatApp/${userid}`)
  }

  function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
  }

  return (
    <div style={styles.carouselWrapper} className='CarroselWrapper'>
                 
      <div style={styles.horizontalScroll} className='horizontalScroll'>
        {item.map((entry) => (
          <div style={styles.postItemContainer} key={entry.post.id} className='postItemContainer'>
            <div style={styles.container} className='ConatneiPostMon'>
              <div style={styles.header}>
                <div style={styles.headerLeft}>
                  <img
                    src={entry.user.profile_image}
                    alt="avatar"
                    style={styles.avatar}
                   className='Avatar'
                   onClick={()=>{navegar(`/Perfil/${entry.user.userid}`)}}
                  />
                 <div>
                     <div>
                      <span style={styles.username}>{entry.user.name}</span>
                     </div>
                  <span style={styles.username}>{entry.user.profissao}</span>
                 </div>
                </div>
               
              </div>

              <img src={entry.post.img} alt="post" style={styles.image}  className='postItemImg' />

              <div style={styles.actions}>
                <div
                  style={styles.actionButton}
                  onClick={() => {
                    if (isMobileDevice()) {
                      window.location.href = `tel:${entry.user.telefone}`;
                    } else {
                      setModalMessage('Ligações diretas só funcionam em dispositivos móveis.');
                      setModalOpen(true);
                    }
                  }}
                >
                  <FaPhoneAlt size={18} color="#333" />
                  <span style={styles.actionText}>Ligar</span>
                </div>
                <div
                  style={styles.actionButton}
                  onClick={() => {
              
                    GotoChat(entry.user.userid);
                   
                  }}
                >
                  <FaRegCommentDots size={18} color="#333" />
                  <span style={styles.actionText}>Chat</span>
                </div>
                <a href={entry.post.img} download style={{ textDecoration: 'none' }}>
                  <div style={styles.actionButton}>
                    <FaFileDownload size={18} color="#333" />
                    <span style={styles.actionText}>Baixar</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ModalFeedback isOpen={modalOpen} onClose={() => setModalOpen(false)} message={modalMessage} />
    </div>
  );
}

const styles = {
  carouselWrapper: {
    maxWidth: '700px',
    margin: '0 auto',
   
  },
  horizontalScroll: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  postItemContainer: {
    width: '100%',
  },
  container: {
      width: '100%',
    backgroundColor: '#fff',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    transition: 'box-shadow 0.3s ease',
  },
  header: {
    display: 'flex',
    flex:'1',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    width:'100%',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  avatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    objectFit: 'cover',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  username: {
    fontWeight: '600',
    fontSize: '14px',
    color: '#111',
    display: 'inline-block',
    marginRight: '4px',
  },
  image: {
    width: '100%',
    height: 'auto',
    objectFit: 'contain',
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '12px 0',
    borderTop: '1px solid #eee',
  },
  actionButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
  },
  actionText: {
    fontSize: '12px',
    color: '#444',
    marginTop: '4px',
  },
  time: {
    fontSize: '11px',
    color: '#888',
  },
};
