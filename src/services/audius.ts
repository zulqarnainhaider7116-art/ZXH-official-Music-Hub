import type { AudiusTrack, Track } from '../types/music';
const APP_NAME='ZXH_MUSIC'; const BASE_URL='https://api.audius.co/v1';
async function fetchAudius<T>(endpoint:string,params:Record<string,string|number>={}):Promise<T>{
 const url=new URL(`${BASE_URL}${endpoint}`);url.searchParams.set('app_name',APP_NAME);Object.entries(params).forEach(([k,v])=>url.searchParams.set(k,String(v)));
 const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),12000);
 try{const res=await fetch(url.toString(),{signal:controller.signal,headers:{Accept:'application/json'}});if(!res.ok)throw new Error(`Audius API error: ${res.status} ${res.statusText}`);const json=await res.json();return json.data??json;}finally{clearTimeout(timeout);}
}
export function mapAudiusTrack(t:AudiusTrack):Track{
 const artwork=t.artwork?.['480x480']||t.artwork?.['150x150']||t.artwork?.['1000x1000']||`https://picsum.photos/seed/${t.id}/400/400`;
 return{id:t.id,title:t.title||'Unknown Track',artist:t.user?.name||t.user?.handle||'Unknown Artist',artistId:t.user?.id,artistArtwork:t.user?.profile_picture?.['480x480']||t.user?.profile_picture?.['150x150']||artwork,duration:t.duration||0,artwork,streamUrl:`${BASE_URL}/tracks/${t.id}/stream?app_name=${APP_NAME}`,genre:t.genre,playCount:t.play_count};
}
export async function getTrendingTracks(limit=20,time:'week'|'month'|'year'|'allTime'='week'):Promise<Track[]>{try{const data=await fetchAudius<AudiusTrack[]>('/tracks/trending',{limit,time});return(Array.isArray(data)?data:[]).map(mapAudiusTrack);}catch(e){console.error('Failed to fetch trending tracks',e);return[];}}
export async function searchTracks(query:string,limit=20):Promise<Track[]>{if(!query.trim())return[];try{const data=await fetchAudius<AudiusTrack[]>('/tracks/search',{query,limit});return(Array.isArray(data)?data:[]).map(mapAudiusTrack);}catch(e){console.error('Search failed',e);return[];}}
export async function getArtistTracks(artistId:string,limit=30):Promise<Track[]>{if(!artistId)return[];try{const data=await fetchAudius<AudiusTrack[]>(`/users/${encodeURIComponent(artistId)}/tracks`,{limit});return(Array.isArray(data)?data:[]).map(mapAudiusTrack);}catch(e){console.error('Artist tracks failed',e);return[];}}
export async function getTrack(id:string):Promise<Track|null>{try{const data=await fetchAudius<AudiusTrack>(`/tracks/${id}`);return data?mapAudiusTrack(data):null;}catch{return null;}}
export function getStreamUrl(trackId:string):string{return`${BASE_URL}/tracks/${trackId}/stream?app_name=${APP_NAME}`;}
