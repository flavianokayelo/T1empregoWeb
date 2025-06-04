import React, { useState,useEffect } from 'react';
import Header from '../components/Header.jsx';
import AppCard from '../components/AppCard.jsx';
import '../styles/Home.css'; // Importe o CSS criado
import UserCard from '../components/UserCard';
import InterestList from '../components/InterestList';
import RodapeNavegacao from '../components/RodapeNavegacao';
import Servico from '../components/Servico.jsx';
import PageLoading from '../components/PageLoading';
import { Link, useNavigate } from 'react-router-dom'; // 
import userImg from '../assets/user_male.jpg';
import  BannerContainer from '../components/BannerContainer.jsx'
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import ModalBoasVindas from '../components/ModalBoasVindas.jsx';
import ModalFeedback from '../components/ModalFeedback.jsx';
import PrimaryBtn from '../components/PrimaryBtn.jsx';
export default function Home() {
const [activeCategory, setActiveCategory] = useState('Hoje');
const navigate = useNavigate(); // ⬅️ Atualizado aqui
const { userData } = useContext(UserContext);
const [recommendedUsers,setRecommendedUsers] = useState([])
const [UsersCunhecido,setUsersCunhecido] = useState([])
const [logado, setUserLogado] = useState(null);
const[userPopular,setUserPopular] = useState([])
const [modalOpen, setModalOpen] = useState(false);
const [modalMessage, setModalMessage] = useState('');

// funcao de mensagem de boas vinda no T1emprego

function MensagemBoasVindas({ tipoConta, username,userid}) {
  if (tipoConta === "C") {
    return (
      <>
        <p className="fs-7 text-dark">
          Bem-vindo ao <strong>T1emprego</strong>, a plataforma ideal para quem busca serviços técnicos profissionais e para prestadores de serviços.
        </p>
        <p className="fs-7 text-dark">
          <span className="text-t1emprego"><b>{username}</b></span>, você acaba de criar uma conta como cliente. Agora pode pesquisar, contratar e avaliar prestadores de serviço com base na qualidade dos seus trabalhos.
        </p>
        <p className="fs-7 text-dark">
          Se você também exerce uma profissão, pode facilmente mudar sua conta para prestador de serviço, começar a ganhar dinheiro e ser avaliado pelos seus clientes.
        </p>
        <p className="fs-7 text-dark">
          Para garantir a melhor experiência, por favor, complete seu perfil com dados pessoais verdadeiros. Seja um prestador solo, uma empresa ou um usuário, clique em “Preencher Currículo Vitae” para começar.
        </p>
        <div className='Maistard'>
          <button className='BtnMaistarde' onClick={()=>(MaisTarde(userid))}>Preencher mais tarde!</button>
        </div>
      </>
    );
  } else if (tipoConta === "P") {
    return (
      <>
        <p className="fs-7 text-dark">
          Bem-vindo ao <strong>T1emprego</strong>, a plataforma que conecta prestadores de serviços técnicos a quem precisa deles.
        </p>
        <p className="fs-7 text-dark">
          <span className="text-t1emprego"><b>{username}</b></span>, você acaba de criar uma conta como prestador de serviço. Agora pode compartilhar fotos dos seus trabalhos, mostrar seu talento e acompanhar seu progresso pelos comentários e avaliações dos seus clientes!
        </p>
        <p className="fs-7 text-dark">
          Para garantir que você seja facilmente encontrado e ofereça a melhor experiência, complete seu perfil com informações verdadeiras. Seja você um profissional solo ou uma empresa, clique em “Preencher Currículo Vitae” para começar.
        </p>
        <div className='Maistard'>
          <button className='BtnMaistarde' onClick={()=>(MaisTarde(userid))}>Preencher mais tarde!</button>
        </div>
      </>
    );
  }

  return null;
}
// funcao preecher a mais tarde

async function MaisTarde (userid) {
try {
const res = await fetch('https://t1emprego.com/api/maisTarde.php', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
},
body: JSON.stringify({ userid:userid}),
});

const data = await res.json();
//console.log(data)

if (data.sms === 1) {
   navigate('/Servicos');
} else {
console.error(data);

}

} catch (err) {
console.error('Erro no a  amsi tarde', err);
}
}



