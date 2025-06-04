import React, { useEffect, useState, useContext, useRef, useCallback } from 'react';
import '../styles/Notificacoes.css';
import { UserContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import RodapeNavegacao from '../components/RodapeNavegacao';
import userImg from '../assets/user_male.jpg';
import PageLoading from '../components/PageLoading'
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Notificacoes() {
  const { userData } = useContext(UserContext);
  const [notificacoes, setNotificacoes] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observer = useRef();
  const navigate = useNavigate();

  const fetchNotificacoes = async (pageNumber = 1) => {
    setLoading(true);



    try {
      const response = await fetch('https://t1emprego.com/api/get_notifications_info.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userData.userid, page: pageNumber }),
      });

      const data = await response.json();

      if (data.length === 0) {
        setHasMore(false);
      } else {
        
     const adaptadas = data.map((item) => {
          let tipo = 'solicitar'; // default
          if (item.mensagem.includes('recomendou')) {
            tipo = 'recomendar';
          } else if (item.mensagem.includes('mensagem')) {
            tipo = 'enviou_sms'; // <-- Adicionado aqui
          }

          return {
            notification: {
              notification_id: item.id,
              notification_type: tipo,
              is_seen: item.lida,
              created_at: item.data,
            },
            sender: item.remetente,
          };
        });


        setNotificacoes((prev) => [...prev, ...adaptadas]);
      }
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNovasNotificacoes = async () => {
    try {
      const response = await fetch('https://t1emprego.com/api/get_notifications_info.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userData.userid, page: 1 }),
      });

      const data = await response.json();
     
      const novasAdaptadas = data.map((item) => ({
        notification: {
          notification_id: item.id,
          notification_type: item.mensagem.includes('recomendou') ? 'recomendar' : 'solicitar',
          is_seen: item.lida,
          created_at: item.data,
        },
        sender: item.remetente,
      }));
    
      setNotificacoes((prev) => {
        const idsExistentes = new Set(prev.map((n) => n.notification.notification_id));
        const novas = novasAdaptadas.filter((n) => !idsExistentes.has(n.notification.notification_id));
        return [...novas, ...prev];
      });
    } catch (err) {
      console.error('Erro ao verificar novas notificações:', err);
    }
  };

  useEffect(() => {
   
      fetchNotificacoes(page);

        
  }, [userData, page]);

  useEffect(() => {


    if (!userData?.userid) return;

    const intervalo = setInterval(() => {
      fetchNovasNotificacoes();
    }, 10000); // 10 segundos

    return () => clearInterval(intervalo);
  }, [userData]);

  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const marcarComoLida = async (notificationId, userid,notification_type) => {



    try {
      const response = await fetch('https://t1emprego.com/api/marcar_lida.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId, userid: userData.userid }),
      });
      const data = await response.json();
      //console.log(data);
  

      if (data.status === 'ok') {

      if(notification_type === "enviou_sms"){
          navigate('/conversas');
        }

        if(notification_type === "recomendar")
        {
          navigate(`/perfil/${userid}`);
        }
        if(notification_type === "solicitar")
        {
          navigate(`/perfil/${userid}`);
        }

      }
      setNotificacoes((prev) =>
        prev.map((n) =>
          n.notification.notification_id === notificationId
            ? {
                ...n,
                notification: {
                  ...n.notification,
                  is_seen: 1,
                },
              }
            : n
        )
      );
    } catch (err) {
      console.error('Erro ao marcar como lida:', err);
    }
  };

  const renderMensagem = (tipo, username) => {
    switch (tipo) {
      case 'recomendar':
        return `${username} recomendou você.`;
      case 'solicitar':
        return `${username} solicitou seus serviços.`;
        case 'enviou_sms':
          return `${username} enviou uma mensagem para você.`;
      default:
        return `${username} enviou uma notificação.`;
    }
  };

  // calcular quanto tyempo passou 
  function tempoDecorrido(dataString) {
    if (!dataString) return '';
    const data = new Date(dataString.replace(' ', 'T'));
    if (isNaN(data)) return 'Data inválida';
    return formatDistanceToNow(data, { addSuffix: true, locale: ptBR });
  }
  if(!userData){
    return <><PageLoading/></>
  }

  return (
    <div className="notificacoes-container">
      <Header />

      <h2>Notificações recebidas</h2>
      <ul className="notificacao-lista">
        {notificacoes.map((n, i) => {
          const { notification, sender } = n;
          const isLast = i === notificacoes.length - 1;
          return (
            <li
              key={notification.id}
              ref={isLast ? lastElementRef : null}
              className={`notificacao-item ${notification.is_seen ? 'lida' : 'nao-lida'}`}
              onClick={() => marcarComoLida(notification.notification_id, sender.userid,notification.notification_type)}
            >
             <img
          src={sender.profile_image
            ? `https://t1emprego.com/${sender.profile_image}`
            : userImg}
          alt="Avatar"
          className="notificacao-avatar"
        />

              <div className="notificacao-conteudo">
                <p className="notificacao-msg">
                  {renderMensagem(notification.notification_type, sender.username)}
                </p>
                <small className="notificacao-data">{tempoDecorrido(notification.created_at)}</small>
              </div>
            </li>
          );
        })}
      </ul>
      {loading && <p className="loading">Carregando...</p>}
      <RodapeNavegacao />
    </div>
  );
}
