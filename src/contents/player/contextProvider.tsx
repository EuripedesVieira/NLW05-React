import { ReactNode, useState } from "react";
import { Episode } from "../../types/espisode";
import { PlayerContext } from "./playerContext";

type PlayerContextData ={
	children:ReactNode
}


export default function PlayerContextProvider({children}:PlayerContextData){
	
	const [episodeList, setEpisodeList]=useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
	const [isLoop, setIsLoop] = useState(false);
	const [isShuffle, setIsShuffle] = useState(false);


  function play(episode){
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function togglePlay(){
    setIsPlaying(!isPlaying)
  }

  function toggleLoop(){
    setIsLoop(!isLoop)
  }

	function toggleShuffle(){
    setIsShuffle (!isShuffle)
  }

  function setPlayingState(state:boolean){
    setIsPlaying(state);
  }


	function playList(list:Episode[], index:number){
		setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
	}

	function playNext() {

		if(isShuffle){
			const nextRandomEpisodeIndex = Math.floor(Math.random()*episodeList.length);
			setCurrentEpisodeIndex(nextRandomEpisodeIndex);
		}else{
			const nextEpisodeIndex = currentEpisodeIndex+1;
			if(nextEpisodeIndex<episodeList.length) setCurrentEpisodeIndex(nextEpisodeIndex);
			else clearPlayerState();	
		}
	}

	function clearPlayerState(){
		setEpisodeList([]);
		setCurrentEpisodeIndex(0);
	}

	function playPrevious() {
		const previousEpisodeIndex = currentEpisodeIndex-1
		if(previousEpisodeIndex>=0) setCurrentEpisodeIndex(previousEpisodeIndex);
	}

  return (
    <PlayerContext.Provider value={
			{	
				episodeList,
				currentEpisodeIndex,
				isPlaying,
				isLoop,
				isShuffle,
				play,
				togglePlay,
				toggleLoop,
				toggleShuffle,
				setPlayingState,
				playList,
				playNext,
				playPrevious,
				clearPlayerState
			}
		}>
			{children}
		</PlayerContext.Provider>	
	)	
}