export interface AudiusUser{id:string;handle:string;name:string;profile_picture?:{'150x150'?:string;'480x480'?:string;'1000x1000'?:string}}
export interface AudiusTrack{id:string;title:string;user:AudiusUser;duration:number;artwork?:{'150x150'?:string;'480x480'?:string;'1000x1000'?:string};genre?:string;mood?:string;play_count?:number;favorite_count?:number;permalink?:string;stream?:{url?:string};is_streamable?:boolean}
export interface Track{id:string;title:string;artist:string;artistId?:string;artistArtwork?:string;duration:number;artwork:string;streamUrl:string;genre?:string;playCount?:number;isLiked?:boolean}
export interface Playlist{id:string;name:string;description?:string;artwork:string;trackCount:number;tracks?:Track[]}
export interface Category{id:string;name:string;image:string;gradient:string}
export type PlayerState={currentTrack:Track|null;isPlaying:boolean;queue:Track[];currentIndex:number;volume:number;isMuted:boolean;isShuffle:boolean;repeatMode:'off'|'all'|'one';progress:number;duration:number;isLoading:boolean;error:string|null};
