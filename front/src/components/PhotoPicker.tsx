import {useId,useRef,useState} from 'react';
import {Avatar} from './Avatar';

export function PhotoPicker({value,onChange,disabled=false,onReading}:{value:string|null;onChange:(value:string|null)=>void;disabled?:boolean;onReading?:(reading:boolean)=>void}){
 const id=useId(),generation=useRef(0);
 const [error,setError]=useState('');
 async function select(file?:File){
  const request=++generation.current;setError('');
  if(!file)return;
  if(!['image/jpeg','image/png','image/webp'].includes(file.type)){setError('Elige una foto JPG, PNG o WebP.');return;}
  if(file.size>2*1024*1024){setError('La foto debe pesar como máximo 2 MB.');return;}
  onReading?.(true);
  try{
   const data=await new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=()=>reject(new Error('No se pudo leer la foto.'));reader.readAsDataURL(file);});
   if(request===generation.current)onChange(data);
  }catch(e){if(request===generation.current)setError((e as Error).message);}
  finally{if(request===generation.current)onReading?.(false);}
 }
 return <div className="photo-picker"><Avatar src={value} large/><div className="photo-picker-controls">
  <label htmlFor={id}>Foto de perfil <span className="muted">(opcional)</span></label>
  <input id={id} type="file" accept="image/jpeg,image/png,image/webp" disabled={disabled} onChange={e=>{void select(e.target.files?.[0]);e.target.value='';}} aria-describedby={`${id}-help`}/>
  <p id={`${id}-help`} className="muted">JPG, PNG o WebP · hasta 2 MB y 16 megapíxeles. Sin foto se muestra el avatar predeterminado.</p>
  {value&&<button type="button" className="text-button" disabled={disabled} onClick={()=>{++generation.current;onReading?.(false);onChange(null);setError('');}}>Usar avatar predeterminado</button>}
  {error&&<p role="alert" className="error">{error}</p>}
 </div></div>;
}
