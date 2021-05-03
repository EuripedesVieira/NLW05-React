import {createContext, useContext} from 'react';
import { Episode } from '../../types/espisode';



type PlayerContextProps={
	episodeList:Episode[],
	currentEpisodeIndex:number,
	isPlaying:boolean,
	isLoop:boolean,
	isShuffle:boolean,
	play:(episode:Episode)=>void,
	playList:(list:Episode[],index:number)=>void,
	togglePlay:()=>void,
	toggleLoop:()=>void,
	toggleShuffle:()=>void,
	setPlayingState:(state:boolean)=>void,
	playNext:()=>void,
	playPrevious:()=>void,
	clearPlayerState:()=>void
  
}

export const PlayerContext = createContext({}as PlayerContextProps);
export const usePlayer = ()=>{
	return useContext(PlayerContext);
}