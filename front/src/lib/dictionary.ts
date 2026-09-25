/** External lookup only: preserve expressions without guessing Cambridge entry slugs. */
export function cambridgeEnglishSpanishUrl(term:string):string {
 const query=term.normalize('NFC').trim().replace(/\s+/gu,' ');
 if(!query)throw new Error('La consulta de Cambridge necesita una palabra o expresión.');
 const url=new URL('https://dictionary.cambridge.org/es/search/direct/');
 url.searchParams.set('datasetsearch','english-spanish');
 url.searchParams.set('q',query);
 return url.href;
}
