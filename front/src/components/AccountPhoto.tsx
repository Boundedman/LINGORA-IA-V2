import {useEffect,useState} from 'react';
import type {Learner} from '../lib/useLearner';
import {PhotoPicker} from './PhotoPicker';

export function AccountPhoto({learner}:{learner:Learner}){
 const [photo,setPhoto]=useState<string|null>(learner.avatar),[busy,setBusy]=useState(false),[reading,setReading]=useState(false),[message,setMessage]=useState('');
 useEffect(()=>setPhoto(learner.avatar),[learner.avatar]);
 return <form className="account-photo" onSubmit={e=>{e.preventDefault();setBusy(true);setMessage('');void learner.updateAvatar(photo).then(()=>setMessage(photo?'Foto guardada.':'Avatar predeterminado restaurado.')).catch(e=>setMessage(e.message)).finally(()=>setBusy(false));}}>
  <PhotoPicker value={photo} onChange={setPhoto} disabled={busy||reading} onReading={setReading}/>
  <button className="secondary" disabled={busy||reading||photo===learner.avatar}>{busy?'Guardando…':'Guardar foto'}</button>
  {message&&<p className="notice" role="status">{message}</p>}
 </form>;
}
