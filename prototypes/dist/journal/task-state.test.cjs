const test = require('node:test');
const assert = require('node:assert/strict');
const TaskState = require('./task-state.js');

test('accepted project carries through plan preview and confirmed timeline', () => {
  const task = TaskState.acceptResearchTask({ project: '秋季阅读计划', dueMode: 'suggested' });
  const plan = TaskState.planForResearch(task);
  assert.equal(plan.project, '秋季阅读计划');
  assert.match(plan.preview, /秋季阅读计划/);
  assert.match(plan.timeline, /秋季阅读计划/);
  assert.doesNotMatch(plan.preview, /个人工作站/);
});

test('suggested deadline remains visibly inferred after acceptance', () => {
  const task = TaskState.acceptResearchTask({ project: '个人工作站', dueMode: 'suggested' });
  assert.equal(task.deadline, '2026-10-14');
  assert.match(TaskState.deadlineSummary(task), /10 月 14 日/);
  assert.match(TaskState.deadlineSummary(task), /采纳推断/);
  assert.match(TaskState.deadlineSummary(task), /“本周三”/);
});

test('edited deadline shows confirmed date and preserves original inference source', () => {
  const task = TaskState.acceptResearchTask({ project: '秋季阅读计划', dueMode: 'custom', dueDate: '2026-10-16' });
  assert.equal(task.deadline, '2026-10-16');
  assert.match(TaskState.deadlineSummary(task), /10 月 16 日/);
  assert.match(TaskState.deadlineSummary(task), /手动设置/);
  assert.match(TaskState.deadlineSummary(task), /“本周三”/);
});

test('deadline can be left unset without dropping the source suggestion', () => {
  const task = TaskState.acceptResearchTask({ project: '个人工作站', dueMode: 'none' });
  assert.equal(task.deadline, null);
  assert.match(TaskState.deadlineSummary(task), /未设置截止日期/);
  assert.match(TaskState.deadlineSummary(task), /“本周三”/);
});

test('reading action creates a pending inbox item with no project or schedule', () => {
  const item = TaskState.queueReading();
  assert.equal(item.status, 'pending');
  assert.equal(item.project, null);
  assert.equal(item.scheduled, false);
});

test('confirmed plan keeps its project when a later accepted task has another project', () => {
  const confirmedPlan = TaskState.planForResearch(null);
  const laterTask = TaskState.acceptResearchTask({ project: '秋季阅读计划', dueMode: 'none' });
  const visiblePlan = TaskState.planForResearch(laterTask, confirmedPlan);
  assert.equal(visiblePlan.project, '个人工作站');
  assert.match(visiblePlan.timeline, /个人工作站/);
  assert.doesNotMatch(visiblePlan.timeline, /秋季阅读计划/);
});
