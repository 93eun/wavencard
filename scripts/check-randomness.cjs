const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
function load(file, anchor, dataName, includeDeck) {
  let next = () => 0;
  let calls = 0;
  const context = { React: {}, crypto: { getRandomValues(values) { calls++; values[0] = next(); return values; } } };
  const source = fs.readFileSync(file, 'utf8').split(anchor)[0];
  vm.runInNewContext(source + `\nglobalThis.audit={randomIndex,data:${dataName}${includeDeck?',newDeck':''}};`, context);
  return { ...context.audit, feed(fn) { next=fn; calls=0; }, calls:()=>calls };
}
const nine = load('scripts/source/enneagram.js','const App = () => {','_DATA',true);
const aroma = load('scripts/source/aroma.js','function App() {','_PAYLOAD',false);
for (const [name, audit] of [['enneagram',nine],['aroma',aroma]]) {
  assert.equal(new Set(audit.data.map(c=>c.id)).size,audit.data.length,`${name}: duplicate IDs`);
  for(const bound of [1,2,3,9,audit.data.length]) {
    const limit=2**32-(2**32%bound);
    const values=limit<2**32 ? [limit,2**32-1,limit-1] : [2**32-1];
    let index=0;
    audit.feed(()=>values[index++]);
    assert.equal(audit.randomIndex(bound),(limit-1)%bound);
    assert.equal(audit.calls(),values.length);
  }
  console.log(`${name}: ${audit.data.length} unique cards; rejection sampling boundaries passed`);
}
assert.equal(nine.data.length,9);
const idIndex=new Map(nine.data.map((card,index)=>[card.id,index]));
const positions=new Uint32Array(81);
const permutations=new Set();
const choices=[];
let cursor=0,total=0;
nine.feed(()=>choices[cursor++]);
function enumerate(i) {
  if (i===0) {
    cursor=0;
    const deck=nine.newDeck();
    assert.equal(cursor,8);
    let mask=0,key='';
    for(let position=0;position<9;position++) {
      const card=idIndex.get(deck[position].id);
      mask|=1<<card;
      key+=card;
      positions[position*9+card]++;
    }
    assert.equal(mask,511);
    permutations.add(key);
    total++;
    return;
  }
  for(let choice=0;choice<=i;choice++) {choices[8-i]=choice;enumerate(i-1);}
}
enumerate(8);
assert.equal(total,362880);
assert.equal(permutations.size,total);
assert.ok(positions.every(count=>count===40320));
console.log('All 362,880 shuffle paths are distinct; every card appears exactly 40,320 times in every slot.');
console.log('Every card: 1/9 per slot; 2/9 in the two-card reading; 3/9 in the three-card reading.');
