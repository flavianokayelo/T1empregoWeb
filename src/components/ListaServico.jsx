import React, { useState, useEffect } from 'react';
import '../styles/Servico.css';
import '../styles/Spinner.css';
import ModalFeedback from './ModalFeedback';
import { useNavigate } from 'react-router-dom';
import placeholderimg from '../assets/placeholder-image.jpg';

const Url = "https://t1emprego.com";

const ListaServico = ({ item, userid = null, onDelete }) => {
  const [userData, setUserData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imagemModalAberto, setImagemModalAberto] = useState(false);
  const [imagemSelecionada, setImagemSelecionada] = useState(null);
  const [editarModalAberto, setEditarModalAberto] = useState(false);
const [novoTitulo, setNovoTitulo] = useState(item.titulo);
const [novaDescricao, setNovaDescricao] = useState(item.desc);
const [novoPreco, setNovoPreco] = useState(item.preco);
const [servicoData, setServicoData] = useState(item);


  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);

        async function fetchProfile() {
          try {
            const res = await fetch(`${Url}/api/user_profile.php`, {
              method: 'POST',
              body: JSON.stringify({ userid: parsed.userid, tipo_conta: parsed.tipo_conta }),
            });

            const data = await res.json();
            if (data.error) {
              console.error(data.error);
            } else {
              setUserData(data);
            }
          } catch (err) {
            console.error('Erro ao carregar o perfil:', err);
          }
        }

        fetchProfile();
      } catch (err) {
        console.error("Erro ao parsear userData:", err);
      }
    }
  }, []);

  const handleSolicitarConfirm = () => {
    setModalMessage(`Tem certeza que deseja solicitar esse servico? ${item.username} tem bons comentários no perfil? o T1emprego aconcelha visitar o perfil do prestador antes de solicitar um servico`);
    setModalOpen(true);
  };

  const handleSolicitar = () => {
    if (isLoading) return;

    setIsLoading(true);

    const payload = {
      userid_from: userData.userid,
      userid_to: item.userid,
      titulo: item.titulo,
      preco: item.preco,
      profissional_name: item.username,
      username: userData.username,
      profissional_email: item.email,
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
        setIsLoading(false);
      });
  };

// fucnao edityar servico 

const handleEditarServico = async () => {
  if (!novoTitulo || !novaDescricao || !novoPreco) {
    setModalMessage("Todos os campos são obrigatórios.");
    setModalOpen(true);
    return;
  }

  setIsLoading(true);

  const payload = {
     userid: userData.userid,
    servico_id: item.id,
    titulo: novoTitulo,
    desc: novaDescricao,
    preco: novoPreco
  };

  try {
    const response = await fetch(`${Url}/api/editar_servico.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
   
    if (result.success) {
 
        setServicoData(prev => ({
        ...prev,
        titulo: novoTitulo,
        desc: novaDescricao,
        preco: novoPreco
      }));

      setEditarModalAberto(false);

      console.log("Editando com os valores:", {
  titulo: novoTitulo,
  desc: novaDescricao,
  preco: novoPreco,
  userid: userData.userid,
  servico_id: item.id
});

    } else {
      
    }
  } catch (error) {
    console.error("Erro ao atualizar serviço:", error);
    setModalMessage("Erro ao atualizar serviço.");
  } finally {
    setIsLoading(false);
    
  }
};



// funcao apagar servico 
  const handleDeletar = async () => {
      
    if (!userData || !item.id) {
      setModalMessage('Informações insuficientes para deletar.');
      setModalOpen(true);
      return;
    }

    setIsLoading(true);

    const payload = {
      userid: userData.userid,
      servico_id: item.id,
    };

    try {
      const response = await fetch('https://t1emprego.com/api/deletar_servico.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response) {
        setModalMessage(result.message || 'Serviço deletado com sucesso.');
        if (onDelete) onDelete(item.id);
      } else {
        setModalMessage(result.message || 'Erro ao deletar o serviço.');
      }

    } catch (error) {
      console.error('Erro ao deletar serviço:', error);
      setModalMessage('Erro ao deletar o serviço.');
    } finally {
      setModalOpen(true);
      setIsLoading(false);
    }
  };

  const handleImagemClick = () => {
    const imagem = item.imagem && item.imagem.trim() !== '' ? item.imagem : placeholderimg;
    setImagemSelecionada(imagem);
    setImagemModalAberto(true);
  };

  return (
    <>
      <div className="card">
        <img
          src={item.imagem && item.imagem.trim() !== '' ? item.imagem : placeholderimg}
          alt={item.titulo}
          className="card-image"
          onClick={handleImagemClick}
        />
        <div className="card-content">
          <p className="card-desc cardName" onClick={() => { navigate(`/Perfil/${item.userid}`) }}>{item.username}</p>
         <h3 className="card-title">{servicoData.titulo}</h3>
          <p className="card-desc">{servicoData.desc}</p>
          <p className="card-preco">{servicoData.preco} Kz</p>


           <div className='ContainerBtn'>
              
          {
            userData.username === item.username && (
              <>
                 <button className="install-button" onClick={() => setEditarModalAberto(true)} disabled={isLoading}>
              Editar
            </button>
            
              <button className="install-button" onClick={handleDeletar} disabled={isLoading}>
                {isLoading ? (
                  <>
                    Enviando...
                    <span className="spinner" />
                  </>
                ) : (
                  'Deletar'
                )}
              </button>

               

              </>
              
            )
          }
           {
            userData.username != item.username &&(
              <>
                   <button className="install-button" onClick={handleSolicitarConfirm} disabled={isLoading}>
            {isLoading ? (
              <>
                Enviando...
                <span className="spinner" />
              </>
            ) : (
              'Solicitar Serviço'
            )}
          </button>
              </>
            )
           }
           </div>
     
        </div>

        <ModalFeedback
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          message={modalMessage}
          listaSer={true}
          onClick={handleSolicitar}
        />
      </div>

     {imagemModalAberto && (
  <div className="modal-overlayF" onClick={() => setImagemModalAberto(false)}>
    <div className="modal-contentF">
      <img
        src={imagemSelecionada}
        alt="Visualização"
      />
    </div>
  </div>
)}

{editarModalAberto && (
  <div className="modal-overlayFEditar">
    <div className="modal-contentFEditar">
      <h3>Editar Serviço</h3>
      <input
        type="text"
        value={novoTitulo}
        onChange={(e) => setNovoTitulo(e.target.value)}
        placeholder="Novo Título"
      />
      <textarea
        value={novaDescricao}
        onChange={(e) => setNovaDescricao(e.target.value)}
        placeholder="Nova Descrição"
        rows={4}
      />
      <input
        type="number"
        value={novoPreco}
        onChange={(e) => setNovoPreco(e.target.value)}
        placeholder="Novo Preço"
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={handleEditarServico} disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar'}
        </button>
        <button onClick={() => setEditarModalAberto(false)}>Cancelar</button>
      </div>
    </div>
  </div>
)}



    </>
  );
};

export default ListaServico;
