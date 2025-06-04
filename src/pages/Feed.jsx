import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import CategoryFilter from '../components/CategoryFilter';
import Servico from '../components/Servico';
import PostItem from '../components/PostItem';
import RodapeNavegacao from '../components/RodapeNavegacao';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import PostContainer from '../components/PostContainer';
import './Feed.css'
import PrimaryBtn from '../components/PrimaryBtn';
import PageLoading from '../components/PageLoading';
export default function Feed() {
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();

  const [visibleCount, setVisibleCount] = useState(10);
  const [showServico, setShowServico] = useState(false);



  const handleScroll = () => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const bodyHeight = document.body.offsetHeight;

    if (scrollY + windowHeight >= bodyHeight - 200) {
      setVisibleCount((prev) => prev + 5);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    if (visibleCount >= 10 && !showServico) {
      setShowServico(true);
    }
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [visibleCount, showServico]);


// verificar se esta logado ou nao 
if (!userData) {
    return (
       <PageLoading/>
    );
  }

  return (
    <div style={styles.container} className='container'>
      <Header />

      <div style={styles.section} className='sectionPost'>
        <h2 style={styles.title}>Atualizações Recentes</h2>
        <PostContainer/>
      </div>

       <div style={styles.container2}> 
        

      {showServico && (
        <div style={styles.section} className='sectionSer'>
          <h2 style={styles.title}>Serviços em Destaque</h2>
          <Servico />
        </div>
      )}
       </div>

      <RodapeNavegacao />
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
    marginTop: '170px',
    marginBottom: '100px',
    

  },
  container2: {
    overflow: 'hidden',
      maxWidth: '600px',
      margin: 'auto'
    
  },
  section: {
    padding: '20px 15px',
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },

    // Media Queries inline-style workaround (handled via width)
  '@media (min-width: 600px)': {
    postItemContainer: {
      flex: '0 0 33.33%',
    },
  },
};
