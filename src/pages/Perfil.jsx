import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import AvaliacoesPlayStore from '../components/AvaliacoesPlayStore';
import FeaturedSection from '../components/FeaturedSection';
import RodapeNavegacao from '../components/RodapeNavegacao';
import { useNavigate, useParams } from 'react-router-dom';
import ModalFeedback from '../components/ModalFeedback';
import PrimaryBtn from '../components/PrimaryBtn';
import SobreMim from '../components/SobreMim';
import PageLoading from '../components/PageLoading';
import {
FaThumbsUp,
FaThumbsDown,
FaStar,
FaPhone,
FaEnvelope,
FaWrench,
FaFileAlt,
FaCommentDots,
} from 'react-icons/fa';
import { MdRecommend } from "react-icons/md";

import '../styles/Perfil.css';

import userImg from '../assets/user_male.jpg';

import placeholderimg from '../assets/placeholder-image.jpg';
import ListaServico from '../components/ListaServico';
import AppCard from '../components/AppCard';
import UserCard from '../components/UserCard';

const Url = "https://t1emprego.com";
const Perfil = () => {
const [userLocal, setUserLocal] = useState(null);
const [userData, setUserData] = useState(null);
const navigate = useNavigate();
const [featured, setFeatured] = useState([]);
const { userid } = useParams();
const [modalOpen, setModalOpen] = useState(false);
const [modalMessage, setModalMessage] = useState('');
const [loading, setLoading] = useState(false);
const [UsersCunhecido,setUsersCunhecido] = useState([])
const[userPopular,setUserPopular] = useState([])
const [showModalFotoPerfil, setShowModalFotoPerfil] = useState(false);
const [showModalCapa, setShowModalCapa] = useState(false);






// Carrega dados locais
useEffect(() => {
const storedUser = localStorage.getItem('userData');
const isLoggedIn = localStorage.getItem('isLoggedIn');

   if (isLoggedIn === 'false') {
      navigate('/Login');
    }

if (storedUser) {
try {
const parsed = JSON.parse(storedUser);
setUserLocal(parsed);

//setando usuario online 
fetch('https://t1emprego.com/api/setUserOnline.php')
.then(res => res.json())
.then(data => console.log('User online status:', data));

// bucando usuario popular no T1emprego
fetch(`https://t1emprego.com/api/getUserPopular.php?userid=${parsed.userid}`)

.then(res => res.json())

.then(data => {

if (Array.isArray(data)) setUserPopular(data);
})
// fim buscar usuario popular 

// buscando usuario que talvez conheces 
fetch('https://t1emprego.com/api/getUserCunhecido.php', {
headers: {
'Content-Type': 'application/json',
},
method: 'POST',
body: JSON.stringify(parsed.userid)
})
.then(res => res.json())
.then(data => {
//console.log(data)

if (Array.isArray(data)) setUsersCunhecido(data);
})
// fim buscar usuario que talvez conheces 


} catch (err) {
console.error("Erro ao parsear userData:", err);
}
}



}, []);



// Busca dados do perfil
useEffect(() => {


async function fetchProfile() {
const idToFetch = userid || userLocal?.userid;

//console.log(userLocal);

if (!idToFetch) return;

try {
const res = await fetch('https://t1emprego.com/api/user_profile.php', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
},
body: JSON.stringify({ userid: idToFetch}),
});

const data = await res.json();


if (data.error) {
console.error(data.error);
} else {
setUserData(data);
setFeatured(data.fotos_recentes || []);
}
} catch (err) {
console.error('Erro ao carregar o perfil:', err);
}
}

fetchProfile();

}, [userLocal, userid]);

