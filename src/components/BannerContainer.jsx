import React, { useEffect, useState } from 'react';
import BannerCarousel from './BannerCarousel';

const BannerContainer = () => {
const [banners, setBanners] = useState([]);
const [loading, setLoading] = useState(true);

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
    const fetchBanners = async () => {
      try {
        const response = await fetch('https://t1emprego.com/api/banners.php');
        const data = await response.json();
        //console.log(data)
        const novaData = embaralharArray(data)
        setBanners(novaData);
      } catch (error) {
        console.error('Erro ao carregar os banners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  if (loading) return <center><div style={styles.div2}><p>Carregando banners...</p></div></center>;

  return <BannerCarousel banners={banners} />;
};

export default BannerContainer;

const styles={
    div2:{
      marginTop:'130px',
    }
}