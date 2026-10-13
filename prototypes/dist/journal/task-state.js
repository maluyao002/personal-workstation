(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.TaskState = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const suggestedDate = '2026-10-14';
  const suggestionSource = '任务提示“本周三”';
  function validDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false;
    const date = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }
  function acceptResearchTask({ project, dueMode, dueDate }) {
    if (!['个人工作站', '秋季阅读计划'].includes(project)) throw new Error('请选择项目');
    if (!['suggested', 'custom', 'none'].includes(dueMode)) throw new Error('请选择截止日期');
    if (dueMode === 'custom' && !validDate(dueDate)) throw new Error('请输入有效的截止日期');
    return {
      project,
      deadline: dueMode === 'none' ? null : dueMode === 'custom' ? dueDate : suggestedDate,
      dueMode,
      suggestionSource
    };
  }
  function deadlineSummary(task) {
    const source = `来源：${task.suggestionSource}（推断 10 月 14 日）`;
    if (!task.deadline) return `未设置截止日期；${source}`;
    const date = new Date(`${task.deadline}T00:00:00Z`);
    const dateLabel = `${date.getUTCMonth() + 1} 月 ${date.getUTCDate()} 日`;
    return `截止 ${dateLabel}（${task.dueMode === 'suggested' ? '采纳推断' : '手动设置'}）；${source}`;
  }
  function planForResearch(task, confirmedPlan = null) {
    if (confirmedPlan) return confirmedPlan;
    const project = task?.project || '个人工作站';
    return {
      project,
      preview: `建议在 13:30–15:00 整理「${project}」研究提纲，留出 15:00–16:00 处理临时工作。`,
      timeline: `13:30–15:00 · ${project} 研究提纲；15:00–16:00 保留缓冲。`
    };
  }
  function queueReading() { return { status: 'pending', project: null, scheduled: false }; }
  return { acceptResearchTask, deadlineSummary, planForResearch, queueReading };
});
