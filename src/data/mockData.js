import flayer4 from '../assets/cover1.jpg'
import flayer2 from '../assets/flaye2.jpg'
import flayer1 from '../assets/flayer1.jpg'

const data = {

  favoritos: [
    {
      id: 1,
      title: 'Quebra Tijolos Quest',
      category: 'Puzzle',
      rating: 4.4,
      image: flayer4,
    },
    {
      id: 2,
      title: 'WWE SuperCard',
      category: 'Cartas',
      rating: 4.3,
      image: flayer1,
    },
    {
      id: 3,
      title: 'Asphalt Legends Unite',
      category: 'Corridas',
      rating: 4.4,
      image: flayer2,
    },
  ],
  recentes: [
    {
      id: 4,
      title: 'Among Gods',
      category: 'RPG',
      rating: 4.2,
      image: 'https://via.placeholder.com/300x150?text=Among+Gods',
    },
    {
      id: 5,
      title: 'Sky Warriors',
      category: 'Ação',
      rating: 4.1,
      image: 'https://via.placeholder.com/300x150?text=Sky+Warriors',
    },
  ],

  // Mock de dados
 bannerData : [
  { id: '1', title: 'Antonio Pedro', image: flayer2, rating: '4.8', buttonText: 'Ver perfil' },
  { id: '2', title: 'KingArt', image: flayer1, rating: '4.7', buttonText: 'Ver perfil' },
  { id: '3', title: 'KingArt', image: flayer4, rating: '4.7', buttonText: 'Ver perfil' },
]

};

export default data;