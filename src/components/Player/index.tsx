import { useContext, useDebugValue, useEffect, useRef, useState } from 'react'
import { PlayerContext } from '../../contents/player/playerContext'
import Image from 'next/image'
import Slider from 'rc-slider'
import styles from './styles.module.scss' 
import 'rc-slider/assets/index.css'
import { covnertDurationToTimeString } from '../../utils/returnTimeString'

export function Player(){
	const {episodeList,
		currentEpisodeIndex, 
		isPlaying,
		isLoop,
		isShuffle,
		togglePlay,
		setPlayingState,
		playNext,
		playPrevious,
		toggleLoop,
		toggleShuffle,
		clearPlayerState
	} = useContext(PlayerContext);
	const episode = episodeList[currentEpisodeIndex];
	const audioRef = useRef<HTMLAudioElement>(null);
	const [progress,setProgress] =useState(0)

	useEffect(()=>{
		console.log(currentEpisodeIndex);
		console.log(episodeList);
		console.log(episodeList.length)
		if(audioRef.current){
			isPlaying?audioRef.current.play():
			audioRef.current.pause()
		}
	},[isPlaying])


	function setupProgressListener(){
		audioRef.current.currentTime=0;
		audioRef.current.addEventListener('timeupdate',()=>{
			let time = Math.floor(audioRef.current.currentTime);
			setProgress(time);
		})
	}

	function handleSeek(amout:number){
		audioRef.current.currentTime=amout;
		setProgress(amout);
	}

	return(
		<div className={styles.playerContainer}>
			<header>
				<img src="/playing.svg" alt="tocando agora"/>
				<strong>Tocando agora {episode?.title}  </strong>
			</header>

			{
				episode ? (
					<div className={styles.currentEpisode}>
						<Image width={592}
							height={592}
							src={episode.thumbnail}
							objectFit="cover"
						/>
						<strong>{episode.title}</strong>
						<p>{episode.members}</p>
					</div>
				) : (
				<div className={styles.emptyPlayer}>
					<strong>Selecione um podcast para ouvir</strong>
				</div>
				)
			}

			<footer className={!episode?styles.empty:null}>
				<div className={styles.progress}>
					<span>{covnertDurationToTimeString(progress)}</span>
					<div className={styles.slider}>
						{
							episode ? (
								<Slider
									trackStyle={{backgroundColor: '#04d361'}}
									railStyle={{backgroundColor: '#9f75ff'}}
									handleStyle={{borderColor: '#04d361', borderWidth:4}}
									max={episode.duration}
									value={progress}
									onChange={handleSeek}
								/>
							): (
								<div className={styles.emptySlider}/>
							)
						}
					</div>
					<span>{episode?.durationAsString ?? '00:00'}</span>
				</div>

				{
					episode && (
						<audio src={episode.url}
						autoPlay
						ref={audioRef}
						loop={isLoop}
						onPlay={()=>{setPlayingState(true)}}
						onPause={()=>{setPlayingState(false)}}
						onLoadedMetadata={setupProgressListener}
						onEnded={playNext}
						/>
					)
				}
			

				<div className={styles.buttons}>
					<button disabled={!episode || episodeList.length===1}
						onClick={toggleShuffle}  
						className={isShuffle ? styles.isActive : null}	
					>
						<img src="/shuffle.svg" alt="Embaralhar"/>
					</button>
					<button disabled={!episode || currentEpisodeIndex==0} onClick={playPrevious}>
						<img src="/play-previous.svg" alt="tocar anterior"/>
					</button>
					<button className={styles.playButton} 
						disabled={!episode}
						onClick={togglePlay}
						>
						{
							isPlaying? 	<img src="/pause.svg" alt="tocar"/>
							:	<img src="/play.svg" alt="tocar"/>
						}
					</button>
					<button disabled={!episode || (currentEpisodeIndex+1==episodeList.length && !isShuffle)} onClick={playNext}>
						<img src="/play-next.svg" alt="tocar próxima"/>
					</button>
					<button disabled={!episode} 
						onClick={toggleLoop}  
						className={isLoop ? styles.isActive : null}	
					>
						<img src="/repeat.svg" alt="Repetir"/>
					</button>
				</div>
			</footer>
		</div>
	)
}