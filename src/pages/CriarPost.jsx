import React, { useEffect, useState, useRef } from 'react';
import '../styles/CriarPost.css';
import ModalFeedback from '../components/ModalFeedback';
import Header from '../components/Header';
import RodapeNavegacao from '../components/RodapeNavegacao';
import { useNavigate } from 'react-router-dom';
const CriarPost = () => {
  const [userLocal, setUserLocal] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagens, setImagens] = useState([]);
  const [arquivos, setArquivos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [loading, setLoading] = useState(false);
const navegar = useNavigate()
  const urlsCriadas = useRef([]);

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

    return () => {
      urlsCriadas.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const selecionarImagens = (e) => {
    const novosArquivos = Array.from(e.target.files);
    const total = arquivos.length + novosArquivos.length;

    if (total > 4) {
      setModalMessage("Você só pode selecionar até 4 imagens.");
      setModalOpen(true)
      return;
    }

    const novasURLs = novosArquivos.map((file) => {
      const url = URL.createObjectURL(file);
      urlsCriadas.current.push(url);
      return url;
    });

    setImagens((prev) => [...prev, ...novasURLs]);
    setArquivos((prev) => [...prev, ...novosArquivos]);
  };

  const removerImagem = (index) => {
    URL.revokeObjectURL(imagens[index]); // libera a memória
    setImagens((prev) => prev.filter((_, i) => i !== index));
    setArquivos((prev) => prev.filter((_, i) => i !== index));
    urlsCriadas.current.splice(index, 1);
  };

  const publicar = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descricao', descricao);
    formData.append('userid', userLocal.userid);

    arquivos.forEach((file) => {
      formData.append('imagens[]', file);
    });

    try {
      const response = await fetch('https://t1emprego.com/api/criar_post.php', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
     // console.log(data)
      if (data.success) {
        setModalMessage(data.message);
        setModalOpen(true);
        setTitulo('');
        setDescricao('');
        setImagens([]);
        setArquivos([]);
        urlsCriadas.current.forEach((url) => URL.revokeObjectURL(url));
        urlsCriadas.current = [];
        navegar(`/Fotos/${userLocal.userid}`)
      } else {
        setModalMessage('Erro ao criar post.');
        setModalOpen(true);
      }
    } catch (error) {
      console.error(error);
      setModalMessage('Falha na conexão com o servidor.');
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  if (!userLocal) {
    return (
      <>
        <Header />
        <div className="container">
          <p>Carregando a página criar post...</p>
        </div>
      </>
    );
  }

  return (
    <div className="criar-post-container">
      <Header />
      <h2 className="criar-post-title">Adicionar Novo Post</h2>

      <input
        type="text"
        placeholder="Título do post"
        className="criar-post-input"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />

      <textarea
        placeholder="Descrição"
        className="criar-post-textarea"
        rows="4"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
      ></textarea>

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={selecionarImagens}
        className="criar-post-file"
        required
      />

      <div className="criar-post-preview-container">
        {imagens.map((img, index) => (
          <div key={index} className="criar-post-preview-wrapper">
            <img src={img} alt={`preview-${index}`} className="criar-post-preview" />
            <button
              className="criar-post-remove"
              onClick={() => removerImagem(index)}
              title="Remover imagem"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button className="criar-post-button" onClick={publicar}>
        {loading ? <span className="spinner"></span> : 'Publicar'}
      </button>

      <ModalFeedback
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        message={modalMessage}
      />

      <RodapeNavegacao/>
    </div>
  );
};

export default CriarPost;
