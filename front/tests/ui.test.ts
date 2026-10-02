import {test,afterEach} from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import React from 'react';
const dom=new JSDOM('<!doctype html><html><body></body></html>',{url:'http://localhost/',pretendToBeVisual:true});
Object.assign(globalThis,{window:dom.window,document:dom.window.document,HTMLElement:dom.window.HTMLElement,FileReader:dom.window.FileReader,location:dom.window.location,IS_REACT_ACT_ENVIRONMENT:true});
Object.defineProperty(globalThis,'navigator',{value:dom.window.navigator,configurable:true});
dom.window.scrollTo=()=>{};
const guestFetch=(async()=>new Response(JSON.stringify({session:null}),{headers:{'Content-Type':'application/json'}})) as typeof fetch;
globalThis.fetch=guestFetch;
const {render,screen,fireEvent,cleanup,waitFor}=await import('@testing-library/react');
const {default:App}=await import('../src/App');
const {curriculum}=await import('../src/data/curriculum');
afterEach(()=>{cleanup();globalThis.fetch=guestFetch;});

test('registration asks for name and sends it with an optional default avatar',async()=>{
 let submitted:Record<string,unknown>|undefined;
 globalThis.fetch=(async(url,init)=>{
  if(String(url).endsWith('/auth/signup'))submitted=JSON.parse(String(init?.body));
  return new Response(JSON.stringify({session:null}),{headers:{'Content-Type':'application/json'}});
 }) as typeof fetch;
 render(React.createElement(App));
 fireEvent.click(screen.getByRole('button',{name:'Iniciar sesión'}));
 fireEvent.click(screen.getByRole('button',{name:'Crear cuenta'}));
 const name=screen.getByLabelText('Nombre') as HTMLInputElement;
 assert.ok(name.required);
 assert.ok(screen.getByLabelText(/Foto de perfil/));
 fireEvent.change(name,{target:{value:' Elena '}});
 fireEvent.change(screen.getByLabelText('Correo electrónico'),{target:{value:'elena@example.com'}});
 fireEvent.change(screen.getByLabelText('Contraseña'),{target:{value:'safe-password-123'}});
 fireEvent.click(screen.getByRole('checkbox'));
 fireEvent.click(screen.getByRole('button',{name:'Crear cuenta'}));
 await waitFor(()=>assert.equal(submitted?.display_name,'Elena'));
 assert.equal(submitted?.avatar_data,null);
 await waitFor(()=>assert.equal(screen.queryByRole('dialog'),null));
});

