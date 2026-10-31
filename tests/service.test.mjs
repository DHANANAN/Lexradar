import test from 'node:test';
import assert from 'node:assert/strict';
import {parseCalls, authorized, generate} from '../server/service.js';
const source={id:'fixture',name:'Fixture provider',url:'https://example.org/feed',format:'rss'};
test('announcement parser removes markup, deduplicates, rejects unsafe links, and never guesses fees',()=>{
 const calls=parseCalls('<rss><channel><item><title>Call for papers: Public Law</title><link>https://example.org/call</link><description>&lt;b&gt;Submission invitation&lt;/b&gt;</description></item><item><title>Call for papers: duplicate</title><link>https://example.org/call</link></item><item><title>Call for papers: unsafe</title><link>javascript:alert(1)</link></item><item><title>Football update</title><link>https://example.org/sport</link></item></channel></rss>',source);
 assert.equal(calls.length,1);assert.equal(calls[0].submissionFee,'Unknown');assert.equal(calls[0].publicationFee,'Unknown');assert.equal(calls[0].published,'');assert.ok(!calls[0].summary.includes('<b>'));
});
test('paid assistant rejects absent and incorrect access codes',()=>{assert.equal(authorized('',undefined),false);assert.equal(authorized('wrong','correct'),false);assert.equal(authorized('correct','correct'),true);});
test('assistant validates tasks and input before making a provider request',async()=>{await assert.rejects(generate({action:'invalid',text:'test'},{}),/Unknown/);await assert.rejects(generate({action:'draft',text:''},{}),/Enter/);await assert.rejects(generate({action:'draft',text:'A draft'},{}),/not configured/);});
