import React, { useEffect, useState, useRef, useCallback } from 'react';
import Header from '../components/Header';
import RodapeNavegacao from '../components/RodapeNavegacao';
import '../styles/Fotos.css';
import { useParams } from 'react-router-dom';
import PrimaryBtn from '../components/PrimaryBtn';
import { useNavigate } from 'react-router-dom';
import PageLoading from '../components/PageLoading'
export default function Fotos() {
  const [fotos, setFotos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImg, setModalImg] = useState(null);
  const observer = useRef();
  const { userid } = useParams();
  const navegar = useNavigate()

const [logado, setUserLogado] = useState(null);
const[userLocal,setUserLocal] = useState([])

const fetchFotos = async () => {
  try {
    const res = await fetch(`https://t1emprego.com/api/AllMyFotos.php?page=${page}&limit=12&userid=${userid}`);
    const data = await res.json();
    //console.log(data);

    if (data.posts.length === 0) {
      setHasMore(false);
    } else {
      setFotos((prev) => {
        const novosUnicos = data.posts.filter(
          (nova) => !prev.some((foto) => foto.postid === nova.postid)
        );
        return [...prev, ...novosUnicos];
      });
    }
  } catch (error) {
    console.error('Erro ao buscar fotos:', error);
  }
};


// ✅ busca o perfil
async function fetchProfile() {
try {
const res = await fetch('https://t1emprego.com/api/getUserData.php', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
},
body: JSON.stringify({ userid:userid}),
});

const data = await res.json();
//console.log(data)

if (data.error) {
console.error(data.error);
} else {
  // atualizando ddos do usuario 
  setUserLogado(data)


}

} catch (err) {
console.error('Erro ao carregar o perfil:', err);
}
}




  useEffect(() => {

    // dados do usuario logado
 const storedUser = localStorage.getItem('userData');
 const parsed = JSON.parse(storedUser);

 if(parsed){
  setUserLocal(parsed)
 }

fetchProfile(); // ✅ chamada movida para dentro do try
fetchFotos();
  }, [page]);

  const lastFotoRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      if (!hasMore) return;

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  // Função para abrir modal
  const openModal = (img) => {
    setModalImg(img);
    setModalOpen(true);
  };

  // Fechar modal clicando fora ou no botão
  const closeModal = () => {
    setModalOpen(false);
    setModalImg(null);
  };

  // verificar se esta logado ou nao 
if (!logado) {
return <>
<PageLoading/>
</>
}

  return (
    <>fotos
      <Header isPerfil={true} />
      <div className="-wrapper">
        <div className="fotos-container">
          <h2 className="fotos-title">📸 Fotos de : <b>{logado.username}</b></h2> <br />
         {
          userLocal.username === logado.username &&(
            <>
             <PrimaryBtn onClick={()=>{navegar("/CriarPost")}}>Adicionar Novo Post</PrimaryBtn>
            </>
          )
         }
          <br />
          <div className="fotos-grid">
  {fotos.map((item, index) => (
    <div
      key={item.postid}
      className="fotos-card"
      ref={index === fotos.length - 1 ? lastFotoRef : null}
      onClick={() => openModal(item.imagem)}
      tabIndex={0} // para acessibilidade
      role="button"
      onKeyDown={(e) => { if (e.key === 'Enter') openModal(item.imagem); }}
    >
      <img src={item.imagem} alt={`Foto ${item.postid}`} className="fotos-image" />
    </div>
  ))}
</div>

          {!hasMore && <p className="fotos-end">Você chegou ao fim da galeria.</p>}
        </div>
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal} aria-label="Fechar modal">&times;</button>
            <img src={modalImg} alt="Imagem completa" className="modal-image" />
          </div>
        </div>
      )}
     

      <RodapeNavegacao />
    </>
  );
}
