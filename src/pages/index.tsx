import {GetStaticProps} from 'next';
import { api } from '../services/api';
import {format,parseISO} from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';


type Episode= {
  id: string,
  title:string,
  members:string,
  published_at:string
}

type HomeProps = {
  episodes:Array<Episode>
}


export default function Home(props:HomeProps) {
  return (
    <h1> {JSON.stringify(props.episodes)}</h1>
  )
}

export const getStaticProps:GetStaticProps = async ()=>{
  const {data} = await api.get('episodes',{
    params:{
      _limit: 12,
      _sort: 'published_at',
      _order:'desc'
    }
  });

  console.log(data);
  const episodes = data.map(episode=>{
    
    let {
      id,title, thumbnail,members,
      description, file, published_at,
    } = episode

    let {
      url, duration
    } = file;
    
    let publishedAt = format(parseISO(published_at),'d MMM yy',{
      locale:ptBR
    });

    return {
      id,
      title,
      thumbnail,
      members,
      description,
      publishedAt,
      duration,
      url
    }    
  })

  console.log(episodes);
  return {
    props:{
      episodes
    },
    revalidate: 60*60*8
 }
}
