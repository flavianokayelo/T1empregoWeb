import React, { useEffect, useState } from 'react';
import userImg from '../assets/user_male.jpg';
import ModalFeedback from '../components/ModalFeedback';
import RodapeNavegacao from '../components/RodapeNavegacao';
import Header from '../components/Header';
import { IoClose } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';
import PrimaryBtn from '../components/PrimaryBtn';
import '../styles/Curriculo.css'
import ModalImage from '../components/ModalImage';


const Url = "https://t1emprego.com";
const Curriculo = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
    const [userLocal, setUserLocal] = useState(null);
    const [userData, setUserData] = useState(null);
   const { userid } = useParams();
   const [habilidade, setHabilidade] = useState([])
    const [modalOpen, setModalOpen] = useState(false);
   const [modalMessage, setModalMessage] = useState('');
  const navegar = useNavigate()
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    // Carrega dados locais do usuario que esta logado
      useEffect(() => {
        
        const storedUser = localStorage.getItem('userData');
        //alert(storedUser)
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            setUserLocal(parsed);
          } catch (err) {
            console.error("Erro ao parsear userData:", err);
          }
        }
        
      }, []);

        // Busca dados do do curriculo do usuario logado
        useEffect(() => {

          async function fetchCurriculo() {
          
      
            try {
              const response = await fetch(`${Url}/api/buscar_curriculo.php?userid=${userid}`);

             const data = await response.json();
    
              //console.log(data)

              if (data.error) {
                console.error(data.error);
              } else {
                setUserData(data.data[0]);
                setHabilidade(JSON.parse(data.data[0].habilidades))
              }
            } catch (err) {
              console.error('Erro ao carregar o perfil:', err);
            }
          }
      
          fetchCurriculo();
        }, []);

      //console.log(userLocal)

  const handleEditarCurriculo = () => {
    navegar('/CurriculoForm');
  };

          // Aguarda os dados serem carregados
          if (!userData) {
            return (
              <>
                <Header isPerfil={true} />
                <div className="container">
                  <p>Carregando curriculo...</p>

                </div>
              </>
            );
          }
  return (
    <>
      <Header isPerfil />

      <div style={styles.container} className='CurriculoMobile'>
        {/* FOTO, NOME, PROFISSÃO, ENDEREÇO, BI */}
        <div style={styles.topSection}>
<img
  src={userData.profile_image ? `https://t1emprego.com/${userData.profile_image}` : userImg}
  alt="Avatar"
  style={styles.avatar}
  onClick={() => setIsImageModalOpen(true)}
  className="clickable-avatar"
/>


          <h2 style={styles.name}>{userData.full_name?? "undefined"}</h2>
          <p style={styles.profession}>{userData.profissao?? "undefined"}</p>
          <p style={styles.address}>{userData.provincia + " / " + userData.municipio + " / " + userData.bairro + ' / ' + userData.rua }</p>
          <button className='shoeCu' onClick={() => setModalVisible(true)} style={styles.biText}>
            BI: {userData.bi?? "undefined"}
          </button>
        </div>

       {modalVisible && (
  <div style={styles.modalBackground}>
    <div style={styles.modalContent} className='ModalBIVer'>
      <h3 style={styles.modalTitle}>Número do BI</h3>
      <p style={styles.modalBI}>{userData.bi ?? "undefined"}</p>

      <button
      className='VerBIbuton'
        style={styles.certButton}
        onClick={() => {
          setModalVisible(false);

          // Abre o PDF do BI
          const biPdfPath = userData.bi_pdf?.replace(/^\.\.\//, "/");
          const fullUrl = window.location.origin + biPdfPath;
          window.open(fullUrl, "_blank");
        }}
      >
        Ver Documento do BI
      </button>

      <button
        style={styles.closeButton}
        onClick={() => setModalVisible(false)}
      >
        <IoClose size={24} color="#fff" />
      </button>
    </div>
  </div>
)}

          

        {/* SOBRE MIM */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Sobre Mim</h3>
          <p style={styles.text} className='about_me lead'>
            {userData.sobre_mim?? "undefined"}
          </p>
        </div>

        {/* FORMAÇÃO */}
        <div style={styles.section} className='FormacaoSection'>
          <h3 style={styles.sectionTitle}>Formação Acadêmica</h3>
          <p style={styles.text}>
           {userData.categoria?? "undefined"}
          </p>



        <button
  style={styles.certButton}
  onClick={() => {
    const certificado = userData.certificado_pdf;

    if (!certificado) {
     
      setModalMessage(`${userData.username} não tem certificado carregado.`)
      setModalOpen(true)
      return;
    }

    // Remove "../" do caminho e monta URL completa
    const biPdfPath = certificado.replace(/^\.\.\//, "/");
    const fullUrl = window.location.origin + biPdfPath;

    window.open(fullUrl, "_blank");
  }}
>
  Ver Certificado Acadêmico
</button>

        </div>

        {/* EXPERIÊNCIA */}
        <div style={styles.section} className='ProfissionalEx'>
          <h3 style={styles.sectionTitle}>Experiência Profissional</h3>

          <p style={styles.text}>
           {userData.f_profissional?? "Undefined"}
          </p>
          
        </div>

        {/* SKILLS */}
        <div style={styles.section} className='SkillC'>
          <h3 style={styles.sectionTitle}>Habilidades</h3>
          <div style={styles.text}>
        
              <ul>
          {habilidade && habilidade.length > 0 ? (
            habilidade.map((hab, index) => (
              <li key={index}>{hab}</li>
            ))
          ) : (
            <li>Nenhuma habilidade informada.</li>
          )}
        </ul>

            
            </div>
           {
            userLocal.username === userData.username && (
              <>
                <PrimaryBtn onClick={handleEditarCurriculo}>Atualizar Curriculo</PrimaryBtn>
              </>
            )
           }
         
        </div>
          <ModalFeedback
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          message={modalMessage}
        
          />
          {/*Modal Abri foto perfil curriculo*/ }
            {isImageModalOpen && (
        <ModalImage
          imageUrl={userData.profile_image ? `https://t1emprego.com/${userData.profile_image}` : userImg}
          onClose={() => setIsImageModalOpen(false)}
        />
      )}

      </div>

      <RodapeNavegacao />

      {/* MODAL LOADING */}
      {loading && (
        <div style={styles.loadingBackground}>
          <div style={{ textAlign: 'center' }}>
            <div className="spinner" />
            <p style={{ color: '#225b79', marginTop: 10 }}>Carregando PDF...</p>
          </div>
        </div>
      )}
    </>
  );
};

const primaryColor = '#4285F4';

const styles = {
  container: {
    maxWidth: 600,
    margin: '80px auto 40px auto',
    padding: 20,
    backgroundColor: '#fff',
    fontFamily: 'sans-serif',
    marginBottom:'100px',
    marginTop:'160px',
  },
  topSection: {
    textAlign: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: '50%',
    border: '3px solid #225b79',
    marginBottom: 10,
    objectFit: 'cover',
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 5,
  },
  profession: {
    fontSize: 18,
    color: '#666',
    marginBottom: 5,
  },
  address: {
    fontSize: 14,
    color: '#777',
    marginBottom: 5,
  },
  biText: {
    fontSize: 16,
    color: '#225b79',
    background: 'none',
    border: 'none',
    textDecoration: 'underline',
    cursor: 'pointer',
    marginTop: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#225b79',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#444',
    marginBottom: 5,
  },
  certButton: {
    marginTop: 10,
    backgroundColor: primaryColor,
    color: '#fff',
    padding: '8px 16px',
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
  },
  modalBackground: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxWidth: 400,
    position: 'relative',
    textAlign: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#225b79',
    marginBottom: 10,
  },
  modalBI: {
    fontSize: 18,
    color: '#444',
    marginBottom: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#225b79',
    border: 'none',
    borderRadius: '50%',
    padding: 5,
    cursor: 'pointer',
  },
  loadingBackground: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(255,255,255,0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
};

export default Curriculo;
