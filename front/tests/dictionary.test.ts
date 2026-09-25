import {test} from 'node:test';
import assert from 'node:assert/strict';
import {cambridgeEnglishSpanishUrl} from '../src/lib/dictionary';
import {curriculum} from '../src/data/curriculum';

test('Cambridge lookup preserves phrases and encodes punctuation as query data',()=>{
 for(const [input,expected] of [['  look\tforward to  ','look forward to'],["don't","don't"],['café','café'],['a/b?x=1&next=#test','a/b?x=1&next=#test']]){
  const url=new URL(cambridgeEnglishSpanishUrl(input));
  assert.equal(url.origin,'https://dictionary.cambridge.org');
  assert.equal(url.pathname,'/es/search/direct/');
  assert.equal(url.searchParams.get('datasetsearch'),'english-spanish');
  assert.equal(url.searchParams.get('q'),expected);
  assert.equal([...url.searchParams].length,2);
  assert.equal(url.hash,'');
 }
 assert.throws(()=>cambridgeEnglishSpanishUrl(' \n '));
});

test('all vocabulary in the 28 lessons has a Cambridge lookup without changing the term',()=>{
 assert.equal(curriculum.length,28);
 for(const lesson of curriculum)for(const word of lesson.vocabulary){
  assert.equal(new URL(cambridgeEnglishSpanishUrl(word.word)).searchParams.get('q'),word.word);
 }
});
