import React, { useState, useEffect, useRef } from 'react';
import { FaStar, FaThumbsUp, FaThumbsDown, FaEdit, FaTrash, } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './AvaliacoesPlayStore.css';
import userImg from '../assets/user_male.jpg';
import Modal from './Modal';
import ModalFeedback from './ModalFeedback';

import { formatDistanceToNow } from 'date-fns';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// quando o suario estiver a comentar usa essa foto como fachada
const avatarImg = "user_male.jpg";

const Url = "https://t1emprego.com";
const AvaliacoesPlayStore = ({ username, userId, currentUserId }) => {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [rating, setRating] = useState(0);
  const [comentario, setComentario] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCounts, setRatingCounts] = useState([0, 0, 0, 0, 0]);
  const [showRecomendar, setShowRecomendar] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const navegar = useNavigate()
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);

const observer = useRef();
const listaRef = useRef(null);

//

  const textareaRef = useRef(null);
  //alert(userId)
useEffect(() => {



  async function fetchAvaliacoes() {
    setLoading(true);
    try {
      const res = await fetch(`${Url}/api/get_reviews.php`, {
        method: 'POST',
        body: JSON.stringify({ userid: userId, page }),
      });
      const data = await res.json();
     
        //console.log(data)

      if (Array.isArray(data) && data.length > 0) {
          const totalRatings = data.length;
          const totalScore = data.reduce((sum, a) => sum + a.rating, 0);
          setAverageRating((totalScore / totalRatings).toFixed(1));

          const counts = [0, 0, 0, 0, 0];
          data.forEach(a => counts[a.rating - 1]++);
          setRatingCounts(counts);
        } else {
          setAverageRating(0);
          setRatingCounts([0, 0, 0, 0, 0]);
        }

      if (page === 1) {
        setAvaliacoes(data);
       
      } else {
        setAvaliacoes(prev => [...prev, ...data]);
      }

      if (data.length === 0) {
        setHasMore(false);
      }


    } catch (err) {
      console.error('Erro ao buscar avaliações:', err);
    } finally {
      setLoading(false);
    }
  }

  if (userId) fetchAvaliacoes();
}, [userId, page]);


  const enviarAvaliacao = async () => {
 
    if (rating === 0 || loading || !currentUserId || !userId) {
      setModalMessage("Seleciona pelomenos uma estrela ou digite alguma coisa")
      setModalOpen(true)
      return
    };
    setLoading(true);

    try {
      const res = await fetch(`${Url}/api/post_review.php`, {
        method: 'POST',
        body: JSON.stringify({
          id: editingId || null,
          userid: currentUserId,
          quem: userId,
          rating,
          comentario,
        }),
      });

      const result = await res.json();
      //console.log(result)
      if (result.success) {
        if (editingId) {
          setAvaliacoes(avaliacoes.map((a) =>
            a.id === editingId ? { ...a, rating, comentario } : a
          ));
          setEditingId(null);
        } else {
          const novaAvaliacao = {
            id: result.id,
            userid: currentUserId,
            rating,
            comentario,
            likes: 0,
            dislikes: 0,
            user: {
              id: currentUserId,
              name: currentUserId,
              location: userId,
              avatar: avatarImg,
            },
          };
          setAvaliacoes([novaAvaliacao, ...avaliacoes]);
        }

        setRating(0);
        setComentario('');
        setShowRecomendar(true);
        closeModal();
      } else {
        console.error(result.error);
      }
    } catch (err) {
      console.error('Erro ao enviar avaliação:', err);
    }

    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${Url}/api/delete_review.php`, {
        method: 'POST',
        body: JSON.stringify({
          postid: id,
          userid: currentUserId,
        }),
      });

      const result = await res.json();
      if (result.success) {
        setAvaliacoes(avaliacoes.filter(a => a.id !== id));
        closeModal();
      } else {
        console.error(result.error);
      }
    } catch (err) {
      console.error('Erro ao apagar avaliação:', err);
    }
  };

  const Recomendar = async () => {
    try {
      const res = await fetch(`${Url}/api/post_recommendation.php`, {
        method: 'POST',
        body: JSON.stringify({
          quem: currentUserId,
          para_quem: userId,
        }),
      });

      const result = await res.json();
       //console.log(result)
      if (result.success) {
        setModalMessage('Profissional recomendado com sucesso!')
        setModalOpen(true)
      } else {
       
        setModalMessage('Erro ao recomendar: ' + result.error)
        setModalOpen(true)
      }
    } catch (err) {
      console.error('Erro:', err);
      setModalMessage('Erro ao recomendar')
        setModalOpen(true)
   
    } finally {
      setShowRecomendar(false);
    }
  };

  const openModal = (type, data) => {
    setModalType(type);
    setModalData(data);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType(null);
    setModalData(null);
  };

  const confirmDelete = () => {
    if (modalData?.id) handleDelete(modalData.id);
  };

  const confirmEdit = () => {
    if (!modalData) return;
    setRating(modalData.rating);
    setComentario(modalData.comentario);
    setEditingId(modalData.id);
    closeModal();

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 100);
  };

  // ** Função para dar like ou dislike **
  const handleLikeDislike = async (id, tipo) => {
    if (!currentUserId) return;
    try {
      const res = await fetch(`${Url}/api/like_dislike_review.php`, {
        method: 'POST',
        body: JSON.stringify({
          review_id: id,
          userid: currentUserId,
          action: tipo, // 'like' ou 'dislike'
        }),
      });

      const result = await res.json();
         //console.log(result)
      if (result.success) {
        // Atualiza a lista com os likes e dislikes retornados (supondo que o backend retorne eles)
        setAvaliacoes(avaliacoes.map(a => {
          if (a.id === id) {
            return {
              ...a,
              likes: result.likes !== undefined ? result.likes : a.likes,
              dislikes: result.dislikes !== undefined ? result.dislikes : a.dislikes,
            };
          }
          return a;
        }));
      } else {
        alert('Erro ao registrar reação: ' + result.error);
      }
    } catch (err) {
      console.error('Erro ao registrar like/dislike:', err);
      alert('Erro ao registrar reação');
    }
  };



function tempoDecorrido(dataString) {
  if (!dataString) return '';
  const data = new Date(dataString.replace(' ', 'T'));
  if (isNaN(data)) return 'Data inválida';
  return formatDistanceToNow(data, { addSuffix: true, locale: ptBR });
}

  return (
    <div className="avaliacoes-container">
       <div className='Edi1'>
        <h3>
        Avaliações para {username}{' '}
        <span className="media-nota">({averageRating} <FaStar color='orange' size={20}/>)</span>
      </h3>
       </div>

      <div className="grafico-estrelas">
        {[5, 4, 3, 2, 1].map((star, index) => {
          const count = ratingCounts[star - 1];
          const total = avaliacoes.length;
          const percent = total ? (count / total) * 100 : 0;
          return (
            <div key={star} className="barra-linha">
              <span>{star} ★</span>
              <div className="barra">
                <div className="preenchimento" style={{ width: `${percent}%` }}></div>
              </div>
              <span>{count}</span>
            </div>
          );
        })}
      </div>

{currentUserId != userId && (
  <div className="avaliacao-form">
    <h4>O que achou do trabalho do <b>{username}</b>?</h4>
    <center>
      <div className="Edit2">
        <label className="Edit2Label">Quantas estrelas?</label>
        <div className="stars2">
          {[1, 2, 3, 4, 5].map((i) => (
            <FaStar
              key={i}
              onClick={() => setRating(i)}
              color={i <= rating ? 'orange' : 'lightgray'}
              style={{ cursor: 'pointer' }}
              size={30}
            />
          ))}
        </div>
      </div>
    </center>

    <textarea
    className='DeixaC'
      ref={textareaRef}
      placeholder="Deixe um comentário"
      value={comentario}
      onChange={(e) => setComentario(e.target.value)}
    />

    <button onClick={enviarAvaliacao} disabled={loading} className='EnviarAva'>
      {loading ? 'Enviando...' : editingId ? 'Atualizar Avaliação' : 'Enviar Avaliação'}
    </button>

    {showRecomendar && (
      <div style={{ marginTop: '10px' }}>
        <p>Você gostaria de recomendar este profissional?</p>
        <button
          className="btn-sim EnviarAva"
          style={{ marginRight: '10px', backgroundColor: '#4CAF50', color: 'white' }}
          onClick={Recomendar}
        >
          Sim
        </button>
        <button
          className="btn-nao EnviarAva"
          style={{ backgroundColor: '#ccc', color: '#333' }}
          onClick={() => setShowRecomendar(false)}
        >
          Não
        </button>
      </div>
    )}
  </div>
)}

          <div className='QtPer'>
            <h4> O que os clientes dizem sobre <b>{username}</b> ?</h4>
          </div>
      <div className="avaliacoes-lista" ref={listaRef}>
        {avaliacoes.length > 0 ? (
          avaliacoes.map((a) => (
            <div key={a.id} className="avaliacao-card" >
              <div className="avaliador" onClick={()=>{navegar(`/perfil/${a.user.userid}`)}}>
               <img
              src={
                a.user?.avatar
                  ? (a.user.avatar.includes('http') ? a.user.avatar : `${Url}/${a.user.avatar}`)
                  : userImg
              }
              alt="avatar"
            />

                <div className='UserVAN'>
                  <strong>{a.user?.name || 'Usuário'}</strong>
                  <p><strong>{a.user?.location || ''}</strong></p>

                 <span>{tempoDecorrido(a.data)}</span>

                </div>
              </div>
              <div className="estrelas">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    size={20}
                    color={i < a.rating ? 'orange' : 'lightgray'}
                  />
                ))}
              </div>
              <p className="comentario">{a.comentario}</p>
              <div className='rodaAv'>
                <div className="reacoes" style={{ userSelect: 'none' }}>
                  <FaThumbsUp
                  className='btnReact'
                    color="green"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleLikeDislike(a.id, 'like')}
                    title="Curtir avaliação"
                    size={20}
                  />{' '}
                  {a.likes}
                  <FaThumbsDown
                    color="red"
                    style={{ marginLeft: 10, cursor: 'pointer' }}
                    onClick={() => handleLikeDislike(a.id, 'dislike')}
                    title="Não curtir avaliação"
                    size={20}
                  />{' '}
                  {a.dislikes}
                </div>
                 
                {currentUserId == a.user?.userid && (
                  <div className="avaliacao-acoes">
                    <FaEdit
                      title="Editar avaliação"
                      onClick={() => openModal('edit', a)}
                      style={{
                        cursor: 'pointer',
                        marginRight: '12px',
                        color: '#007bff',
                        fontSize: '18px',
                        transition: 'transform 0.2s',
                      }}
                    />
                    <FaTrash
                      title="Apagar avaliação"
                      onClick={() => openModal('delete', a)}
                      style={{
                        cursor: 'pointer',
                        color: 'red',
                        fontSize: '18px',
                        transition: 'transform 0.2s',
                      }}
                    />
                  </div>
                )}
               
              </div>
            </div>
          ))
        ) : (
          <p>Este profissional ainda não foi avaliado.</p>
        )}
         <div id="sentinela-avaliacoes" style={{ height: 30 }}></div>
  {loading && <p>Carregando...</p>}
      </div>

         {showModal && (
  <div className='ModalAV'>
    <div className='ModalContentAV'>
      <Modal show={showModal} onClose={closeModal}>
        {modalType === 'delete' ? (
          <>
            <h3>Confirmar exclusão</h3>
            <p>Você tem certeza que deseja excluir sua avaliação?</p>
            <div className='ModalContainerBtn'>
              <button onClick={confirmDelete} className="btn-sim">Sim</button>
              <button onClick={closeModal} className="btn-nao">Cancelar</button>
            </div>
          </>
        ) : modalType === 'edit' ? (
          <>
          <div className='ModalContainerBtn'>
            <h3>Editar Avaliação</h3>
            <p>Você quer editar sua avaliação?</p>
            <button onClick={confirmEdit} className="btn-sim">Sim</button>
            <button onClick={closeModal} className="btn-nao">Cancelar</button>
          </div>
            
          </>
        ) : null}
      </Modal>
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
};

export default AvaliacoesPlayStore;
