import React, { useState } from 'react';
import '../styles/EsqueciSenha.css'; // Importa os estilos externos

export default function EsqueciSenha() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState(null);
  const [statusColor, setStatusColor] = useState(''); // green ou red

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('username', username);

    const res = await fetch('https://t1emprego.com/api/forgot_password.php', {
      method: 'POST',
      body: formData,
    });

    const result = await res.json();
    if (result.success) {
      setStatus('✅ Email de redefinição enviado.');
      setStatusColor('green');
    } else {
      setStatus(result.error || '❌ Erro ao enviar email.');
      setStatusColor('red');
    }
  };

  return (
    <div className='BBSQ'>
           <div className="senha-container">
      <div className="form-box">
        <div className='Something'>
           <h2>Esqueceu a senha?</h2>
        <p>Informe seu e-mail e nome de usuário para receber um link de redefinição.</p>
        </div>

        <input
          type="email"
          name="email"
          placeholder="Seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          name="username"
          placeholder="Seu nome de usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <button onClick={handleSubmit}>Enviar link</button>

        {status && <p className={`status-msg ${statusColor}`}>{status}</p>}
      </div>
    </div>
    </div>
  );
}
