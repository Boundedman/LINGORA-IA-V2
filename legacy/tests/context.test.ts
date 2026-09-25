import {test} from 'node:test';
import assert from 'node:assert/strict';
import {buildContext,requestSchema,retrieve} from '../server/ai';
import type {Profile} from '../../front/src/domain/types';
test('context contains bounded relevant knowledge rather than the whole curriculum',()=>{const profile={level:'A1',level_source:'declared',interest:'Viajes'} as Profile;const context=buildContext(profile,'for since','b1-grammar',[],Array.from({length:100},()=>({role:'user',content:'x'.repeat(10000)})));assert.ok(Buffer.byteLength(context)<8000);assert.equal(JSON.parse(context).knowledge.length,1);assert.ok(JSON.parse(context).recent.length<=6);assert.equal(retrieve('for since').length<=2,true);});
test('AI input rejects oversized requests and unsupported operations',()=>{assert.equal(requestSchema.safeParse({operation:'tutor',message:'x'.repeat(2001)}).success,false);assert.equal(requestSchema.safeParse({operation:'delete',message:'hi'}).success,false);});
