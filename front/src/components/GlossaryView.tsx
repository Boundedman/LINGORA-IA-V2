import {useMemo,useState} from 'react';
import {Search,BookOpen} from 'lucide-react';
import {glossaryEntries,glossarySections} from '../data/glossary';
import {filterGlossary} from '../domain/glossary';
import {levels,type Level} from '../domain/types';

export function GlossaryView(){
 const [query,setQuery]=useState(''),[level,setLevel]=useState<Level|'all'>('all'),[sectionId,setSectionId]=useState('all');
 const filtered=useMemo(()=>filterGlossary(glossaryEntries,query,level,sectionId),[query,level,sectionId]);
 function clear(){setQuery('');setLevel('all');setSectionId('all');}
 return <section className="glossary-page" aria-labelledby="glossary-title">
  <div className="panel glossary-intro"><span className="icon-tile violet"><BookOpen/></span><div><span className="eyebrow">PALABRAS PARA TU DÍA A DÍA</span><h1 id="glossary-title">Tu glosario de inglés</h1><p>{glossaryEntries.length} palabras y expresiones en {glossarySections.length} secciones. Consulta significados, descubre cómo usarlos y prueba una frase propia.</p><small className="muted">Contenido original de LINGORA. Los niveles A1–B2 orientan la práctica; no son una certificación. Disponible sin cuenta y sin consultar servicios externos.</small></div></div>
  <div className="panel glossary-filters">
   <label className="glossary-search">Buscar en el glosario<div className="glossary-search-input"><Search size={18} aria-hidden="true"/><input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Palabra, significado o ejemplo…"/></div></label>
   <label>Nivel del glosario<select value={level} onChange={e=>setLevel(e.target.value as Level|'all')}><option value="all">Todos los niveles</option>{levels.map(l=><option key={l} value={l}>{l}</option>)}</select></label>
   <label>Sección del glosario<select value={sectionId} onChange={e=>setSectionId(e.target.value)}><option value="all">Todas las secciones</option>{glossarySections.map(s=><option key={s.id} value={s.id}>{s.title}</option>)}</select></label>
  </div>
  <div className="row between wrap"><p className="muted" role="status">{filtered.length} {filtered.length===1?'entrada encontrada':'entradas encontradas'}</p>{(query||level!=='all'||sectionId!=='all')&&<button className="text-button" onClick={clear}>Limpiar filtros</button>}</div>
  {filtered.length===0?<div className="panel empty"><h2>No encontramos coincidencias</h2><p>Prueba otra palabra en inglés o español, o amplía los filtros. Este glosario es una selección para practicar.</p></div>:glossarySections.map(section=>{
   const entries=filtered.filter(entry=>entry.sectionId===section.id);
   if(!entries.length)return null;
   return <section className="glossary-section" key={section.id} aria-labelledby={`section-${section.id}`}><div className="section-title"><div><h2 id={`section-${section.id}`}>{section.title}</h2><p className="muted">{section.description}</p></div><span className="badge">{entries.length} entradas</span></div><div className="glossary-grid">{entries.map(entry=><article className="panel glossary-card" key={entry.id}><div className="row between wrap"><h3 lang="en">{entry.term}</h3><span className="badge">{entry.level}</span></div><p className="glossary-translation">{entry.translation}</p><small className="muted">{entry.partOfSpeech}</small><p>{entry.usage}</p><blockquote lang="en">{entry.example}</blockquote><p className="muted glossary-example-translation">{entry.exampleTranslation}</p></article>)}</div><div className="glossary-practice"><strong>Prueba tú</strong><p>{section.practice}</p><small className="muted">Práctica libre: no se guarda ni cambia tu progreso.</small></div></section>;
  })}
 </section>;
}
