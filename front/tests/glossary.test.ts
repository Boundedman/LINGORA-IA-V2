import {test} from 'node:test';
import assert from 'node:assert/strict';
import {glossaryEntries,glossarySections} from '../src/data/glossary';
import {filterGlossary} from '../src/domain/glossary';
import {curriculum} from '../src/data/curriculum';

test('original glossary covers existing lesson vocabulary with complete entries and unique identifiers',()=>{
 assert.equal(glossarySections.length,8);
 assert.equal(glossaryEntries.length,64);
 assert.equal(new Set(glossaryEntries.map(e=>e.id)).size,glossaryEntries.length);
 assert.equal(new Set(glossaryEntries.map(e=>e.term)).size,glossaryEntries.length);
 const terms=new Set(glossaryEntries.map(e=>e.term));
 for(const lesson of curriculum)for(const item of lesson.vocabulary)assert.ok(terms.has(item.word),item.word);
 for(const entry of glossaryEntries){
  assert.ok(glossarySections.some(s=>s.id===entry.sectionId));
  for(const field of [entry.translation,entry.partOfSpeech,entry.usage,entry.example,entry.exampleTranslation])assert.ok(field.trim().length>0);
  assert.ok(['A1','A2','B1','B2'].includes(entry.level));
 }
 for(const section of glossarySections){
  assert.ok(glossaryEntries.some(e=>e.sectionId===section.id));
  assert.ok(section.practice.trim());
 }
});

test('glossary search supports Spanish accents, English phrases and combined filters',()=>{
 assert.deepEqual(filterGlossary(glossaryEntries,'  DIRECCION  ','all','all').map(e=>e.term),['address']);
 assert.deepEqual(filterGlossary(glossaryEntries,'look   forward to','all','all').map(e=>e.term),['look forward to']);
 assert.equal(filterGlossary(glossaryEntries,'','B2','ideas').length,4);
 assert.equal(filterGlossary(glossaryEntries,'luggage','B2','travel').length,0);
 assert.equal(filterGlossary(glossaryEntries,'xyz-unlisted','all','all').length,0);
 assert.equal(filterGlossary(glossaryEntries,'','all','all').length,64);
});
