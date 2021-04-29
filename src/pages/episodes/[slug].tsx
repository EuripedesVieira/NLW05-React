import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router'
import { api } from '../../services/api';
import {format,parseISO} from 'date-fns';
import { covnertDurationToTimeString } from '../../utils/returnTimeString';
import ptBR from 'date-fns/locale/pt-BR';
import Image from 'next/image';
import styles from './episode.module.scss';
import { Episode } from '../../types/espisode';
import Link from 'next/link';

export type HomeProps = {
	episode:Episode
}



export default function Episodes({episode}:HomeProps){
	const router = useRouter();
	return(
		<div className={styles.episode}>
			<div className={styles.thumbnailContainer}>
				<Link href="/">
					<button>
						<img src="/arrow-left.svg" alt="Voltar"/>
					</button>
				</Link>
				<Image width={700}
					height={160}
					src={episode.thumbnail}
					objectFit="cover"
				/>
				<button>
					<img src="/play.svg" alt="Tocar episódio"/>
				</button>
			</div>
			<header>
				<h1>{episode.title}</h1>
				<span>{episode.members}</span>
				<span>{episode.publishedAt}</span>
				<span>{episode.durationAsString }</span>
			</header>
			<div className={styles.description}
				dangerouslySetInnerHTML={{__html:episode.description}}>
			</div>

		</div>
	)
}


export const getStaticPaths:GetStaticPaths= async ()=>{
	return {
		paths:[],
		fallback: 'blocking'
	}
}

export const getStaticProps:GetStaticProps = async(ctx)=>{
	const { slug } = ctx.params
	const { data }  = await api.get(`/episodes/${slug}`);


	let {
		id,title, thumbnail,members,
		description, file, published_at,
	} = data

	let {
		url, duration
	} = file;
	
	let publishedAt = format(parseISO(published_at),'d MMM yy',{
		locale:ptBR
	});

	let durationAsString = covnertDurationToTimeString(Number(duration));

	const episode = {
		id,
		title,
		thumbnail,
		members,
		description,
		publishedAt,
		durationAsString,
		url
	}

	return {
		props:{
			episode
		},
		revalidate: 60*60*24
	}
}