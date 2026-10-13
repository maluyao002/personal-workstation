(() => {
  const KEY = 'decision-workstation-demo-v1';
  const defaults = { view: 'today', plan: false, task: false, taskProject: 'statistics', taskDeadline: null, mail: false, calendar: false, permissions: { calendar: true, gmail: true, finance: true, workBody: false } };
  let state = load();
  let lastFocus = null;
  let toastTimer;
  const modal = document.getElementById('modal');
  const modalContent = document.getElementById('modal-content');
  const toast = document.getElementById('toast');

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
      return { ...defaults, ...saved, permissions: { ...defaults.permissions, ...(saved.permissions || {}), calendar: true, gmail: true, finance: true } };
    } catch { return structuredClone(defaults); }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* memory state still works */ } }
  function announce(message) {
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 3400);
  }
  function show(view) {
    if (!['today', 'projects', 'activity'].includes(view)) return;
    state.view = view; save();
    document.querySelectorAll('.view').forEach(node => node.classList.toggle('is-visible', node.id === `${view}-view`));
    document.querySelectorAll('[data-view].nav-item').forEach(node => {
      const active = node.dataset.view === view;
      node.classList.toggle('is-active', active);
      if (active) node.setAttribute('aria-current', 'page'); else node.removeAttribute('aria-current');
    });
    document.getElementById('page-title').textContent = {
      today: '今天，先把重要的事定下来。', projects: '项目里的每一步，都由你决定。', activity: '看看今天发生了什么变化。'
    }[view];
    window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }
  function sync() {
    const status = document.getElementById('plan-status');
    status.textContent = state.plan ? '计划已确认' : '待确认计划';
    status.classList.toggle('confirmed', state.plan);
    const planButton = document.getElementById('plan-confirm');
    planButton.textContent = state.plan ? '已确认今日计划' : '确认今日计划';
    planButton.disabled = state.plan;
    planButton.title = state.plan ? '已确认；若要重新演示，请在设置中重置' : '';
    document.getElementById('plan-footnote').textContent = state.plan ? '计划已保存在本页；日历仍需单独确认。' : '确认仅保存本页计划；写入日历需再确认。';
    document.getElementById('suggestion-label').textContent = state.plan ? '本页已确认' : '计划建议';
    document.getElementById('schedule-state').textContent = state.calendar ? '本页日历安排已确认' : state.plan ? '计划已确认 · 日历待定' : '建议需先确认';
    document.getElementById('timeline-suggestion-state').textContent = state.calendar ? '本页日历安排已确认 / 未写入真实日历' : state.plan ? '本页计划已确认 / 尚未写入日历' : 'AI 建议 / 2 小时，尚未写入日历';
    document.getElementById('capacity-ring').setAttribute('aria-label', `8 小时可规划时间中，3 小时 30 分已有日历安排，2 小时${state.plan ? '已在本页计划确认' : '为计划建议'}，2 小时 30 分仍可用`);
    const count = [!state.task, !state.mail, !state.calendar].filter(Boolean).length;
    document.getElementById('queue-count').textContent = count;
    document.getElementById('task-queue-item').hidden = state.task;
    document.getElementById('mail-queue-item').hidden = state.mail;
    document.getElementById('calendar-queue-item').hidden = state.calendar;
    const deadlineText = state.taskDeadline ? `截止 ${state.taskDeadline.replace('T', ' ')}` : '未设置截止时间';
    document.getElementById('project-task-status').textContent = state.task && state.taskProject === 'statistics' ? `统计作业 · 已接受 · ${deadlineText}` : '暂无新接受任务';
    const researchTask = document.getElementById('research-accepted-task');
    researchTask.hidden = !(state.task && state.taskProject === 'research');
    researchTask.textContent = `已接受 · 统计作业提交 · ${deadlineText}`;
    const taskProjectButton = document.querySelector('.project-row [data-action="task-preview"]');
    taskProjectButton.textContent = state.task ? '查看任务 ↗' : '查看提议 ↗';
    const list = document.querySelector('.approval-list');
    let empty = list.querySelector('.queue-empty');
    if (count === 0 && !empty) { empty = document.createElement('p'); empty.className = 'queue-empty'; empty.textContent = '今日待确认事项已处理完。新建议会先在这里等待你决定。'; list.append(empty); }
    if (count > 0 && empty) empty.remove();
  }
  function open(html) {
    if (!modal.open) lastFocus = document.activeElement;
    modalContent.innerHTML = html;
    if (!modal.open) modal.showModal();
    const first = modal.querySelector('.modal-close');
    first.focus();
  }
  function close() { modal.close(); modalContent.innerHTML = ''; if (lastFocus && lastFocus.isConnected) lastFocus.focus(); }
  modal.addEventListener('close', () => { if (lastFocus && lastFocus.isConnected) lastFocus.focus(); });
  modal.addEventListener('cancel', event => { event.preventDefault(); close(); });
  modal.addEventListener('click', event => { if (event.target === modal) close(); });
  modal.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const candidates = [...modal.querySelectorAll('button:not(:disabled),a[href],input:not(:disabled)')].filter(el => el.offsetParent !== null);
    if (!candidates.length) return;
    const first = candidates[0], last = candidates[candidates.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  modal.addEventListener('change', event => {
    if (event.target.id !== 'task-no-deadline') return;
    const disabled = event.target.checked;
    document.getElementById('task-date').disabled = disabled;
    document.getElementById('task-time').disabled = disabled;
  });
  function blocked(domain) { return !state.permissions[domain]; }
  function taskPreview() {
    if (state.task) { const projectName = state.taskProject === 'research' ? '论文修订' : '统计方法课程'; const deadline = state.taskDeadline ? state.taskDeadline.replace('T', ' ') : '未设置截止时间'; open(`<span class="eyebrow">已接受任务 · 演示数据</span><h2>统计作业提交</h2><p>已加入「${projectName}」。你确认的截止设置：${deadline}。</p><div class="detail-block"><strong>来源</strong><p>课程邮件原文：「周三前交」。具体日期与时刻未写在原文里。</p></div><div class="modal-actions"><button type="button" class="button-secondary" data-action="close">关闭</button></div>`); return; }
    open(`<span class="eyebrow">任务提议 · 演示数据</span><h2>核对统计作业的截止时间</h2><p>接受后才会加入项目清单。归属项目和截止设置都由你确认。</p><div class="detail-block"><strong>邮件原文事实</strong><p>课程邮件：「统计作业周三前交。」未写明日期和时刻。</p></div><div class="detail-block inference"><strong>AI 推断 · 可修改</strong><p>系统暂推为 2026 年 10 月 14 日（周三）23:59。请以课程要求为准，也可以不设截止。</p></div><div class="task-fields"><label>归属项目<select id="task-project"><option value="statistics">统计方法课程</option><option value="research">论文修订</option></select></label><div class="task-date-row"><label>截止日期<input id="task-date" type="date" value="2026-10-14"></label><label>截止时间<input id="task-time" type="time" value="23:59"></label></div><label class="checkbox-line"><input id="task-no-deadline" type="checkbox">暂不设置截止时间</label></div><div class="modal-actions"><button type="button" class="button-secondary" data-action="close">暂不接受</button><button type="button" class="button-primary" data-action="task-accept">接受并加入项目</button></div>`);
  }
  function mailPreview() {
    if (blocked('gmail')) { open(`<span class="eyebrow">邮箱权限已关闭</span><h2>无法预览邮件</h2><p>你在设置中关闭了 Gmail 演示权限。重新打开后才能查看此预览。</p><div class="modal-actions"><button type="button" class="button-secondary" data-action="close">关闭</button><button type="button" class="button-primary" data-action="settings">查看设置</button></div>`); return; }
    open(`<span class="eyebrow">Gmail 演示邮件 · 08:06</span><h2>先看邮件，再决定状态</h2><div class="mail-preview"><div>发件人 <strong>导师 · 研究讨论</strong></div><div>主题 <strong>本周研究进度</strong></div><p>演示用户，你的方法部分进展如何？有时间请把本周修订计划发我一份，我们周四讨论。</p></div><p class="notice">此处为个人学术邮件演示；工作邮件正文权限单独管理。确认只更改本页的演示标签，不会修改 Gmail。</p><div class="modal-actions"><button type="button" class="button-secondary" data-action="close">保持原状</button><button type="button" class="button-primary" data-action="mail-confirm">标记为待回复</button></div>`);
  }
  function calendarPreview() {
    if (blocked('calendar')) { open(`<span class="eyebrow">日历权限已关闭</span><h2>无法查看写入预览</h2><p>你在设置中关闭了日历演示权限。重新打开后才能预览。</p><div class="modal-actions"><button type="button" class="button-secondary" data-action="close">关闭</button><button type="button" class="button-primary" data-action="settings">查看设置</button></div>`); return; }
    open(`<span class="eyebrow">日历写入预览 · 演示数据</span><h2>预留论文修订时间</h2><div class="detail-block"><strong>将建立的安排</strong><p>10 月 12 日（周一）14:00–16:00<br>论文修订：方法部分<br>日历：个人学习</p></div><p>今日计划确认与日历写入是两次独立决定。这里的确认只更改本页演示状态，不会写入真实日历。</p>${state.plan ? '' : '<p class="notice">请先确认今日计划，再决定是否写入日历。</p>'}<div class="modal-actions"><button type="button" class="button-secondary" data-action="close">暂不写入</button><button type="button" class="button-primary" data-action="calendar-confirm" ${state.plan ? '' : 'disabled title="请先确认今日计划"'}>确认日历安排</button></div>`);
  }
  function settings() {
    const rows = [
      ['calendar','日历','读取安排与演示写入预览'],
      ['gmail','Gmail','读取个人学术邮件预览'],
      ['finance','投资账户','仅供读取；Schwab 本次待完成'],
      ['workBody','工作邮件正文','跨领域使用需单独授权；当前示例不读取']
    ];
    open(`<span class="eyebrow">本机演示设置</span><h2>来源与权限</h2><p>来源连接仅展示状态，本轮不演示撤销连接。工作邮件正文的单独授权选择保存在此浏览器中；无真实账户连接。</p><div class="settings-grid">${rows.map(([key,name,note]) => `<div class="permission-row"><div><strong>${name}</strong><small>${note}</small></div>${key === 'workBody' ? `<button type="button" class="toggle ${state.permissions[key] ? 'on' : ''}" data-toggle="${key}" aria-pressed="${state.permissions[key]}">${state.permissions[key] ? '已开' : '已关'}</button>` : `<span class="connection-state">${key === 'finance' ? '检查待完成' : '演示已读取'}</span>`}</div>`).join('')}</div><div class="detail-block warn"><strong>当前缺失</strong><p>Schwab 上次数据为 10 月 10 日 17:40；本次 08:24 检查待完成。因此不展示投资总额或总财富。银行、Drive、知识库与 Codex 项目未纳入本原型。</p></div><div class="modal-actions"><button type="button" class="button-secondary" data-action="reset">重置演示状态</button><button type="button" class="button-primary" data-action="close">完成</button></div>`);
  }
  function assistant() {
    open(`<span class="eyebrow">问工作站 · 模拟回答</span><h2>从今天的上下文追问</h2><p>下面是预设演示问题，回答不会调用 AI 或读取新数据。</p><button type="button" class="assistant-question" data-action="answer-capacity">今天下午还能安排多久？</button><button type="button" class="assistant-question" data-action="answer-source">统计作业的截止时间有多确定？</button><div id="assistant-answer" class="assistant-answer" hidden></div><div class="modal-actions"><button type="button" class="button-secondary" data-action="close">关闭</button></div>`);
  }
  function news() {
    open(`<span class="eyebrow">新闻条目 · 演示数据</span><h2>新型芯片封装投资升温</h2><div class="detail-block"><strong>来源事实</strong><p>演示条目：产业新闻在 08:20 更新，主题为芯片封装领域的投资活动。此原型未连接真实新闻源。</p></div><div class="detail-block inference"><strong>AI 解读</strong><p>与关注的半导体领域可能有关；目前不能从这个标题推断个人持仓影响，也不构成交易建议。</p></div><p class="notice">投资数据只读；Schwab 检查尚未完成，账户覆盖不完整。</p><div class="modal-actions"><button type="button" class="button-secondary" data-action="close">关闭</button></div>`);
  }
  document.addEventListener('click', event => {
    const view = event.target.closest('[data-view]');
    if (view) { show(view.dataset.view); return; }
    const toggle = event.target.closest('[data-toggle]');
    if (toggle) { const key = toggle.dataset.toggle; if (key !== 'workBody') return; const label = toggle.closest('.permission-row').querySelector('strong').textContent; state.permissions[key] = !state.permissions[key]; save(); settings(); modal.querySelector(`[data-toggle="${key}"]`).focus(); announce(`${label}演示权限已${state.permissions[key] ? '开启' : '关闭'}`); return; }
    const button = event.target.closest('[data-action]');
    if (!button) return;
    switch (button.dataset.action) {
      case 'settings': settings(); break;
      case 'ask': assistant(); break;
      case 'close': close(); break;
      case 'task-preview': taskPreview(); break;
      case 'mail-preview': mailPreview(); break;
      case 'calendar-preview': calendarPreview(); break;
      case 'news': news(); break;
      case 'plan-confirm': state.plan = true; save(); sync(); announce('今日计划已在本页确认；日历仍需单独确认。'); break;
      case 'task-accept': {
        const project = document.getElementById('task-project').value;
        const noDeadline = document.getElementById('task-no-deadline').checked;
        const date = document.getElementById('task-date').value;
        const time = document.getElementById('task-time').value;
        if (!noDeadline && (!date || !time)) { announce('请选择截止日期和时间，或勾选不设截止。'); (!date ? document.getElementById('task-date') : document.getElementById('task-time')).focus(); break; }
        state.task = true; state.taskProject = project; state.taskDeadline = noDeadline ? null : `${date}T${time}`;
        save(); sync(); close(); announce('统计作业已按你确认的设置加入项目。'); break;
      }
      case 'mail-confirm': state.mail = true; save(); sync(); close(); announce('邮件已在本页标记为待回复。'); break;
      case 'calendar-confirm': if (state.plan && state.permissions.calendar) { state.calendar = true; save(); sync(); close(); announce('日历安排已在本页确认。'); } break;
      case 'answer-capacity': {
        const answer = document.getElementById('assistant-answer'); answer.hidden = false;
        answer.innerHTML = `今天 09:30–17:30 的 8 小时演示时段中，已确认安排 3 小时 30 分，论文修订建议 2 小时，尚可安排 2 小时 30 分。${state.plan ? '计划已在本页确认。' : '建议尚未确认。'}<small>预设模拟回答 · 基于本页演示数据，无实时 AI 调用</small>`; break;
      }
      case 'answer-source': {
        const answer = document.getElementById('assistant-answer'); answer.hidden = false;
        answer.innerHTML = '邮件原文只写「周三前交」。2026 年 10 月 14 日是周三；23:59 是系统为演示补全的时间，需要你核对课程要求。<small>预设模拟回答 · 原文事实与 AI 推断分开显示</small>'; break;
      }
      case 'reset': state = structuredClone(defaults); save(); sync(); show('today'); close(); announce('演示状态已重置。'); break;
    }
  });
  sync(); show(state.view);
})();
