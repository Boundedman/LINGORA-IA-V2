import {useCallback,useEffect,useRef,useState} from 'react';
import {db,api,type Session} from './db';
import type {Profile,Progress,Review,Diagnostic,Lesson} from '../domain/types';
import {curriculum} from '../data/curriculum';
type State={profile:Profile;avatar_data:string|null;progress:Progress[];reviews:Review[];diagnostic:Diagnostic|null;lessons:Lesson[]};
export function useLearner(){
 const [session,setSession]=useState<Session|null>(null),[profile,setProfile]=useState<Profile|null>(null);
 const [progress,setProgress]=useState<Progress[]>([]),[reviews,setReviews]=useState<Review[]>([]),[diagnostic,setDiagnostic]=useState<Diagnostic|null>(null),[lessons,setLessons]=useState<Lesson[]>(curriculum);
 const [avatar,setAvatar]=useState<string|null>(null);
 const sessionId=useRef<string|null>(null),version=useRef(0);
 const [error,setError]=useState(''),[loading,setLoading]=useState(true);
 useEffect(()=>{
  let mounted=true;
  const accept=(s:Session|null)=>{++version.current;sessionId.current=s?.user.id??null;setSession(s);setProfile(null);setAvatar(null);setProgress([]);setReviews([]);setDiagnostic(null);setError('');};
  const initial=version.current;
  db.auth.getSession().then(({data,error})=>{if(!mounted||initial!==version.current)return;accept(data.session);if(error)setError(error.message);setLoading(false);});
  const {data}=db.auth.onAuthStateChange((_event,s)=>{if(mounted){accept(s);setLoading(false);}});
  return()=>{mounted=false;++version.current;data.subscription.unsubscribe();};
 },[]);
 const refresh=useCallback(async()=>{
  if(!session){return;}
  const id=session.user.id;if(sessionId.current!==id)return;
  const request=++version.current;
  const data=await api<State>('learner');
  if(request!==version.current||sessionId.current!==id)return;
  setAvatar(data.avatar_data??null);
  setProfile(data.profile);setProgress(data.progress);setReviews(data.reviews);setDiagnostic(data.diagnostic);setLessons(data.lessons);
 },[session]);
 useEffect(()=>{void refresh().catch(e=>setError(e.message));},[refresh]);
 useEffect(()=>{const sync=()=>{if(document.visibilityState==='visible')void refresh().catch(e=>setError(e.message));};window.addEventListener('focus',sync);return()=>window.removeEventListener('focus',sync);},[refresh]);
 async function updateProfile(values:Partial<Profile>){await api('profile',values);await refresh();}
 async function updateAvatar(avatar_data:string|null){await api('account/avatar',{avatar_data});await refresh();}
 return {session,profile,avatar,updateAvatar,progress,reviews,diagnostic,lessons,error,setError,loading,refresh,updateProfile,setDiagnostic};
}
export type Learner=ReturnType<typeof useLearner>;