//console.log(userData)
// confirmar antes de solicitar servico 
const SolicitarServicoConfirm = ()=>{
setModalMessage(`Tem certeza que quer solicitar os serviços de ${userData.username}?? T1emprego aconhcelha a não dar notificações falsas.`)
setModalOpen(true)
}
// solicitar servico funcao que vai lidar com
const SolicitarServico = async()=>{



const idToFetch = userid || userLocal?.userid;
setLoading(true); // Inicia spinner
if (!idToFetch) return;

try {
const res = await fetch('https://t1emprego.com/api/solicitar_servico.php', {
method: 'POST',

body: JSON.stringify({profissionalId: userData.userid,solicitanteId:userLocal?.userid,profissionalEmail:userData.email,profissionalPhone: userData.number,profissionalUsername:userData.username,solicitanteUsername:userLocal.username}),
});

const data = await res.json();

if(data != "" ){
setModalMessage(data)
setModalOpen(true)
}else{
console.log(data)
}


} catch (err) {
console.error('Erro ao carregar o perfil:', err);
}
finally {
setLoading(false); // Finaliza spinner
}
}
//// quando o usuario clcicarem eniar mensagem
function gerarLinkWhatsApp(numeroComDDD, mensagem) {
// Remove caracteres não numéricos do número
const numero = numeroComDDD.replace(/\D/g, '');
// Codifica a mensagem para uso na URL
const mensagemCodificada = encodeURIComponent(mensagem);
// Retorna o link do WhatsApp
return `https://wa.me/${numero}?text=${mensagemCodificada}`;
}
const EnviarSmsWhatsapp = ()=>{
const mensagem = "Ola! achei teu perfil interesante, estou pensando trabalhar contigo"

const link = gerarLinkWhatsApp(userData.number, mensagem)

window.open(link, '_blank');

}
// quando o usuario clciar em ligar
function isMobileDevice() {
return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
}


const ligarParaUsuario = (numero) => {
numero = userData.number;

if (isMobileDevice()) {
window.location.href = `tel:${numero}`;
} else {
setModalMessage("Ligações diretas só funcionam em dispositivos móveis.")
setModalOpen(true)
}
}

const ListaServico = ()=>{
navigate(`/AllMyServices/${userData.userid}`)
}
const ListaFoto = ()=>{
navigate(`/Fotos/${userData.userid}`)
}


// sete user opnline



// Aguarda os dados serem carregados

if (!userData) {
return (
    <PageLoading/>
);
}


