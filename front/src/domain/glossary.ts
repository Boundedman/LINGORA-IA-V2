import type {GlossaryEntry} from '../data/glossary';
import type {Level} from './types';

export function normalizeGlossarySearch(value:string){
 return value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().replace(/\s+/g,' ');
}
export function filterGlossary(entries:GlossaryEntry[],query:string,level:Level|'all',sectionId:string){
 const words=normalizeGlossarySearch(query).split(' ').filter(Boolean);
 return entries.filter(entry=>{
  if(level!=='all'&&entry.level!==level)return false;
  if(sectionId!=='all'&&entry.sectionId!==sectionId)return false;
  const text=normalizeGlossarySearch([entry.term,entry.translation,entry.usage,entry.example,entry.exampleTranslation].join(' '));
  return words.every(word=>text.includes(word));
 });
}
