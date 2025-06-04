import React, { useEffect, useState, useContext } from 'react';
import '../styles/Servico.css';
import '../styles/Spinner.css';
import ModalFeedback from './ModalFeedback';
import { UserContext } from '../contexts/UserContext';
import ConfirmDialog from './ConfirmDialog';
const Servico = () => {
  const[userData,setUserData] = useState([])
  const [servicosRecomendos, setServicosRecomendados] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [loadingId, setLoadingId] = useState(null);  
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [servicoSelecionado, setServicoSelecionado] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem('userData');
    const parsed = JSON.parse(storedUser);
    //console.log(parsed)
    if(storedUser){
      
      setUserData(parsed)
    }

    fetch(`https://t1emprego.com/api/getServicosRecomendados.php?userid=${parsed.userid}`)
      .then(res => res.json())
      .then(data => {
        //console.log(data)
        if (Array.isArray(data)) setServicosRecomendados(data);
      })
      .catch(err => console.error('Erro ao buscar serviços:', err));
  }, []);

const handleSolicitar = (servico) => {
    if (loadingId !== null) return;
    setServicoSelecionado(servico);
    setConfirmOpen(true); // abre o modal de confirmação
  };

  const confirmarSolicitacao = () => {
    const servico = servicoSelecionado;
    setConfirmOpen(false);
    setLoadingId(servico.id);

    const payload = {
      userid_from: userData.userid,
      userid_to: servico.userid,
      titulo: servico.titulo,
      preco: servico.preco,
      profissional_name: servico.username,
      username: userData.username,
      profissional_email: servico.email,
    };

    fetch('https://t1emprego.com/api/enviarSolicitacao.php', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(response => {
        setModalMessage(response || 'Erro ao enviar solicitação.');
        setModalOpen(true);
      })
      .catch(err => {
        console.error('Erro ao enviar solicitação:', err);
        setModalMessage('Erro ao enviar solicitação.');
        setModalOpen(true);
      })
      .finally(() => {
        setLoadingId(null);
      });
  };


  return (
    <div className="servico-container">
      {servicosRecomendos.map((item) => (
        <div className="card" key={item.id}>
          <img src={item.imagem} alt={item.titulo} className="card-image" />
          <div className="card-content">
            <p className="card-desc">{item.username}</p>
            <h3 className="card-title">{item.titulo}</h3>
            <p className="card-desc">{item.desc}</p>
            <p className="card-preco">{item.preco} Kz</p>
            <button
              className="install-button"
              onClick={() => handleSolicitar(item)}
              disabled={loadingId === item.id}
            >
              {loadingId === item.id ? (
                <>
                  Enviando...
                  <span className="spinner" />
                </>
              ) : (
                'Solicitar'
              )}
            </button>
          </div>
        </div>
      ))}

      <ConfirmDialog
        isOpen={confirmOpen}
        onConfirm={confirmarSolicitacao}
        onCancel={() => setConfirmOpen(false)}
        message="Tem certeza que quer solicitar?"
      />

      <ModalFeedback
      isOpen={modalOpen}
      onClose={() => setModalOpen(false)}
      message={modalMessage}
     
      />
    </div>
  );
};

export default Servico;