return (
<>
<Header isPerfil={true} />

<div className="container">
<div className="cover-container">
<div className="coverC">
{userData.capa ? (
<img
className="cover-image"
src={`${Url}/${userData.capa}`}
alt="capa"
onClick={() => setShowModalCapa(true)}
style={{ cursor: 'pointer' }}
/>
) : (
<img
className="cover-image"
src={placeholderimg}
alt="capa"
onClick={() => setShowModalCapa(true)}
style={{ cursor: 'pointer' }}
/>
)}
</div>

<div className="avatarC">
{userData.foto ? (
<motion.img
className="avatar"
src={`${Url}/${userData.foto}`}
initial={{ scale: 1 }}
animate={{ scale: 0.9 }}
alt="avatar"
onClick={() => setShowModalFotoPerfil(true)}
style={{ cursor: 'pointer' }}
/>
) : (
<motion.img
className="avatar"
src={userImg}
initial={{ scale: 1 }}
animate={{ scale: 0.9 }}
alt="avatar"
onClick={() => setShowModalFotoPerfil(true)}
style={{ cursor: 'pointer' }}
/>
)}
</div>

</div>

<div className="profile-section">

<motion.h2
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
transition={{ duration: 0.7 }}
>
{userData.username??userData.userid}

</motion.h2>
<span className={`online ${userData.online === 'online' ? 'ativo' : ''}`}>
  {userData.online}
</span>

{
userData.tipo_conta === "P" && (
<>
<p className="profession">{userData.profissao}</p>


<SobreMim userData={userData}/>

</>
)
}


<div className="info-container">
{userData.tipo_conta === "P" &&(
<>
<div className="info-row">
<FaWrench />
<span><strong>Área de Atuação:</strong> {userData.provincia} / {userData.municipio}</span>
</div>

</>
)}

<div className="info-row">
<FaWrench />
<span><strong>Cidade:</strong> {userData.municipio}</span>
</div>
<div className="info-row">
<FaPhone />
<span><strong>Contacto:</strong> {userData.number || 'Não informado'}</span>
</div>
<div className="info-row">
<FaEnvelope />
<span><strong>Email:</strong> {userData.email || 'Não informado'}</span>
</div>
</div>
{
userData.tipo_conta === "P" &&(
<>
<div className="stats-row">
<div className="stat"><FaCommentDots color="green" size={25}/><span>{userData.likes}</span></div>
<div className="stat"><FaCommentDots color="red" size={25}/><span>{userData.dislikes}</span></div>
<div className="stat"><FaStar color="orange" size={25}/><span>{userData.estrelas}</span></div>
</div>

{featured.length > 0 ? (
<FeaturedSection featured={featured} title="Fotos recentes" onSeeAll={ListaFoto} />
) : (
<p>{userData.username} não tem fotos relacionadas ao seu trabalho.</p>
)}


</>
)
}



<div className="actions-row action-RowMobile">
{
userData.tipo_conta === "P" && (
<>
<button className="action-button" onClick={ListaServico}>
<FaWrench /> Lista de Serviço
</button>
<button className="action-button destaque">
<MdRecommend />
Nº de Recomendações ({userData.total_recomendacoes})
</button>
</>
)
}

</div>


<div className="actions-row AR2">

<button className="action-button" onClick={() => navigate(`/Curriculo/${userData.userid}`)}>
<FaFileAlt /> 
  {userData.mais_tarde == 1 &&(
    <span>{userData.sms}</span>
  )}

  {userData.username &&(
    <span>Ver Currículo</span>
  )}

</button>

{userData.tipo_conta === "P" &&(
<>
{
userid?<button className="action-button" onClick={SolicitarServicoConfirm}>
<FaWrench /> 
{loading ? (
<span className="spinner"></span>
) : (
'Solicitar Serviço'
)}

</button>: null
}
</>
)}



</div>

{
userid? <div className="actions-row">
<button className="action-button" onClick={()=>{navigate(`/ChatApp/${userid}`)}}>
<FaCommentDots /> Enviar SMS 
</button>
<button className="action-button" onClick={ligarParaUsuario}>
<FaPhone /> Ligar
</button>


</div>: null
}

</div>
{
userData.tipo_conta === "P" &&(
<>

<AvaliacoesPlayStore
username={userData.username}
userId={userData.userid}
currentUserId={userLocal?.userid}
averageRating={userData.estrelas}
/>

</>
)
}

{
// se tu e clienete ve isso 
userData.tipo_conta === "C" &&(
<>
{/* Seção Prestadores de serviço que talvez conheces  */}
<div style={styles.cardContainer1}>
<h2 style={styles.sectionTitle}>📦 Prestadores de serviço que talvez conheça</h2>
<div style={styles.cardContainer}>
{UsersCunhecido.map(item => <AppCard key={item.id} item={item}  />)}
</div>
</div>


{/* Seção Usuários Populares */}
<h2 style={styles.sectionTitle}>🌟 Usuários Populares</h2>
<div style={styles.cardContainer1} className='cardContainer1Home'>
{userPopular.map(item => <UserCard key={item.id} item={item} />)}
</div>
</>
)
}


<ModalFeedback
isOpen={modalOpen}
onClose={() => setModalOpen(false)}
message={modalMessage}
listaSer={true}
onClick={SolicitarServico}
/>
{/*  MOdal Foto de Perfil*/ }
{showModalFotoPerfil && (
<div className="modal-overlayFPPerfil" onClick={() => setShowModalFotoPerfil(false)}>
<div className="modal-contentFPPerfil" onClick={(e) => e.stopPropagation()}>
<img
src={userData.foto ? `${Url}/${userData.foto}` : userImg}
alt="Foto em tamanho completo"
className="full-avatar"
/>
</div>
</div>
)}
{/*Modal Foto de  Capa*/}
{showModalCapa && (
<div className="modal-overlayFPPerfil" onClick={() => setShowModalCapa(false)}>
<div className="modal-contentFPPerfil" onClick={(e) => e.stopPropagation()}>
<img
src={userData.capa ? `${Url}/${userData.capa}` : placeholderimg}
alt="Capa em tamanho completo"
className="full-avatar"
/>
</div>
</div>
)}

</div>

<RodapeNavegacao />
</>
);
};

export default Perfil;

const styles = {
sectionTitle: {
fontSize: '22px',
fontWeight: 'bold',
color: '#333',
margin: '12px 0',
paddingLeft: '16px',
},
cardContainer: {
display: 'flex',
overflowX: 'scroll',
paddingLeft: '16px',
},
cardContainer1: {
marginTop:'80px'
},
};