import React, { useEffect, useState } from 'react';
import UserCard from '../components/UserCard';
import userImg from '../assets/user_male.jpg';
import Header from '../components/Header';
import RodapeNavegacao from '../components/RodapeNavegacao';

const Url = "https://t1emprego.com";
import { FiSearch } from 'react-icons/fi';

import '../styles/PrestadorServico.css';

export default function PrestadorServico() {
  const [users, setUsers] = useState([]);
  const [busca, setBusca] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState([]);

  const loadUsers = async (pageNumber = 1, buscaAtual = '') => {

    const storedUser = localStorage.getItem('userData');
     const parsed = JSON.parse(storedUser);
    if (storedUser) {
  
      setUserData(parsed);
    }


    if (isLoading) return;
    setIsLoading(true);

    try {
      const res = await fetch(`${Url}/api/listar_prestadores.php?page=${pageNumber}&busca=${buscaAtual}&userid=${parsed.userid}`);
      const data = await res.json();
       /// console.log(data)

      if (data.users?.length > 0) {
        setUsers(prev => pageNumber === 1 ? data.users : [...prev, ...data.users]);
        setPage(pageNumber);
        setHasMore(true);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Erro ao buscar prestadores:', error);
    } finally {
      setIsLoading(false);
    }
  };



  useEffect(() => {
     
    loadUsers(1, busca);
  }, [busca])

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 && hasMore && !isLoading) {
        loadUsers(page + 1, busca);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [page, busca, hasMore, isLoading]);

  return (
    <div className="prestador-container">
      <Header />
      <div className="prestador-content">
        <div className='contaner-Buscar'>
         
        <div className="prestador-searchbox">
          <FiSearch size={20} color="#888" />
          <input
            type="text"
            placeholder="Digite o nome  do prestador de serviço"
            value={busca}
            onChange={(e) => {
              setUsers([]);
              setHasMore(true);
              setBusca(e.target.value);
            }}
          />
        </div>

          </div>
          
        <h2 className="prestador-title">Prestadores de Serviço Disponivel</h2>
        <div className="prestador-list">
          {users.map((user) => (
            <UserCard key={user.id} item={user} />
          ))}
          {isLoading && <p className="prestador-info">Carregando...</p>}
          {!hasMore && <p className="prestador-info">Todos os prestadores foram carregados.</p>}
        </div>
      </div>
      <RodapeNavegacao />
    </div>
  );
}
