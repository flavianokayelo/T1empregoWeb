import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import RodapeNavegacao from '../components/RodapeNavegacao';
import ListaServico from '../components/ListaServico';
import { FiSearch } from 'react-icons/fi';
import '../styles/Buscar.css';

const API_URL = 'https://t1emprego.com/api/listar_servicos.php';

export default function Buscar() {
  const [busca, setBusca] = useState('');
  const [servicos, setServicos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const[logado,setLogado] = useState([])


// Busca dados do perfil



  const loadServicos = async (pagina = 1, buscaAtual = '') => {
    

  // dados do usuario logado
const storedUser = localStorage.getItem('userData');
const parsed = JSON.parse(storedUser);
if (storedUser) {
 //console.log(parsed);
setLogado(parsed); // opcional se não estiver usando context
}

    if (isLoading) return;

    setIsLoading(true);
    try {
      const res = await axios.get(`${API_URL}?page=${pagina}&busca=${encodeURIComponent(buscaAtual)}&userid=${parsed.userid}`);
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

  useEffect(() => {
    setHasMore(true);
    setServicos([]);
    loadServicos(1, busca);
  }, [busca]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 && hasMore && !isLoading) {
        loadServicos(page + 1, busca);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [page, busca, hasMore, isLoading]);

  return (
    <div className="buscar-container">
      <Header />
      <div className="buscar-wrapper">
        <div className="buscar-content">
          
          <div className="buscar-searchbox">
            <FiSearch size={20} color="#888" />
            <input
              type="text"
              placeholder="Digite o nome do serviço "
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </div>

        <div className="buscar-servicos">
          {servicos.map(servico => (
            <ListaServico key={servico.id} item={servico} />
          ))}
          {isLoading && <p className="buscar-info">Carregando...</p>}
          {!hasMore && !isLoading && <p className="buscar-info">Todos os serviços carregados. de momento estamos sem serviços.</p>}
        </div>
      </div>
      <RodapeNavegacao />
    </div>
  );
}
