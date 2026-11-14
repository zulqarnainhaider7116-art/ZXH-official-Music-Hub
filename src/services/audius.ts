import type { AudiusTrack, Track } from '../types/music';
const APP_NAME='ZXH_MUSIC'; const BASE_URL='https://api.audius.co/v1';
async function fetchAudius<T>(endpoint:string,params:Record<string,string|number>={}):Promise<T>{
 const url=new URL(`${BASE_URL}${endpoint}`);url.searchParams.set('app_name',APP_NAME);Object.entries(params).forEach(([k,v])=>url.searchParams.set(k,String(v)));
 const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),12000);
 try{const res=await fetch(url.toString(),{signal:controller.signal,headers:{Accept:'application/json'}});if(!res.ok)throw new Error(`Audius API error: ${res.status} ${res.statusText}`);const json=await res.json();return json.data??json;}finally{clearTimeout(timeout);}
}
function escapeSvg(value:string):string{return value.replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[char]||char));}
function makeTrackCover(track:Pick<Track,'id'|'title'|'artist'>):string{
 const seed=Array.from(track.id).reduce((n,c)=>n+c.charCodeAt(0),0);const hue=seed%360;const title=escapeSvg(track.title.slice(0,34));const artist=escapeSvg(track.artist.slice(0,36));
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="hsl(${hue},78%,34%)"/><stop offset="1" stop-color="hsl(${(hue+85)%360},78%,12%)"/></linearGradient><radialGradient id="r"><stop stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><rect width="800" height="800" rx="48" fill="url(#g)"/><circle cx="650" cy="150" r="310" fill="url(#r)"/><circle cx="400" cy="340" r="170" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width="2"/><circle cx="400" cy="340" r="125" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="2"/><circle cx="400" cy="340" r="80" fill="#fff" fill-opacity=".08" stroke="#fff" stroke-opacity=".35"/><path d="M150 340h65l28-75 42 150 45-110 42 70 38-35 38 0 35-75 42 150 35-75h75" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" opacity=".88"/><text x="64" y="635" fill="#fff" font-family="Arial,sans-serif" font-size="42" font-weight="700">${title}</text><text x="66" y="690" fill="#fff" fill-opacity=".72" font-family="Arial,sans-serif" font-size="27">${artist}</text><text x="66" y="755" fill="#fff" fill-opacity=".85" font-family="Arial,sans-serif" font-size="20" letter-spacing="8">ZXH OFFICIAL · MUSIC</text></svg>`;
 return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
export function mapAudiusTrack(t:AudiusTrack):Track{
 const artwork=t.artwork?.['480x480']||t.artwork?.['1000x1000']||t.artwork?.['150x150']||makeTrackCover({id:t.id,title:t.title||'Unknown Track',artist:t.user?.name||t.user?.handle||'Unknown Artist'});
 return{id:t.id,title:t.title||'Unknown Track',artist:t.user?.name||t.user?.handle||'Unknown Artist',artistId:t.user?.id,artistArtwork:t.user?.profile_picture?.['480x480']||t.user?.profile_picture?.['150x150']||artwork,duration:t.duration||0,artwork,streamUrl:`${BASE_URL}/tracks/${t.id}/stream?app_name=${APP_NAME}`,genre:t.genre,playCount:t.play_count};
}
// Keep real Audius cover art, but replace repeated album covers within a collection with a stable track-specific thumbnail.
export function uniqueTrackArtwork(tracks:Track[]):Track[]{
 const seen=new Set<string>();
 return tracks.map(track=>{const key=track.artwork.trim().toLowerCase();if(!seen.has(key)){seen.add(key);return track;}const artwork=makeTrackCover(track);seen.add(artwork);return{...track,artwork};});
}
export async function getTrendingTracks(limit=20,time:'week'|'month'|'year'|'allTime'='week'):Promise<Track[]>{try{const data=await fetchAudius<AudiusTrack[]>('/tracks/trending',{limit,time});return uniqueTrackArtwork((Array.isArray(data)?data:[]).map(mapAudiusTrack));}catch(e){console.error('Failed to fetch trending tracks',e);return[];}}
export async function searchTracks(query:string,limit=20):Promise<Track[]>{if(!query.trim())return[];try{const data=await fetchAudius<AudiusTrack[]>('/tracks/search',{query,limit});return uniqueTrackArtwork((Array.isArray(data)?data:[]).map(mapAudiusTrack));}catch(e){console.error('Search failed',e);return[];}}
export async function getFeaturedNaats(limit=30):Promise<Track[]>{
 const queries=['Naat Sharif','Urdu Naat','Punjabi Naat','Islamic Nasheed','Hamd Naat'];
 const results=await Promise.all(queries.map(q=>searchTracks(q,limit)));
 const unique=new Map<string,Track>();
 const naatPattern=/naat|nasheed|hamd|naatia|madina|madine|mustafa|rasool|nabi|muhammad|sallallahu/i;
 results.flat().forEach(track=>{if(naatPattern.test(`${track.title} ${track.genre||''}`)&&!unique.has(track.id))unique.set(track.id,track);});
 return uniqueTrackArtwork(Array.from(unique.values()).slice(0,limit));
}
export async function getArtistTracks(artistId:string,limit=30):Promise<Track[]>{if(!artistId)return[];try{const data=await fetchAudius<AudiusTrack[]>(`/users/${encodeURIComponent(artistId)}/tracks`,{limit});return uniqueTrackArtwork((Array.isArray(data)?data:[]).map(mapAudiusTrack));}catch(e){console.error('Artist tracks failed',e);return[];}}
export async function getTrack(id:string):Promise<Track|null>{try{const data=await fetchAudius<AudiusTrack>(`/tracks/${id}`);return data?mapAudiusTrack(data):null;}catch{return null;}}
export function getStreamUrl(trackId:string):string{return`${BASE_URL}/tracks/${trackId}/stream?app_name=${APP_NAME}`;}
