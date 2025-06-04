import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderLogin from '../components/HeaderLogin';
import '../styles/login.css';
import { Eye, EyeOff } from 'lucide-react';
import { PlusCircle } from 'lucide-react';
import ModalFeedback from '../components/ModalFeedback';
export default function Login() {
  const [opacity, setOpacity] = useState(0);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();
const [mostrarSenha, setMostrarSenha] = useState(false);

  // Redireciona se já estiver logado
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    /*if (isLoggedIn === 'true') {
      navigate('/Home');
    }*/
  }, [navigate]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setOpacity(1);
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  const RegisterScreen = () => {
    navigate('/register');
  };

  const IniciarSessao = async () => {
      setLoading(true); // Inicia spinner
    const formData = new FormData();
    formData.append('doLogin', 1);
    formData.append('array[username]', username);
    formData.append('array[password]', password);

    try {
      const response = await fetch('https://t1emprego.com/api/register.php', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
       
      if (result.usuario != null) {
        //console.log(result.usuario)
        // Armazena login
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userData', JSON.stringify(result.usuario));

        navigate('/Home');
      } else {
        const mensagem = result.erro || 'Usuário ou senha inválidos';
          setModalMessage(mensagem);
          setModalOpen(true);
      
      }
    } catch (error) {
      console.error('Erro ao tentar fazer login:', error);
     
      setModalMessage('Erro de conexão com o servidor')
      setModalOpen(true)
    }
    finally {
    setLoading(false); // Finaliza spinner
  }
  
  };

  const width = window.innerWidth;

  return (
    <div className="container">
      <HeaderLogin isLogin={true} />

      <div
        className="animated-view"
        style={{
          opacity,
          width: '100%',
          transition: 'opacity 0.8s ease',
        }}
      >
        <div className={width > 768 ? 'desktopWrapper' : ''}>
          <div className={width > 768 ? 'textBox' : ''}>
            <div className="Containertitle">
              <h1 className="title">T1emprego</h1>
              <p className="subtitle">
                Permite você, prestador de serviço a ter um perfil profissional e avaliado pelos clientes!
              </p>
              <p className="subtitle">
                Permite qualquer entidade buscar por prestador de serviço profissional, baseando-se nos comentários e avaliações dos clientes!
              </p>
            </div>
          </div>

          <input
            className="input"
            placeholder="Nome de usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <div className="input-password-wrapper">
  <input
    className="input"
    type={mostrarSenha ? "text" : "password"}
    placeholder="Palavra passe"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />
  <span
    className="toggle-password"
    onClick={() => setMostrarSenha(!mostrarSenha)}
  >
    {mostrarSenha ? (
      <EyeOff size={20} color="#888" />
    ) : (
      <Eye size={20} color="#888" />
    )}
  </span>
</div>


          <button className="button" onClick={IniciarSessao} disabled={loading}>
             {loading ? (
            <span className="spinner"></span>
          ) : (
            '  Iniciar sessão '
          )}
          
          </button>

          <button className="forgot" onClick={()=>{navigate("/EsqueciSenha")}}>Esqueceu a palavra passe?</button>

          <button className="createAccount" onClick={RegisterScreen}>
            <span className="plus"><PlusCircle size={23} color='white' /></span>
            <span className="createText">Criar nova conta no T1emprego</span>
          </button>
        </div>
      </div>

      <ModalFeedback
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                message={modalMessage}
              />
    </div>
  );
}
