import React, { useEffect, useState, useContext } from 'react';
import PostItem from './PostItem';
import { UserContext } from '../contexts/UserContext';

const PostContainer = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useContext(UserContext);
// funcao qye vai por os post aleatoriamenete
function embaralharArray(array) {
  const novoArray = [...array]; // cria uma cópia para não modificar o original
  for (let i = novoArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [novoArray[i], novoArray[j]] = [novoArray[j], novoArray[i]];
  }
  return novoArray;
}

  useEffect(() => {
    let userid = 0;
    if(userData){
      userid = userData.userid
    }
   

    const fetchPosts = async () => {
      try {
        const response = await fetch(`https://t1emprego.com/api/getAllPosts.php?userid=${userid}`);
        const data = await response.json();
        //console.log('Dados da API:', data, Array.isArray(data));
         //console.log(data)
        if (Array.isArray(data)) {
         const newData = embaralharArray(data)
          setPosts(newData);
        } else {
          console.error('Resposta não é um array:', data);
        }
      } catch (error) {
        console.error('Erro ao carregar os posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <center><div style={styles.div2}><p>Carregando banners...</p></div></center>;

  return <PostItem item={posts} />;
};

export default PostContainer;

const styles = {
  div2: {
    marginTop: '130px',
  }
};