test('account navigation uploads photos, restores the default and switches accounts without stale data',async()=>{
 let user:string|null='ana',photo:string|null=null;
 let defer=false,resolveOld:((response:Response)=>void)|undefined;
 const response=(body:unknown)=>new Response(JSON.stringify(body),{headers:{'Content-Type':'application/json'}});
 const state=()=>({profile:{id:user,display_name:user==='ana'?'Ana':'Luis',level:'A1',level_source:'declared',interest:'',daily_minutes:15,onboarded:true},avatar_data:photo,progress:[],reviews:[],diagnostic:null,lessons:curriculum});
 globalThis.fetch=(async(url,init)=>{
  const path=String(url);
  if(path.endsWith('/auth/logout')){user=null;return response({ok:true});}
  if(path.endsWith('/auth/login')){user='luis';photo=null;return response({});}
  if(path.endsWith('/auth/session'))return response({session:user?{user:{id:user,email:`${user}@example.com`}}:null});
  if(path.endsWith('/account/avatar')){photo=JSON.parse(String(init?.body)).avatar_data;return response({avatar_data:photo});}
  if(path.endsWith('/learner')){
   if(defer){defer=false;return new Promise<Response>(resolve=>{resolveOld=resolve;});}
   return response(state());
  }
  return response({});
 }) as typeof fetch;
 const view=render(React.createElement(App));
 await waitFor(()=>assert.ok(screen.getByText('Hola, Ana. ¿Listo para avanzar?')));
 fireEvent.click(screen.getByRole('button',{name:'Configuración de cuenta'}));
 assert.ok(screen.getByRole('heading',{name:'Configuración de cuenta'}));
 assert.ok(screen.getByText('ana@example.com'));
 const file=new dom.window.File(['image bytes'],'avatar.png',{type:'image/png'});
 fireEvent.change(screen.getByLabelText(/Foto de perfil/),{target:{files:[file]}});
 await waitFor(()=>assert.equal((screen.getByRole('button',{name:'Guardar foto'}) as HTMLButtonElement).disabled,false));
 fireEvent.click(screen.getByRole('button',{name:'Guardar foto'}));
 await waitFor(()=>assert.ok(screen.getByText('Foto guardada.')));
 assert.ok(view.container.querySelector('.account-nav img'));
 fireEvent.click(screen.getByRole('button',{name:'Usar avatar predeterminado'}));
 fireEvent.click(screen.getByRole('button',{name:'Guardar foto'}));
 await waitFor(()=>assert.ok(screen.getByText('Avatar predeterminado restaurado.')));
 assert.equal(view.container.querySelector('.account-nav img'),null);
 const oldState=state();defer=true;fireEvent(window,new dom.window.Event('focus'));
 await waitFor(()=>assert.ok(resolveOld));
 fireEvent.click(screen.getByRole('button',{name:'Cambiar de cuenta'}));
 await waitFor(()=>assert.ok(screen.getByRole('dialog')));
 fireEvent.change(screen.getByLabelText('Correo electrónico'),{target:{value:'luis@example.com'}});
 fireEvent.change(screen.getByLabelText('Contraseña'),{target:{value:'safe-password-123'}});
 fireEvent.click(screen.getByRole('button',{name:'Entrar'}));
 await waitFor(()=>assert.ok(screen.getByText('luis@example.com')));
 resolveOld!(response(oldState));
 await waitFor(()=>assert.equal((screen.getByLabelText('¿Cómo te llamas?') as HTMLInputElement).value,'Luis'));
 assert.equal(screen.queryByText('ana@example.com'),null);
 fireEvent.click(screen.getByRole('button',{name:'Cerrar sesión'}));
 await waitFor(()=>assert.ok(screen.getByRole('button',{name:'Iniciar sesión'})));
 assert.equal(screen.queryByText('luis@example.com'),null);
});
test('glossary navigation, search, section filters and reset work without a user account',async()=>{
 render(React.createElement(App));
 fireEvent.click(screen.getByRole('button',{name:'Glosario'}));
 assert.ok(screen.getByRole('heading',{name:'Tu glosario de inglés'}));
 assert.equal(screen.getAllByRole('article').length,64);
 fireEvent.change(screen.getByLabelText('Buscar en el glosario'),{target:{value:'look forward to'}});
 assert.equal(screen.getAllByRole('article').length,1);
 assert.ok(screen.getByText('Me hace ilusión conocer a tu equipo.'));
 fireEvent.change(screen.getByLabelText('Nivel del glosario'),{target:{value:'A1'}});
 assert.ok(screen.getByRole('heading',{name:'No encontramos coincidencias'}));
 fireEvent.click(screen.getByRole('button',{name:'Limpiar filtros'}));
 fireEvent.change(screen.getByLabelText('Sección del glosario'),{target:{value:'travel'}});
 assert.equal(screen.getAllByRole('article').length,8);
 assert.ok(screen.getByRole('heading',{name:'luggage'}));
 fireEvent.click(screen.getByRole('button',{name:'Lecciones'}));
 assert.ok(screen.getByLabelText('Área'));
 await waitFor(()=>assert.ok(screen.getByRole('button',{name:'A1'})));
});
test('lesson vocabulary renders secure external Cambridge lookups next to each word',async()=>{
 render(React.createElement(App));
 fireEvent.click(screen.getByRole('button',{name:'Comenzar mi práctica'}));
 const details=screen.getByText('Palabras de esta unidad').closest('details')!;
 details.open=true;
 assert.ok(screen.getByText(/Cambridge es un recurso externo/));
 const links=screen.getAllByRole('link',{name:/Consultar en Cambridge/});
 const words=curriculum[0].vocabulary;
 assert.equal(links.length,words.length);
 links.forEach((link,index)=>{
  const url=new URL(link.getAttribute('href')!);
  assert.equal(url.hostname,'dictionary.cambridge.org');
  assert.equal(url.searchParams.get('datasetsearch'),'english-spanish');
  assert.equal(url.searchParams.get('q'),words[index].word);
  assert.equal(link.getAttribute('target'),'_blank');
  assert.equal(link.getAttribute('rel'),'noopener noreferrer');
  assert.ok(link.parentElement?.textContent?.includes(words[index].translation));
  assert.match(link.textContent!,/se abre en una pestaña nueva/);
 });
 await waitFor(()=>assert.ok(screen.getByRole('heading',{name:'Conoce a alguien'})));
});
test('unconfigured application opens a real catalog and completes a practice without fake persistence',async()=>{
 render(React.createElement(App));
 assert.ok(screen.getByText('Tu propio ritmo.'));
 fireEvent.click(screen.getByRole('button',{name:'Comenzar mi práctica'}));
 assert.ok(screen.getByRole('heading',{name:'Conoce a alguien'}));
 for(const word of ['nombre','trabajar','vivir','amigo o amiga']){
  fireEvent.click(screen.getByRole('radio',{name:word}));
  fireEvent.click(screen.getByRole('button',{name:'Comprobar y continuar'}));
  await waitFor(()=>assert.ok(screen.getByText('¡Bien! Identificaste la respuesta.')));
  fireEvent.click(screen.getByRole('button',{name:'Continuar'}));
 }
 assert.ok(screen.getByText('Una lección más en tu camino'));
 assert.ok(screen.getByText(/Inicia sesión para guardar tu progreso entre dispositivos/));
});
test('catalog filters B2 writing and renders an actual open exercise',()=>{
 render(React.createElement(App));
 fireEvent.click(screen.getByRole('button',{name:'Lecciones'}));
 fireEvent.click(screen.getByRole('button',{name:'B2'}));
 fireEvent.change(screen.getByLabelText('Área'),{target:{value:'writing'}});
 fireEvent.click(screen.getByRole('button',{name:/Dale forma a tus ideas/}));
 assert.ok(screen.getByRole('heading',{name:/Escribe 100–130 palabras/}));
});
test('diagnostic explains sign-in instead of inventing a user profile',()=>{
 render(React.createElement(App));
 fireEvent.click(screen.getByRole('button',{name:'Conocer mi nivel'}));
 assert.ok(screen.getByRole('button',{name:'Entrar para comenzar'}));
 fireEvent.click(screen.getByRole('button',{name:'Entrar para comenzar'}));
 assert.ok(screen.getByRole('dialog'));
});

