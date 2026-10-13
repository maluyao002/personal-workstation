const test = require('node:test');
const assert = require('node:assert/strict');
const model = require('./model.js');

test('hash routes open a specific entity and reject unknown paths to Today', () => {
  assert.deepEqual(model.parseRoute('#/news/atlas'), { view: 'news', id: 'atlas' });
  assert.deepEqual(model.parseRoute('#/research/rates'), { view: 'research', id: 'rates' });
  assert.deepEqual(model.parseRoute('#/schedule/projects/cost-study'), { view: 'schedule', tab: 'projects', id: 'cost-study' });
  assert.deepEqual(model.parseRoute('#/made-up'), { view: 'today' });
});

test('a research action enters the inbox once, even after it has been accepted', () => {
  let state = model.createState();
  state = model.enqueueAction(state, 'check-benchmark');
  state = model.enqueueAction(state, 'check-benchmark');
  assert.equal(state.inbox.length, 1);
  state = model.acceptAction(state, 'check-benchmark', 'cost-study', '2026-10-15');
  state = model.enqueueAction(state, 'check-benchmark');
  assert.equal(state.inbox.length, 0);
  assert.equal(state.tasks.length, 1);
});

test('accepting a task preserves its source and suggested dates and does not confirm the daily plan', () => {
  let state = model.enqueueAction(model.createState(), 'check-benchmark');
  state = model.acceptAction(state, 'check-benchmark', 'cost-study', '2026-10-15');
  assert.equal(state.tasks[0].date.source.value, '2026-10-12');
  assert.equal(state.tasks[0].date.suggestion.value, '2026-10-14');
  assert.deepEqual(state.tasks[0].date.user, { value: '2026-10-15', kind: 'user' });
  assert.equal(state.tasks[0].projectId, 'cost-study');
  assert.equal(state.planConfirmed, false);
  assert.equal(model.confirmPlan(state).planConfirmed, true);
});

test('research topics and assets resolve both ways with shared assets', () => {
  assert.deepEqual(model.assetsForTopic('inference').map(x => x.id), ['nvda', 'msft']);
  assert.deepEqual(model.topicsForAsset('nvda').map(x => x.id), ['inference', 'policy']);
  assert.deepEqual(model.topicsForAsset('gold').map(x => x.id), ['rates', 'policy']);
});
