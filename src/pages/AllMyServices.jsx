import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import RodapeNavegacao from '../components/RodapeNavegacao';
import { useNavigate, useParams } from 'react-router-dom';
import ListaServico from '../components/ListaServico';
import { FiSearch } from 'react-icons/fi';
import PrimaryBtn from '../components/PrimaryBtn';
import PageLoading from '../components/PageLoading';
import "../styles/AllMySertvices.css"
const API_URL = 'https://t1emprego.com/api/Mylistar_servicos.php'; // ajuste a rota correta

const Url = "https://t1emprego.com";
export default function AllMyServices() {
  const [busca, setBusca] = useState('');
  const [servicos, setServicos] = useState([]);
  const [page, setPage] = useState(1);
   const[userData,setUserData] = useState([]);
   const[perfilData, setPerfilData] = useState([])
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navegar = useNavigate()
   const { userid } = useParams();

   


        // Busca dados do perfil
        useEffect(() => {
        //console.log(userLocal);

        // dados do usuario logado
        const storedUser = localStorage.getItem('userData');

        if (storedUser) {
        const parsed = JSON.parse(storedUser);
        /// console.log(parsed);
        setUserData(parsed); // opcional se não estiver usando context

        async function fetchProfile() {


        try {
        const res = await fetch(`${Url}/api/user_profile.php`, {
        method: 'POST',
        body: JSON.stringify({ userid: userid,tipo_conta:parsed.tipo_conta }),
        });

        const data = await res.json();
        //console.log(data)

        if (data.error) {
        console.error(data.error);
        } else {
        setPerfilData(data);

        }
        } catch (err) {
        console.error('Erro ao carregar o perfil:', err);
        }
        }

        fetchProfile();
        }



        }, []);



  const loadServicos = async (pagina = 1, buscaAtual = '') => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const res = await axios.get(`${API_URL}?page=${pagina}&busca=${encodeURIComponent(buscaAtual)}&userid=${userid}`);
      const novos = res.data?.servicos || [];

      if (novos.length > 0) {
        setServicos(prev => pagina === 1 ? novos : [...prev, ...novos]);
        setPage(pagina);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Busca inicial e ao digitar
  useEffect(() => {


    setHasMore(true);
    setServicos([]);
    loadServicos(1, busca);
  }, [busca]);

  // Scroll infinito
  useEffect(() => {
     //console.log(userid)
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 && hasMore && !isLoading) {
        loadServicos(page + 1, busca);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [page, busca, hasMore, isLoading]);


   if (!userData || !userData.userid) {
  return <PageLoading/>
}

  return (
    <div style={styles.container} className='ContainerMobileAllSer'>
      <Header isPerfil={true}/>

      <center> 
      <div>
          <h2 style={styles.title}>Lista de serviços de : <b>{perfilData.username}</b></h2>

        {
          userData.username === perfilData.username &&(
            <>
            <PrimaryBtn onClick={()=>{navegar('/CriarServico')}}> Adicionar Serviço</PrimaryBtn>
            </>
          )
        }
      </div>
      
      </center>
      <div style={styles.container2}>
        <div style={styles.content} className='ContentMobile'>
          <h2 style={styles.title}>🔎 Pesquisar Serviços</h2>
          <div style={styles.searchBox} className='SAerMobile'>
            <FiSearch size={20} color="#888" />
            <input
              type="text"
              placeholder="Digite o nome do serviço"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.servicoList} className='ServicoListaMobile'>
          {servicos.map(servico => (
            <ListaServico userid={userid} key={servico.id} item={servico} onDelete={(id) => {
    setServicos(prev => prev.filter(s => s.id !== id));
  }} />
          ))}
          {isLoading && <p style={{ textAlign: 'center' }}>Carregando...</p>}
          {!hasMore && !isLoading && <p style={{ textAlign: 'center' }}>Todos os serviços carregados.</p>}
        </div>
      </div>

      <RodapeNavegacao />
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f9f9f9',
    padding: '40px 10px 15px',
    marginTop: '140px',
    marginBottom: '100px',
  },
  container2: {
    maxWidth: '600px',
    margin: 'auto',
  },
  title: {
    fontSize: '22px',
    fontWeight: 'bold',
    marginBottom: '15px',
  },
  content: {
    padding: '15px 10px',
  },
  servicoList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    paddingBottom: '30px',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '10px 12px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
  },
  input: {
    marginLeft: '10px',
    flex: 1,
    fontSize: '16px',
    border: 'none',
    outline: 'none',
    width: '100%',
  },
};
