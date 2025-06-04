import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/register.css';
import HeaderLogin from '../components/HeaderLogin';
import PrimaryBtn from '../components/PrimaryBtn';
import ModalFeedback from '../components/ModalFeedback';

export default function Register() {
  const [gender, setGender] = useState('Masculino');
  const [tipo_conta, setTipo_conta] = useState('Prestador');
  const [username, setUsername] = useState('');
  const [usernumber, setUsernumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const confirmarEnvio = () => {
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setModalMessage('As senhas não coincidem!');
      setModalOpen(true);
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('AddUser', 1);
    formData.append('username', username);
    formData.append('usernumber', usernumber);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('password2', confirmPassword);
    formData.append('gender', gender);
    formData.append('tipo_conta', tipo_conta);

    try {
      const response = await fetch('https://t1emprego.com/api/register.php', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.ok === 'criado') {
        navigate('/login');
      } else {
        let mensagem = '';
        for (const key in result) {
          if (result[key]) {
            mensagem += result[key] + '\n';
          }
        }
        setModalMessage(mensagem);
        setModalOpen(true);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      setModalMessage('Erro de conexão com o servidor');
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <HeaderLogin isLogin={false} />
      <div className="header-login">
        <h1 className="title">T1emprego</h1>
        <p className="subtitle">
          Permite você, prestador de serviço a ter um perfil profissional e avaliado pelos clientes!
        </p>
        <p className="subtitle">
          Permite qualquer entidade buscar por prestador de serviço profissional, baseando-se nos comentários e avaliações dos clientes!
        </p>
      </div>

      <form className="register-form">
        <input
          className="input"
          type="text"
          placeholder="Nome de usuário"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="input"
          type="email"
          placeholder="Digite o teu email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="input"
          type="tel"
          placeholder="Número de telefone"
          required
          value={usernumber}
          onChange={(e) => setUsernumber(e.target.value)}
        />

        <div className="input-password-container">
          <input
            className="input"
            type={showPassword ? 'text' : 'password'}
            placeholder="Palavra passe"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="show-password-btn"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? '🙈' : '👁'}
          </button>
        </div>

        <div className="input-password-container">
          <input
            className="input"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirmar palavra passe"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            type="button"
            className="show-password-btn"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? '🙈' : '👁'}
          </button>
        </div>

        <label className="label">Gênero</label>
        <div className="radio-group">
          {['M', 'F'].map((item) => (
            <label key={item} className="radio-option">
              <input
                type="radio"
                name="gender"
                value={item}
                checked={gender === item}
                onChange={() => setGender(item)}
              />
              <span className="radio-label">{item}</span>
            </label>
          ))}
        </div>

        <label className="label">Tipo de conta [P] Prestador de serviço, [c] Cliente</label>
        <div className="radio-group">
          {['P', 'C'].map((item) => (
            <label key={item} className="radio-option">
              <input
                type="radio"
                name="tipo_conta"
                value={item}
                checked={tipo_conta === item}
                onChange={() => setTipo_conta(item)}
              />
              <span className="radio-label">Conta de {item.toLowerCase()}</span>
            </label>
          ))}
        </div>

        <center>
          <p className="terms">
            Ao clicar em criar conta, você concorda com os nossos termos e política de dados.
          </p>

          <PrimaryBtn onClick={confirmarEnvio}>Criar Conta</PrimaryBtn>
        </center>
      </form>

      <div style={{ marginTop: '20px' }}>
        <button className="haveAccount" onClick={() => navigate('/Login')}>
          Já tem uma conta? Iniciar sessão
        </button>
      </div>

      {showModal && (
        <div className="modal-overlayR">
          <div className="modal-contentR">
            <h3 style={{ marginBottom: '1rem' }}>Confirmação</h3>
            <p>
              O teu <strong>email: {email}</strong> e <strong>nome de usuário: {username}</strong> são muito importantes.<br />
              Usamos o teu <b>email: {email}</b> para notificações e confirmação de conta, então certifica que está bem escrito;  e o nome de usuário será usado para login no <strong>T1emprego</strong>.<br /><br />
            </p>
            <div className="modal-buttons">
              <button className="cancel" onClick={() => setShowModal(false)}>Cancelar</button>
              <button type="submit" className=" confirm" disabled={loading} onClick={handleSubmit}>
                {loading ? (
                  <span className="spinner"></span>
                ) : (
                  'Criar Conta'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <ModalFeedback
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        message={modalMessage}
      />
    </div>
  );
}
