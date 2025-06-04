import React, { useState,useEffect } from 'react';
import userimg from '../assets/user_male.jpg';
import coverImg from '../assets/placeholder-image.jpg';
import Header from '../components/Header';
import RodapeNavegacao from '../components/RodapeNavegacao';
import PrimaryBtn from '../components/PrimaryBtn';
import { data, useNavigate } from 'react-router-dom';
import ModalFeedback from '../components/ModalFeedback';
import PageLoading from '../components/PageLoading';
import '../styles/Settings.css'
const Url = "https://t1emprego.com";
export default function Settings() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [senhaNova, setSenhaNova] = useState('');
  const [tipoConta, setTipoConta] = useState('');
  const [imgPerfil, setImgPerfil] = useState(null);
  const [imgCapa, setImgCapa] = useState(null);
  const [imgPerfilFile, setImgPerfilFile] = useState(null);
  const [imgCapaFile, setImgCapaFile] = useState(null);
  const[logado,setLogado] = useState([])
   const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
 const [profileData,setProfileData] = useState([])

    // Carrega dados locais
    useEffect(() => {
      const storedUser = localStorage.getItem('userData');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setLogado(parsed);
  // buscando os dado do perfil 
   async function fetchProfile() {
 

      try {
        const res = await fetch(`${Url}/api/user_profile.php`, {
          method: 'POST',
          body: JSON.stringify({ userid: parsed.userid,tipo_conta:parsed.tipo_conta }),
        });

        const data = await res.json();
        ///console.log(data)
        if (data.error) {
          console.error(data.error);
        } else {
          setProfileData(data);
          
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
      
    }, [])

    

const handleImgChange = (e, setPreview, setFile) => {
  const file = e.target.files[0];
  if (file) {
    setPreview(URL.createObjectURL(file)); // mostra a imagem
    setFile(file); // salva o arquivo real
  }
};


const handleUploadImagem = async (file, tipo) => {
  if (!file) return;



  const formData = new FormData();
  formData.append('imagem', file);
  formData.append('userid', logado.userid);
  formData.append('tipo', tipo); // 'perfil' ou 'cover'

  try {
    const response = await fetch('https://t1emprego.com/api/upload_imagem.php', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    ////console.log(data)
    if (data.success) {
      setModalMessage(`Imagem de ${tipo} atualizada com sucesso!`)
     setModalOpen(true)
    } else {
      setModalMessage('Erro ao enviar imagem: ' + data.message)
      setModalOpen(true)
     
    }
  } catch (error) {
    setModalMessage('Erro ao enviar imagem: ' + error.message)
   setModalOpen(true)
  }
};


  const handleLogout = async () => {
    const respo = await fetch('https://t1emprego.com/api/logout.php');
    const data = await respo.json();

    localStorage.removeItem('userData');
    localStorage.removeItem('isLoggedIn');

    navigate('/Login');
  };

  const handleEditarCurriculo = () => {
    navigate('/CurriculoForm');
  };
  const GoAdmin = ()=>{
    navigate('/AdminLayout')
  }
  // mudar po nome do usuario
const ChangeUsername = async () => {
  fetch("https://t1emprego.com/api/settings.php", {
    method: "POST",
    body: JSON.stringify({
      EUN: 1,
      userid: profileData.userid,
      username: nome
    })
  })
    .then(res => res.json())
    .then(data => {
      //console.log(data);
      setModalMessage(data.status || data.error);
      setModalOpen(true);
    })
    .catch(err => {
      console.error(err);
      setModalMessage("Erro ao atualizar nome de usuário.");
      setModalOpen(true);
    });
};
// muda o telefone do usuario
const ChangeUserPhone = async () => {
  fetch("https://t1emprego.com/api/settings.php", {
    method: "POST",
    body: JSON.stringify({
      EN: 1,
      userid: profileData.userid,
      number: telefone
    })
  })
    .then(res => res.json())
    .then(data => {
     // console.log(data);
      setModalMessage(data.status || data.error);
      setModalOpen(true);
    })
    .catch(err => {
      console.error(err);
      setModalMessage("Erro ao atualizar numero de usuário.");
      setModalOpen(true);
    });
};
// muda o telefone do senha
const ChangeUserPassword = async () => {
  fetch("https://t1emprego.com/api/settings.php", {
    method: "POST",
    body: JSON.stringify({
      EP: 1,
      userid: profileData.userid,
      password_atual: senhaAtual,
      password_nova:senhaNova
    })
  })
    .then(res => res.json())
    .then(data => {
     // console.log(data);
      setModalMessage(data.status || data.error);
      setModalOpen(true);
    })
    .catch(err => {
      console.error(err);
      setModalMessage("Erro ao atualizar senha de usuário.");
      setModalOpen(true);
    });
};
// muda o telefone do tipo de conta
const ChangeUserTipoConta = async () => {
  fetch("https://t1emprego.com/api/settings.php", {
    method: "POST",
    body: JSON.stringify({
      userid: profileData.userid,
      valor:tipoConta
    })
  })
    .then(res => res.json())
    .then(data => {

     /// console.log(data);

      setModalMessage(data.status || data.error);
      setModalOpen(true);
    })
    .catch(err => {
      console.error(err);
      setModalMessage("Erro ao atualizar senha de usuário.");
      setModalOpen(true);
    });
};


    // Aguarda os dados serem carregados
    if (!logado) {
      return (
        <>
         <PageLoading/>
        </>
      );
    }

    //console.log(profileData)

  return (
    <div style={styles.container} className='SettiMO'>
      <Header isPerfil={true} />

      <style>{`
        @media (max-width: 600px) {
          .form-group {
            flex-direction: column;
            align-items: flex-start;
          }
          .form-group label {
            margin-bottom: 4px;
          }
        }

        ::file-selector-button {
          padding: 6px 12px;
          background-color: #4285F4;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          margin-right: 12px;
        }

        ::file-selector-button:hover {
          background-color: #3367d6;
        }
      `}</style>

      <h2 style={styles.title}>Definições da Conta</h2>

      {/* Imagem de capa */}
      <div style={styles.section} className='imgCapaMob'>
        <label style={styles.label}>Imagem da Capa:</label>
   <img
  src={imgCapa ? imgCapa : (profileData.capa ? `${Url}/${profileData.capa}` : coverImg)}
  alt="Capa"
  style={styles.capaPreview}
/>


        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImgChange(e, setImgCapa, setImgCapaFile)}
          style={styles.inputFile}
        />
      <PrimaryBtn onClick={() => handleUploadImagem(imgCapaFile, 'cover')}>
  Atualizar foto de capa
</PrimaryBtn>


        <br />
      </div>

      {/* Imagem de perfil */}
  
<div style={styles.section}>
  <label style={styles.label}>Imagem de Perfil:</label>
  
  <img
    src={imgPerfil ? imgPerfil : (profileData.foto ? `${Url}/${profileData.foto}` : userimg)}
    alt="Perfil"
    style={styles.perfilPreview}
  />

  <input
    type="file"
    accept="image/*"
    onChange={(e) => handleImgChange(e, setImgPerfil, setImgPerfilFile)}
    style={styles.inputFile}
  />

  <PrimaryBtn onClick={() => handleUploadImagem(imgPerfilFile, 'perfil')}>
    Atualizar foto de perfil
  </PrimaryBtn>

  <br />
</div>


      {/* Formulário */}
      <div style={styles.form}>
        <div className="form-group" style={styles.group}>
          <label style={styles.label}>Nome de usuário:</label>
          <input
            type="text"
            value={nome || profileData.username || ""}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite seu nome"
            style={styles.input}
          />
          <PrimaryBtn onClick={ChangeUsername}>Atualizar </PrimaryBtn>
          <br />
        </div>

        <div className="form-group" style={styles.group}>
          <label style={styles.label}>Telefone:</label>
          <input
            type="tel"
            value={telefone || profileData.number || ""}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="+244 924683354"
            style={styles.input}
          />
          <PrimaryBtn onClick={ChangeUserPhone}>Atualizar </PrimaryBtn>
          <br />
        </div>

        <div className="form-group" style={styles.group}>
          <label style={styles.label}>Senha:</label>
          <input
            type="password"
            value={senhaAtual}
            onChange={(e) => setSenhaAtual(e.target.value)}
            placeholder="Senha antiga"
            style={styles.input}
          />
          <input
            type="password"
            value={senhaNova}
            onChange={(e) => setSenhaNova(e.target.value)}
            placeholder="Nova senha"
            style={styles.input}
          />
          <PrimaryBtn onClick={ChangeUserPassword}> Atualizar  </PrimaryBtn>
          <br />
        </div>

        <div className="form-group" style={styles.group}>
          <label style={styles.label}>Tipo de Conta:</label>
          <select
            value={tipoConta || profileData.tipo_conta || ""}
            onChange={(e) => setTipoConta(e.target.value)}
            style={styles.select}
          >
            <option value="P">Prestador de Serviço</option>
            <option value="C">Cliente</option>
          </select>
        <PrimaryBtn onClick={ChangeUserTipoConta}>Atualizar  </PrimaryBtn>
          <br />
        </div>
        
        <PrimaryBtn onClick={handleEditarCurriculo}> Editar Curriculo </PrimaryBtn>

       {/*  
        <PrimaryBtn onClick={GoAdmin}> Ir para Area do Admin </PrimaryBtn>
       */}
    
        <button onClick={handleLogout} style={styles.logoutBtn} className='logoutBtn'>
          Terminar Sessão
        </button>
      </div>
       <ModalFeedback
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              message={modalMessage}/>

      <RodapeNavegacao />
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '40px auto',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 6px 25px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    boxSizing: 'border-box',
    marginBottom:'120px',
  },
  title: {
    fontSize: '1.5rem', // 24px
    marginBottom: '28px',
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
    marginTop: '20px',
  },
  section: {
    marginBottom: '30px',
    textAlign: 'center',
  },
  capaPreview: {
    width: '100%',
    height: '160px',
    objectFit: 'cover',
    borderRadius: '12px',
    marginBottom: '12px',
    boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease',
    cursor: 'pointer',
  },
  perfilPreview: {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid #fff',
    boxShadow: '0 3px 10px rgba(0,0,0,0.15)',
    marginBottom: '14px',
    transition: 'transform 0.3s ease',
    cursor: 'pointer',
  },
  inputFile: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1.5px solid #ccc',
    backgroundColor: '#fafafa',
    fontSize: '1rem',
    transition: 'border-color 0.3s ease',
  },
  label: {
    fontWeight: '600',
    display: 'block',
    marginBottom: '10px',
    color: '#555',
    fontSize: '1rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  group: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    width: '100%',
  },
  input: {
    padding: '14px 12px',
    border: '1.5px solid #ccc',
    borderRadius: '8px',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.3s ease',
    width: '100%',
    boxSizing: 'border-box',
  },
  select: {
    padding: '14px 12px',
    border: '1.5px solid #ccc',
    borderRadius: '8px',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.3s ease',
    width: '100%',
    boxSizing: 'border-box',
    appearance: 'none',
    backgroundColor: '#fff',
  },
  primaryBtn: {
    marginTop: '8px',
    padding: '14px 0',
    backgroundColor: '#007bff',
    color: '#fff',
    fontWeight: '700',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    width: '100%',
    boxSizing: 'border-box',
  },
  primaryBtnHover: {
    backgroundColor: '#0056b3',
  },
  logoutBtn: {
    marginTop: '24px',
    padding: '14px 0',
    backgroundColor: '#d9534f',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '1rem',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'background-color 0.3s ease',
  },
  logoutBtnHover: {
    backgroundColor: '#b52b27',
  },
  // Media query para desktop maior
  '@media(min-width: 768px)': {
    container: {
      padding: '32px',
      maxWidth: '720px',
    },
    form: {
      gap: '24px',
    },
    group: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '20px',
    },
    input: {
      width: '60%',
    },
    select: {
      width: '60%',
    },
    primaryBtn: {
      width: 'auto',
      padding: '12px 24px',
    },
    logoutBtn: {
      width: 'auto',
      padding: '12px 24px',
    },
    capaPreview: {
      height: '220px',
      borderRadius: '16px',
    },
    perfilPreview: {
      width: '110px',
      height: '110px',
      borderRadius: '50%',
    },
  },
};