useEffect(() => {
const storedUser = localStorage.getItem('userData');
const isLoggedIn = localStorage.getItem('isLoggedIn');

   if (isLoggedIn === 'false') {
      navigate('/Login');
    }

if (storedUser) {
try {
const parsed = JSON.parse(storedUser);
//console.log(parsed);
setUserLogado(parsed);





// ✅ busca o perfil
async function fetchProfile() {
try {
const res = await fetch('https://t1emprego.com/api/getUserData.php', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
},
body: JSON.stringify({ userid: parsed.userid}),
});

const data = await res.json();
//console.log(data)

if (data.error) {
console.error(data.error);
} else {
  // atualizando ddos do usuario 
  setUserLogado(data)
// ✅ mostra o modal se não tem currículo
if (data.tem_curriculo == 0) {
setModalMessage(<MensagemBoasVindas tipoConta={parsed.tipo_conta} username={parsed.username} userid={parsed.userid}/>);
setModalOpen(true);
}

}

} catch (err) {
console.error('Erro ao carregar o perfil:', err);
}
}

fetchProfile(); // ✅ chamada movida para dentro do try



// ✅ setar user onlie
/*fetch(`https://t1emprego.com/api/setUserOnline.php?userid=${parsed.userid}`)
.then(res => res.json())
.then(data => {
console.log(data)
})
.catch(err => console.error('Erro ao buscar usuários recomendados:', err));
*/
// ✅ usuários recomendados
fetch(`https://t1emprego.com/api/getRecomendados.php?userid=${parsed.userid}`)
.then(res => res.json())
.then(data => {
if (Array.isArray(data)) setRecommendedUsers(data);
})
.catch(err => console.error('Erro ao buscar usuários recomendados:', err));

// ✅ usuários populares
fetch(`https://t1emprego.com/api/getUserPopular.php?userid=${parsed.userid}`)
.then(res => res.json())
.then(data => {
if (Array.isArray(data)) setUserPopular(data);
})
.catch(err => console.error('Erro ao buscar usuários populares:', err));

// ✅ usuários que talvez conheces
fetch('https://t1emprego.com/api/getUserCunhecido.php', {
method: 'POST',
body: JSON.stringify(parsed.userid),
})
.then(res => res.json())
.then(data => {
 
if (Array.isArray(data)) setUsersCunhecido(data);
})
.catch(err => console.error('Erro ao buscar Prestador de serviço que talvez conheces:', err));
} catch (err) {
console.error('Erro ao parsear userData:', err);
}
}
}, []);



// verificar se esta logado ou nao 
if (!logado) {
    return (
     <div className="tela-inicial">
  <div className="card-bemvindo">
    <h1>Bem-vindo ao <span className="destaque">T1emprego</span>!</h1>
    <p>
      Conectamos <strong>Profissionais Técnicos</strong> a quem busca <strong>serviços confiáveis</strong>. 
      Faça parte da nossa comunidade e transforme sua experiência!
    </p>
    <p>
      Aqui, o <strong>Profissional</strong> é avaliado diretamente pelos <strong>Clientes</strong>, garantindo transparência e qualidade.
    </p>
    <p>
      Os <strong>Profissionais</strong> podem divulgar seus serviços e compartilhar posts sobre seus trabalhos.
    </p>
    <p>
      Os <strong>Clientes</strong> solicitam serviços com facilidade, sem sair de casa.
    </p>
    <p>
      Antes de contratar, o <strong>Cliente</strong> pode conferir os comentários e avaliações no perfil do <strong>Profissional</strong>.
    </p>
    <button className="botao" onClick={() => navigate("/Register")}>
      Criar Conta
    </button>
    <button className="botao" onClick={() => navigate("/Login")}>
      Iniciar Sessão
    </button>
  </div>
</div>

    );
  }



const Goprestador = (categoria) => {
navigate(`/PrestadorServico`); // ⬅️ Atualizado aqui
console.log('Selecionou:', categoria);
};



//console.log(logado)





return (
<div className='home-container'>
<div>
<Header />

{/* Seção Banner */}
<BannerContainer />

{/* Seção Categorias de Interesse */}
<InterestList onSelect={(categoria) => Goprestador(categoria)} />

{/* Seção Recomendados */}
<h2 style={styles.sectionTitle}>📦 Recomendados</h2>
<div style={styles.cardContainer} className='cardContainerHome'>
{recommendedUsers.map(item => <AppCard key={item.id} item={item}/>)}
</div>

{/* Seção Serviços Recomendados */}
<h2 style={styles.sectionTitle}>🌟 Serviços Recomendados</h2>
<Servico />

{/* Seção Prestadores de serviço que talvez conheces  */}
<h2 style={styles.sectionTitle}>📦 Prestadores de serviço que talvez conheça</h2>
<div style={styles.cardContainer} className='cardContainerHome'>
{UsersCunhecido.map(item => <AppCard key={item.id} item={item}  />)}
</div>

{/* Seção Usuários Populares */}
<h2 style={styles.sectionTitle}>🌟 Usuários Populares</h2>
<div style={styles.cardContainer1} className='cardContainer1Home'>
{userPopular.map(item => <UserCard key={item.id} item={item} />)}
</div>

<ModalBoasVindas
isOpen={modalOpen}
onClose={() => setModalOpen(false)}
message={modalMessage}
/>

<RodapeNavegacao />
</div>
</div>
);
}

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
};