test('tutor starts fresh, selects another topic and clears history on page exit',async()=>{
 const {Tutor}=await import('../src/components/Tutor');
 const calls:{path:string;body:any;keepalive?:boolean}[]=[];
 globalThis.fetch=(async(url,init)=>{
  calls.push({path:String(url),body:init?.body?JSON.parse(String(init.body)):null,keepalive:init?.keepalive});
  return new Response(JSON.stringify({text:'Hello traveler!'}),{headers:{'Content-Type':'application/json'}});
 }) as typeof fetch;
 const learner={session:{user:{id:'ana',email:'ana@example.com'}},profile:{interest:'Old topic'},updateProfile:async()=>{}} as unknown as import('../src/lib/useLearner').Learner;
 const view=render(React.createElement(Tutor,{learner,login:()=>{}}));
 fireEvent.click(screen.getByRole('button',{name:'Viajar con confianza'}));
 await waitFor(()=>assert.equal((screen.getByRole('button',{name:'Guardar interés'}) as HTMLButtonElement).disabled,false));
 fireEvent.click(screen.getByRole('button',{name:'Guardar interés'}));
 await screen.findByLabelText('Mensaje para el tutor');
 fireEvent.change(screen.getByLabelText('Mensaje para el tutor'),{target:{value:'Hello'}});
 fireEvent.click(screen.getByRole('button',{name:'Enviar mensaje'}));
 await screen.findByText('Hello traveler!');
 fireEvent(window,new dom.window.Event('pagehide'));
 assert.equal(screen.queryByText('Hello traveler!'),null);
 assert.ok(screen.getByLabelText('Tu interés principal'));
 assert.ok(calls.some(c=>c.keepalive&&c.body.action==='clear-history'));
 view.unmount();
 render(React.createElement(Tutor,{learner,login:()=>{}}));
 assert.ok(screen.getByRole('button',{name:'Tecnología y videojuegos'}));
 assert.equal(calls.some(c=>c.path.endsWith('/messages')),false);
 await waitFor(()=>assert.ok(calls.filter(c=>c.body?.action==='clear-history').length>=4));
});
