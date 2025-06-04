import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Header.css';
import styles from './Header1.module.css';
import userImg from '../assets/user_male.jpg';
import logo from '../assets/logo.jpg';
import { Bell } from 'lucide-react';
import { UserContext } from '../contexts/UserContext';

const categories = ['Hoje', 'Feed', 'Prestadores de serviços', 'Serviços'];
const primaryColor = '#4285F4';

export default function Header({ isPerfil = false }) {
  const[userData,setUserData] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [activeCategory, setActiveCategory] = useState('Hoje');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    switch (location.pathname) {
      case '/Feed':
        setActiveCategory('Feed');
        break;
      case '/Home':
      case '/':
        setActiveCategory('Hoje');
        break;
      case '/PrestadorServico':
        setActiveCategory('Prestadores de serviços');
        break;
      case '/Buscar':
        setActiveCategory('Serviços');
        break;
      default:
        break;
    }
  }, [location.pathname]);

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
    if (cat === 'Feed') navigate('/Feed');
    if (cat === 'Hoje') navigate('/');
    if (cat === 'Serviços') navigate('/Buscar');
    if (cat === 'Prestadores de serviços') navigate('/PrestadorServico');
  };

    // user logado 
      useEffect(() => {
        const storedUser = localStorage.getItem('userData');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          //console.log(parsed);
          setUserData(parsed); // opcional se não estiver usando context

          // ✅ busca o perfil
async function fetchProfile() {
try {
const res = await fetch('https://t1emprego.com/api/getUserData.php', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
},
body: JSON.stringify({ userid: parsed.userid}),
});

const data = await res.json();
//console.log(data)

if (data.error) {
console.error(data.error);
} else {
  // atualizando ddos do usuario 
  setUserData(data)


}

} catch (err) {
console.error('Erro ao carregar o perfil:', err);
}
}

fetchProfile(); // ✅ chamada movida para dentro do try
        }
        
      }, []);

  // Atualiza notificações inicialmente e a cada 30s
  useEffect(() => {
    let intervalId;

    const fetchNotificacoes = async () => {
      if (!userData?.userid) return;

      try {
        const response = await fetch('https://t1emprego.com/api/get_notifications_nao_lida.php', {

          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: userData.userid })
        });

        const data = await response.json();
        //console.log('Notificações recebidas:', data);

        // Se backend retorna diretamente número: ex: 4
        if (typeof data === 'number') {
          setNotificationCount(data);
        }
        // Se backend retorna objeto com chave
        else if (data?.nao_lidas !== undefined) {
          setNotificationCount(data.nao_lidas);
        } else {
          setNotificationCount(0);
        }

      } catch (error) {
        console.error('Erro ao buscar notificações:', error);
      }
    };

    fetchNotificacoes(); // busca inicial

    intervalId = setInterval(() => {
      fetchNotificacoes();
    }, 30000); // 30 segundos

    return () => clearInterval(intervalId);
  }, [userData]);

  if (!userData) {
    return (
      <div className="container">
        <p>Usuario Não autenticado</p>
      </div>
    );
  }

  return (
    <div className="header-container">
      <div className="header">
        <div className="leftSection" onClick={()=>{navigate('/Home')}}>
          <img src={logo} alt="Logo" className="logotipo" />
          <div className="logoText">T1emprego</div>
        </div>

        <div className="rightSection">
          <div className="notification-icon" onClick={() => navigate('/Notificacoes')}>
            <Bell size={24} className="bell" color='#4285F4' />
            {notificationCount > 0 && (
              <span className="notification-count">{notificationCount}</span>
            )}
          </div>

        <img
          src={userData.profile_image ? `http://t1emprego.com/${userData.profile_image}` : userImg}
          alt="User"
          className="profile-pic"
          onClick={() => navigate('/Perfil')}
        />

        </div>
      </div>

      {!isPerfil && (
        <div className="tabs-container">
          {categories.map((cat) => (
            <div key={cat} className="tab-button" onClick={() => handleCategoryClick(cat)}>
              <span className={`tab-text ${activeCategory === cat ? 'active' : ''}`}>
                {cat}
              </span>
              {activeCategory === cat && <div className="active-indicator" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
