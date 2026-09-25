import {UserRound} from 'lucide-react';

export function Avatar({src,large=false}:{src?:string|null;large?:boolean}){
 return <span className={`profile-avatar ${large?'profile-avatar-large':''}`} aria-hidden="true">
  {src?<img src={src} alt=""/>:<UserRound size={large?42:20}/>}
 </span>;
}
