import {GetStaticProps} from 'next';
import Image from 'next/image';
import { api } from '../services/api';
import {format,parseISO} from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { covnertDurationToTimeString } from '../utils/returnTimeString';
import styles from './home.module.scss';
import { HomeProps,Episode } from '../types/espisode';
import Link from 'next/link';
import { useContext } from 'react';
import { PlayerContext } from '../contents/player/playerContext';
import Head from 'next/head';


export default function Home({allEpisodes,latestEpisodes}:HomeProps) {

  const {playList} = useContext(PlayerContext);

  const episodeList = [...latestEpisodes,...allEpisodes];

  const hendlerLatestEpisodes=()=>{
    return latestEpisodes.map((episode:Episode,index:number)=>{
      return(
          <li key={episode.id}>
            <Image width={192} height={192} objectFit="cover" 
              src={episode.thumbnail} alt={episode.title}/>
            <div className={styles.episodeDetails}>
              <Link href={`episodes/${episode.id}`}>
                <a>{episode.title}</a>
              </Link>
              <p>{episode.members}</p>
              <span>{episode.publishedAt}</span>
              <span>{episode.durationAsString}</span>
            </div>
            <button onClick={()=>{
              playList(episodeList,index)
            }}>
              <img src="/play-green.svg" alt="tocar episódio"/>
            </button>
          </li>
      )
    })
  }


  const handlerAllEpisodes= ()=>{
    return allEpisodes.map((episode:Episode,index:number)=>{
      return(
          <tr key={episode.id}>
            <td style={{width: 72}}>
              <Image
                width={120}
                height={120}
                src={episode.thumbnail}
                alt={episode.title}
                objectFit="cover"
              />
            </td>
            <td>
              <Link href={`episodes/${episode.id}`}>
                <a>{episode.title}</a>
              </Link>
            </td>
            <td>{episode.members}</td>
            <td style={{width: 100}}>{episode.publishedAt}</td>
            <td>{episode.durationAsString}</td>
            <td>
              <button onClick={()=>{
                playList(episodeList,index+latestEpisodes.length)
              }}>
                <img src="/play-green.svg" alt="tocar episódio"/>
              </button>
            </td>
          </tr>
      )
    })
  }


  return ( 
    <div className={styles.homepage}>
      <Head>
        <title>Home | Podcastr</title>
      </Head>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>
        <ul>
          {hendlerLatestEpisodes()}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>
        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {handlerAllEpisodes()}
          </tbody>
        </table>
      </section>
    </div>
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

    let durationAsString = covnertDurationToTimeString(Number(duration));

    return {
      id,
      title,
      thumbnail,
      members,
      description,
      publishedAt,
      durationAsString,
      url,
      duration
    }    
  })

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props:{
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60*60*8
 }
}
