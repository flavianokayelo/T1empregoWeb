import React, { useEffect, useState } from 'react';
import RodapeNavegacao from '../components/RodapeNavegacao';
import '../styles/CriarServico.css';
import Header from '../components/Header';
import ModalFeedback from '../components/ModalFeedback';
import { useNavigate } from 'react-router-dom';
import PageLoading from '../components/PageLoading';
const CriarServico = () => {
    const [userLocal, setUserLocal] = useState(null);
    const [userData, setUserData] = useState(null);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [imagemPreview, setImagemPreview] = useState(null);
  const [imagemFile, setImagemFile] = useState(null);
  const [modalMessage, setModalMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
const navegar = useNavigate()
  const selecionarImagem = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagemPreview(URL.createObjectURL(file));
      setImagemFile(file);
    }
  };

  // Carrega dados locais
  useEffect(() => {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUserLocal(parsed);
      } catch (err) {
        console.error("Erro ao parsear userData:", err);
      }
    }
  }, []);


  const publicar = async () => {

    setLoading(true)

  const formData = new FormData();
  formData.append('userid', userLocal.userid);
  formData.append('nome', nome);
  formData.append('descricao', descricao);
  formData.append('preco', preco);
 formData.append('imagem', imagemFile); // <- aqui está a correção


  try {
    const response = await fetch('https://t1emprego.com/api/criar_servico.php', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    //console.log(data);

    if (data.success) {
      setModalMessage("Serviço publicado!")
     setModalOpen(true)
    navegar(`/AllMyServices/${userLocal.userid}`)

    } else {
      setModalMessage("Erro ao publicar: " + data.message)
      setModalOpen(true)
    }
  } catch (error) {
    console.error("Erro:", error);
    setModalMessage("Erro ao conectar com o servidor.");
    setModalOpen(true)
  }
  finally{
    setLoading(false)
  }
};


  // Aguarda os dados serem carregados
  if (!userLocal) {
    return (
      <>
        <PageLoading/>
      </>
    );
  }

  return (
    <>
      <div className="criar-servico-container">
        <Header/>
        <h2 className="criar-servico-title">Adicionar Novo Serviço</h2>

        <input
          type="text"
          placeholder="Nome do serviço"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="criar-servico-input"
        />

        <textarea
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="criar-servico-textarea"
        />

        <input
          type="number"
          placeholder="Preço (Kz)"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
          className="criar-servico-input"
        />

        <label className="criar-servico-upload">
          📷 Selecionar Imagem
          <input type="file" accept="image/*" onChange={selecionarImagem} hidden />
        </label>

        {imagemPreview && (
          <img src={imagemPreview} alt="Preview" className="criar-servico-preview" />
        )}

        <button className="criar-servico-button" onClick={publicar}>
        
           {loading ? (
            <span className="spinner"></span>
          ) : (
            'Publicar'
          )}
        </button>

          <ModalFeedback
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          message={modalMessage}
          />
      </div>

      <RodapeNavegacao />
    </>
  );
};

export default CriarServico;
