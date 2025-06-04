import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaSearch, FaPlusCircle, FaUser, FaCog, FaFacebookMessenger } from 'react-icons/fa';
import { UserContext } from '../contexts/UserContext';

const primaryColor = '#4285F4';

const RodapeNavegacao = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [modalVisible, setModalVisible] = useState(false);
  const { userData } = useContext(UserContext);
  const [notificationCount, setNotificationCount] = useState(0);

  // Busca notificações não lidas igual ao Header
  useEffect(() => {
    if (!userData?.userid) return;

    const fetchNotificacoes = async () => {
      try {
        const response = await fetch('https://t1emprego.com/api/get_notifications_nao_lidaSMS.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: userData.userid }),
        });

        const data = await response.json();

        if (typeof data === 'number') {
          setNotificationCount(data);
        } else if (data?.nao_lidas !== undefined) {
          setNotificationCount(data.nao_lidas);
        } else {
          setNotificationCount(0);
        }
      } catch (error) {
        console.error('Erro ao buscar notificações no rodape:', error);
      }
    };

    fetchNotificacoes();

    const intervalId = setInterval(() => {
      fetchNotificacoes();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [userData]);

  const tabs = [
    { name: 'Home', icon: <FaHome size={22} color={primaryColor} />, route: '/' },
    { name: 'Buscar', icon: <FaSearch size={22} color={primaryColor} />, route: '/Buscar' },
  ];

  if (location.pathname !== '/conversas') {
    tabs.push({
      name: 'conversas',
      icon: (
        <div style={{ position: 'relative' }}>
          <FaFacebookMessenger size={22} color={primaryColor} />
          {notificationCount > 0 && (
            <span style={styles.badge}>
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </div>
      ),
      route: '/conversas',
    });
  }

  const showCriar = location.pathname === '/conversas' && userData?.userid && userData.tipo_conta === 'P';
  const showSettings = location.pathname === '/Perfil' && userData?.userid;

  if (showSettings) {
    tabs.push({ name: 'Settings', icon: <FaCog size={22} color={primaryColor} />, route: '/Settings' });
  }

  const handlePress = (tab) => {
    if (tab.name === 'Criar') {
      setModalVisible(true);
    } else {
      navigate(tab.route);
    }
  };

  return (
    <>
      <div style={styles.container}>
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.route;
          return (
            <div
              key={tab.name}
              onClick={() => handlePress(tab)}
              style={styles.tab}
            >
              {tab.icon}
              <span style={{ ...styles.label, ...(isActive ? { color: primaryColor } : {}) }}>
                {tab.name}
              </span>
            </div>
          );
        })}
      </div>

      {showCriar && (
        <div style={styles.centerTabWrapper} onClick={() => handlePress({ name: 'Criar' })}>
          <div style={styles.centerTab}>
            <FaPlusCircle size={28} />
          </div>
        </div>
      )}

      {modalVisible && (
        <div style={styles.modalOverlay} onClick={() => setModalVisible(false)}>
          <div style={styles.modalContainer} onClick={(e) => e.stopPropagation()} className='modal-contentFBB'>
            <h3 style={styles.modalTitle}>Adicionar</h3>

            <div className='BtnModal'
              style={styles.modalButton}
              onClick={() => {
                setModalVisible(false);
                navigate('/CriarPost');
              }}
            >
              <FaHome size={20} color="#fff" />
              <span style={styles.modalButtonText}>Novo Post</span>
            </div>

            <div
              className='BtnModal'
              style={styles.modalButton}
              onClick={() => {
                setModalVisible(false);
                navigate('/CriarServico');
              }}
            >
              <FaHome size={20} color="#fff" />
              <span style={styles.modalButtonText}>Novo Serviço</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RodapeNavegacao;

const styles = {
  container: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTop: '1px solid #e5e5e5',
    padding: '10px 0',
    backgroundColor: '#fff',
    boxShadow: '0 -4px 10px rgba(0,0,0,0.1)',
    zIndex: 999,
  },

  tab: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    color: '#666',
    transition: 'all 0.2s ease-in-out',
  },

  centerTabWrapper: {
    position: 'fixed',
    bottom: '25px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1000,
  },

  centerTab: {
    backgroundColor: primaryColor,
    borderRadius: '50%',
    padding: '14px',
    boxShadow: '0 6px 20px rgba(66, 133, 244, 0.5)',
    color: '#fff',
    transform: 'scale(1.2)',
    transition: 'all 0.3s ease-in-out',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  label: {
    fontSize: '11px',
    marginTop: '4px',
    fontWeight: '500',
    color: '#444',
  },

  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },

  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: '20px',
    padding: '24px',
    width: '90%',
    maxWidth: '400px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    textAlign: 'center',
  },

  modalTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '20px',
    color: '#222',
  },

  modalButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: primaryColor,
    padding: '14px',
    borderRadius: '12px',
    marginBottom: '14px',
    cursor: 'pointer',
    justifyContent: 'center',
    boxShadow: '0 3px 6px rgba(0,0,0,0.15)',
    transition: 'transform 0.2s',
  },

  modalButtonText: {
    color: '#fff',
    fontSize: '16px',
    marginLeft: '10px',
    fontWeight: '500',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: 'red',
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    padding: '2px 6px',
    borderRadius: 12,
    minWidth: 18,
    textAlign: 'center',
    lineHeight: '12px',
  },
};
