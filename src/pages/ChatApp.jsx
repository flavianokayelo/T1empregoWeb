import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import '../styles/chatApp.css';
import RodapeNavegacao from '../components/RodapeNavegacao';
import EmojiPicker from 'emoji-picker-react';
import placeholderimg from '../assets/placeholder-image.jpg';
const Url = "https://t1emprego.com/"
export default function ChatApp() {
  const { userid } = useParams();
  const [userLocal, setUserLocal] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [typingStatus, setTypingStatus] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [theme, setTheme] = useState('light');
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const lastMessageIdRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const firstLoadRef = useRef(true);

  const [unreadCount, setUnreadCount] = useState(0);


  const MESSAGES_LIMIT = 20;

  const playNotificationSound = () => {
    const audio = new Audio('/sounds/message.mp3');
    audio.play();
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      setUserLocal(JSON.parse(storedUser));
    }
  }, []);

  // marar como lida 
  const markAsRead = async () => {
  await fetch('https://t1emprego.com/api/mark_Message_as_read.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sender_id: userid,
      receiver_id: userLocal.userid,
    }),
  });
};


  const fetchMessages = async (loadMore = false) => {
    // marcar todas noticao como lidas
    markAsRead()
    
    if (!userLocal) return;
    if (loadingOlder) return;

    setLoadingOlder(loadMore);

    try {
      const res = await fetch(
        `https://t1emprego.com/api/get_messages.php?sender_id=${userLocal.userid}&receiver_id=${userid}&offset=${loadMore ? offset : 0}&limit=${MESSAGES_LIMIT}`
      );
      const data = await res.json();
      if (Array.isArray(data)) {
        if (loadMore) {
          if (data.length < MESSAGES_LIMIT) setHasMore(false);
          setMessages((prev) => [...data.reverse(), ...prev]);
          setOffset((prev) => prev + data.length);
        } else {
          setMessages(data.reverse());
          setOffset(data.length);
          setHasMore(data.length === MESSAGES_LIMIT);
        }


        // verificar se tem mensagem que ainda nao foi lida 
        if (!loadMore && data.length > 0) {
          const receivedUnread = data.filter(
            (msg) => msg.sender_id === userid && !msg.seen
          ).length;
          setUnreadCount(receivedUnread);
        }


        if (!loadMore && data.length > 0) {
          const newest = data[data.length - 1];
          const newestId = newest.id;

          if ( !firstLoadRef.current &&
            lastMessageIdRef.current &&
            newestId !== lastMessageIdRef.current &&
            newest.sender_id !== userLocal.userid

) {

         playNotificationSound();
  toast.info(`Nova mensagem de ${newest.sender_name || 'Contato'}`, {
    position: 'bottom-right',
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'light',
            });
          }

          lastMessageIdRef.current = newestId;
          firstLoadRef.current = false;
        }
      }
    } catch (error) {
      console.error('Erro ao buscar mensagens', error);
    }

    setLoadingOlder(false);
  };

  const sendMessage = async () => {
    if (!message.trim() || !userLocal) return;

    try {
      const res = await fetch('https://t1emprego.com/api/send_message.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_id: userLocal.userid,
          receiver_id: userid,
          message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage('');
        fetchMessages();
      } else {
        console.error('Erro ao enviar mensagem:', data.error);
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  const sendTypingStatus = (isTyping) => {
    if (!userLocal) return;

    fetch('https://t1emprego.com/api/typing_status.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender_id: userLocal.userid,
        receiver_id: userid,
        is_typing: isTyping ? 1 : 0,
      }),
    }).catch(console.error);
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    sendTypingStatus(true);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      sendTypingStatus(false);
    }, 1000);
  };

  const fetchTypingStatus = async () => {
    if (!userLocal) return;

    try {
      const res = await fetch(
        `https://t1emprego.com/api/get_typing_status.php?sender_id=${userid}&receiver_id=${userLocal.userid}`
      );
      const data = await res.json();
      setTypingStatus(data.is_typing);
    } catch (error) {
      console.error('Erro ao buscar status digitando:', error);
    }
  };

  useEffect(() => {
    if (!userLocal) return;
    fetchTypingStatus();
    const typingInterval = setInterval(fetchTypingStatus, 3000);
    return () => clearInterval(typingInterval);
  }, [userLocal]);

  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    if (messagesContainerRef.current.scrollTop === 0 && hasMore && !loadingOlder) {
      fetchMessages(true);
    }
  };

  useEffect(() => {
    if (!loadingOlder) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loadingOlder]);

  useEffect(() => {
    if (userLocal) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [userLocal]);

  const onEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  return (
    <>
      <Header />
      <div className={`chat-container ${theme}`}>
        <div className="chat-box">
          <div
            className="messages"
            onScroll={handleScroll}
            ref={messagesContainerRef}
            style={{ overflowY: 'auto', height: '400px' }}
          >
            {loadingOlder && <div className="loading">Carregando mensagens antigas...</div>}
            {messages.map((msg) => (
              <div
  key={msg.id}
  className={`message ${msg.sender_id === userLocal.userid ? 'sent' : 'received'}`}
>
  {msg.sender_id !== userLocal.userid ? (
    <Link to={`/perfil/${msg.sender_id}`} className="profile-link">
      <img
        src={msg.sender_photo ? Url + msg.sender_photo : placeholderimg}
        alt={msg.sender_name || 'Usuário'}
        className="avatar"
      />
    </Link>
  ) : (
    <img
      src={msg.sender_photo ? Url + msg.sender_photo : placeholderimg}
      alt={msg.sender_name || 'Usuário'}
      className="avatar"
    />
  )}

  <div className="message-content">
    {msg.sender_id !== userLocal.userid ? (
      <Link to={`/perfil/${msg.sender_id}`} className="profile-link">
        <div className="sender-name">{msg.sender_name || 'Usuário'}</div>
      </Link>
    ) : (
      <div className="sender-name">{msg.sender_name || 'Você'}</div>
    )}
    <div>{msg.message}</div>
  </div>
  <div className="message-time">
    {new Date(msg.created_at).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    })}
  </div>
</div>

            ))}
            <div ref={messagesEndRef} />
          </div>

          {typingStatus && <div className="typing-status">Contato está digitando...</div>}

          <div className="input-area">
            <button
              className="emoji-toggle"
              onClick={() => setShowEmojiPicker((prev) => !prev)}
              title="Emoji"
            >😀</button>
            {showEmojiPicker && (
              <div className="emoji-picker">
                <EmojiPicker onEmojiClick={onEmojiClick} theme={theme} />
              </div>
            )}
            <input
              type="text"
              placeholder="Digite sua mensagem..."
              value={message}
              onChange={handleTyping}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage}>Enviar</button>
           
          </div>
        </div>
        <ToastContainer />
      </div>
    
    </>
  );
}
