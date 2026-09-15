import test from 'node:test';
import assert from 'node:assert/strict';
import {cancelSingle,placeSingle,wallet} from '../lib/bets.ts';
import {matchVotes} from '../lib/votes.ts';
import {emptyPicks,type Tournament} from '../lib/game.ts';
const now=Date.parse('2026-09-15T00:00:00Z');
const t={id:'test',matches:[{id:'m',a:'a',b:'b',lock:'2026-09-16T00:00:00Z',betsOpen:true}]} as Tournament;
test('cancel refunds once, removes vote, and permits a new pick',()=>{const p=placeSingle(emptyPicks(),t,'m','a',50,now);const next=cancelSingle(p,t,'m',now);assert.equal(wallet(next,t),100);assert.deepEqual(matchVotes(t.matches,[next]).m,{a:0,b:0});assert.equal(wallet(p,t),50);assert.throws(()=>cancelSingle(next,t,'m',now));assert.equal(wallet(placeSingle(next,t,'m','b',20,now),t),80);});
test('cancellation rejects closed, started and settled matches',()=>{const p=placeSingle(emptyPicks(),t,'m','a',50,now);assert.throws(()=>cancelSingle(p,t,'m',Date.parse(t.matches[0].lock)));for(const change of [{betsOpen:false},{winner:'a'}])assert.throws(()=>cancelSingle(p,{...t,matches:[{...t.matches[0],...change}]},'m',now));});
