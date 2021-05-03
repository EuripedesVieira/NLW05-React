export type Episode={
  id: string,
  title:string,
  members:string,
  publishedAt:string,
  thumbnail:string,
  description:string,
  durationAsString:string,
  duration:number,
  url:string


}

export type HomeProps = {
	latestEpisodes:Array<Episode>,
	allEpisodes:Array<Episode>
}

