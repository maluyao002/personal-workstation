(() => {
  const views = [...document.querySelectorAll('.view')];
  const navButtons = [...document.querySelectorAll('.rail-link')];
  const backdrop = document.getElementById('dialogBackdrop');
  const dialog = backdrop.querySelector('.dialog');
  const dialogContent = document.getElementById('dialogContent');
  const toast = document.getElementById('toast');
  let returnFocus = null;
  let toastTimer = null;
  let acceptedTask = null;
  let planConfirmed = false;
  let confirmedPlan = null;
  let mailPermission = false;
  let readingItem = null;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3300);
  }

  function switchView(name) {
    views.forEach(view => {
      const selected = view.id === `view-${name}`;
      view.hidden = !selected;
      view.classList.toggle('is-visible', selected);
    });
    navButtons.forEach(button => {
      const selected = button.dataset.view === name;
      button.classList.toggle('is-active', selected);
      if (selected) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    window.scrollTo({ top: 0, behavior: 'auto' });
    document.title = `${({today:'今日手册',projects:'项目',investments:'投资概览',settings:'设置与边界'})[name]} · 个人工作站`;
  }

  function openDialog(content) {
    returnFocus = document.activeElement;
    dialogContent.innerHTML = content;
    backdrop.hidden = false;
    document.body.style.overflow = 'hidden';
    setTimeout(() => dialog.focus(), 0);
  }
  function closeDialog() {
    backdrop.hidden = true;
    dialogContent.innerHTML = '';
    document.body.style.overflow = '';
    if (returnFocus && !returnFocus.disabled && typeof returnFocus.focus === 'function') returnFocus.focus();
    else document.querySelector('.rail-link.is-active')?.focus();
  }
  document.getElementById('closeDialog').addEventListener('click', closeDialog);
  backdrop.addEventListener('click', event => { if (event.target === backdrop) closeDialog(); });
  document.addEventListener('keydown', event => {
    if (backdrop.hidden) return;
    if (event.key === 'Escape') { closeDialog(); return; }
    if (event.key !== 'Tab') return;
    const focusable = [...dialog.querySelectorAll('button:not([disabled]), select, textarea, a[href]')].filter(el => !el.hidden);
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  function openTask() {
    if (acceptedTask) return showToast('这项任务已加入项目。');
    openDialog(`<p class="micro-label">新任务建议 · 演示数据</p><h2 id="dialogTitle">收进本周任务</h2><p class="dialog-lead">整理研究提纲，准备周三讨论所需的三个重点问题。</p><div class="dialog-facts"><div><span>建议截止</span><span>2026 年 10 月 14 日，周三</span></div><div><span>日期依据</span><span>任务提示中的“本周三” · 推断，待你确认</span></div><div><span>来源</span><span>工作消息摘要示例 · 未读取邮件正文</span></div></div><label for="taskProject">归属项目</label><select id="taskProject"><option value="个人工作站">个人工作站</option><option value="秋季阅读计划">秋季阅读计划</option></select><label for="taskDueMode">截止日期</label><select id="taskDueMode"><option value="suggested">采纳建议：10 月 14 日（推断）</option><option value="custom">修改日期</option><option value="none">不设置截止日期</option></select><div id="customDateWrap" hidden><label for="taskDueDate">确认的截止日期</label><input id="taskDueDate" type="date" value="2026-10-14"></div><p id="taskDateError" class="field-error" role="alert" hidden></p><p class="notice">接受只会把任务放进当前页面的演示任务箱；不会写入日历或项目服务。</p><div class="dialog-actions"><button class="secondary-button" data-close>暂不接受</button><button class="primary-button" id="confirmTask">接受任务</button></div>`);
    document.getElementById('taskDueMode').addEventListener('change', event => {
      document.getElementById('customDateWrap').hidden = event.target.value !== 'custom';
      document.getElementById('taskDateError').hidden = true;
    });
    document.getElementById('confirmTask').addEventListener('click', () => {
      let task;
      try {
        task = TaskState.acceptResearchTask({
          project: document.getElementById('taskProject').value,
          dueMode: document.getElementById('taskDueMode').value,
          dueDate: document.getElementById('taskDueDate').value
        });
      } catch (error) {
        const message = document.getElementById('taskDateError');
        message.textContent = error.message; message.hidden = false;
        return;
      }
      acceptedTask = task;
      const summary = TaskState.deadlineSummary(task);
      const strip = document.getElementById('inboxStrip');
      strip.querySelector('.micro-label').textContent = '已收进任务箱';
      strip.querySelector('h3').textContent = `研究提纲 · ${task.deadline ? '已确认截止日期' : '未设截止日期'}`;
      strip.querySelector('p:last-child').textContent = `归属：${task.project}。${summary}`;
      const button = strip.querySelector('button');
      button.textContent = '已接受'; button.disabled = true;
      document.getElementById('projectInboxStatus').textContent = `研究提纲已加入「${task.project}」。${summary}`;
      document.getElementById('projectAccept').textContent = '已接受任务';
      const planNote = planConfirmed && confirmedPlan.project !== task.project
        ? `已确认日计划仍归属「${confirmedPlan.project}」，不会自动修改。`
        : '今天 13:30–16:00 的空档可用于初稿。';
      document.getElementById('weeklyFocusText').textContent = `研究提纲归属「${task.project}」；${summary}。${planNote}`;
      closeDialog(); showToast(planConfirmed && confirmedPlan.project !== task.project
        ? `任务已归属「${task.project}」；已确认日计划保持不变。`
        : `已加入「${task.project}」的演示任务箱。`);
    });
  }

  function renderConfirmedPlan() {
    const plan = TaskState.planForResearch(acceptedTask, confirmedPlan);
    const row = document.querySelector('.time-row.free');
    row.querySelector('.event-type').textContent = '演示计划 · 已在本页确认';
    row.querySelector('h3').textContent = `研究提纲初稿 · ${plan.project}`;
    row.querySelector('p').textContent = plan.timeline;
    row.querySelector('.inline-link').textContent = '本页计划已确认';
    row.querySelector('.inline-link').disabled = true;
  }

  function openPlan() {
    if (planConfirmed) return showToast('今天的演示计划已经确认。');
    const plan = TaskState.planForResearch(acceptedTask);
    openDialog(`<p class="micro-label">安排建议 · 仅预览</p><h2 id="dialogTitle">把午后的空档用起来</h2><p class="dialog-lead">${plan.preview}</p><div class="dialog-facts"><div><span>13:30–15:00</span><span>研究提纲初稿 · ${plan.project}</span></div><div><span>15:00–16:00</span><span>缓冲时间 · 不安排任务</span></div><div><span>冲突检查</span><span>与本页已确认安排无冲突</span></div></div><p class="notice">确认只改变本页时间轴的演示计划状态。若要写入真实日历，需要另行确认日历操作；此原型不连接日历。</p><div class="dialog-actions"><button class="secondary-button" data-close>保持空档</button><button class="primary-button" id="confirmPlan">确认本页计划</button></div>`);
    document.getElementById('confirmPlan').addEventListener('click', () => {
      confirmedPlan = TaskState.planForResearch(acceptedTask);
      planConfirmed = true;
      renderConfirmedPlan();
      closeDialog(); showToast('本页计划已确认；未写入日历。');
    });
  }

  const stories = {
    ai: `<p class="micro-label">科技观察 · 2026 年 10 月 12 日 08:10</p><h2 id="dialogTitle">AI 工具开始改变个人知识工作的节奏</h2><p class="dialog-lead">这是一则演示阅读内容，用来展示每日简报如何把主题变化放进今天的工作情境。</p><p class="read-subheading">值得留意的变化</p><p>越来越多的工具把搜索、整理和下一步行动放在同一个流程中。对个人工作站来说，关键是让人看清信息从哪里来，以及哪一步需要自己确认。</p><p class="read-subheading">与你的今天有什么关系</p><p>上午的研究笔记时间可用于整理访谈中出现的重复问题。午后安排建议仍只是建议，确认后也仅更改本页。</p><p class="read-source">来源：演示资讯摘要；非实时新闻。更新时间：08:10。无外部链接或 AI 调用。</p><div class="dialog-actions"><button class="secondary-button" data-close>读完了</button><button class="primary-button" id="storyTask">加入待整理任务箱</button></div>`,
    market: `<p class="micro-label">市场观察 · 2026 年 10 月 12 日 07:45</p><h2 id="dialogTitle">本周科技板块关注什么</h2><p class="dialog-lead">这是一则演示市场简报，说明新闻如何与持仓主题建立阅读关联。</p><p class="read-subheading">主题线索</p><p>科技企业的产品发布、资本开支与业绩预期常会影响板块讨论。这里只提示值得核对的主题，不预测价格，也不给出买卖建议。</p><p class="read-subheading">账户边界</p><p>示例 Robinhood 个人与退休账户为只读；Schwab 最近检查失败。由于账户不完整，不能据此得出总资产或完整仓位比例。</p><p class="read-source">来源：演示资讯摘要与示例账户标签；非实时行情。简报时间 07:45，账户检查时间 08:05–08:06。</p><div class="dialog-actions"><button class="secondary-button" data-close>读完了</button><button class="primary-button" id="openFinanceFromStory">查看账户状态</button></div>`
  };
  function openStory(which) {
    const story = which === 'ai' && readingItem
      ? stories.ai.replace('加入待整理任务箱', readingItem.status === 'pending' ? '查看待整理任务' : '查看所属项目')
      : stories[which];
    openDialog(story);
    const add = document.getElementById('storyTask');
    if (add) add.addEventListener('click', () => {
      if (readingItem) {
        const pending = readingItem.status === 'pending';
        closeDialog(); switchView(pending ? 'today' : 'projects');
        if (pending) document.getElementById('readingInboxStrip').scrollIntoView({ behavior: 'auto', block: 'center' });
        showToast(pending ? '阅读任务仍在待整理箱。' : `阅读任务已归属「${readingItem.project}」。`);
        return;
      }
      if (!readingItem) {
        readingItem = TaskState.queueReading();
        document.getElementById('readingInboxStrip').hidden = false;
        document.getElementById('projectReadingStatus').hidden = false;
        document.getElementById('projectReadingStatus').textContent = '阅读任务在待整理箱，尚未归属项目。';
        document.getElementById('projectReadingOpen').hidden = false;
      }
      closeDialog(); showToast('已加入待整理任务箱；尚未进入日程。');
    });
    const finance = document.getElementById('openFinanceFromStory');
    if (finance) finance.addEventListener('click', () => { closeDialog(); switchView('investments'); });
  }
  function openReadingTask() {
    if (!readingItem || readingItem.status === 'accepted') return showToast('阅读任务已整理。');
    openDialog(`<p class="micro-label">待整理任务 · 演示数据</p><h2 id="dialogTitle">把阅读放进一个项目</h2><p class="dialog-lead">阅读《AI 工具与个人知识工作的节奏》。这项任务来自每日简报，目前还没有项目或日程安排。</p><label for="readingProject">归属项目</label><select id="readingProject"><option value="秋季阅读计划">秋季阅读计划</option><option value="个人工作站">个人工作站</option></select><p class="notice">接受后只归属项目；不设置截止日期，也不会写入时间轴或日历。</p><div class="dialog-actions"><button class="secondary-button" data-close>留在待整理箱</button><button class="primary-button" id="confirmReading">接受阅读任务</button></div>`);
    document.getElementById('confirmReading').addEventListener('click', () => {
      readingItem = { ...readingItem, status: 'accepted', project: document.getElementById('readingProject').value };
      const strip = document.getElementById('readingInboxStrip');
      strip.querySelector('.micro-label').textContent = '已归属项目';
      document.getElementById('readingInboxText').textContent = `归属：${readingItem.project}。未设置截止日期；未安排日程。`;
      const button = document.getElementById('acceptReading');
      button.textContent = '已接受'; button.disabled = true;
      document.getElementById('projectReadingStatus').textContent = `阅读任务已加入「${readingItem.project}」，未设置截止日期。`;
      document.getElementById('projectReadingOpen').textContent = '已接受阅读任务';
      closeDialog(); showToast(`阅读任务已归属「${readingItem.project}」；未安排日程。`);
    });
  }
  function openAssistant() {
    openDialog(`<p class="micro-label">问工作站 · 本地演示</p><h2 id="dialogTitle">从今天开始提问</h2><p class="dialog-lead">输入一个关于本页演示日程、项目或账户状态的问题。回答由预设规则生成，不调用 AI，也不读取账户。</p><label for="assistantQuestion">你的问题</label><textarea id="assistantQuestion" placeholder="例如：下午适合做什么？"></textarea><div class="dialog-actions"><button class="secondary-button" data-close>关闭</button><button class="primary-button" id="askLocal">查看演示回答</button></div><div id="assistantAnswer" aria-live="polite"></div>`);
    document.getElementById('askLocal').addEventListener('click', () => {
      const query = document.getElementById('assistantQuestion').value.trim();
      const lower = query.toLowerCase();
      const answer = !query ? '先输入一个问题，我会根据本页演示信息给出预设回答。' : /投资|账户|schwab|robinhood|资产|钱|股票/.test(lower) ? 'Robinhood 两个示例账户在 08:05 完成只读检查；Schwab 在 08:06 检查失败。账户数据不完整，因此无法给出总资产。投资页面可查看各账户状态。' : /项目|任务|研究|提纲/.test(lower) ? `「个人工作站」目前完成 3/5 个演示里程碑。${acceptedTask ? `研究提纲已加入「${acceptedTask.project}」。${TaskState.deadlineSummary(acceptedTask)}。` : '研究提纲仍在新任务箱，接受时可选择项目与截止日期。'}` : /下午|时间|日程|今天|安排/.test(lower) ? `${planConfirmed ? `已在本页确认 13:30–15:00 的「${confirmedPlan.project}」研究提纲时间。` : '13:30–16:00 有完整空档，建议先预览研究提纲的安排。'}17:30 有已确认的家庭晚餐。` : '我只能根据这个静态演示中的日程、项目与账户状态回答。试试问“下午适合做什么？”';
      document.getElementById('assistantAnswer').innerHTML = `<div class="assistant-answer"><p>${answer}</p></div>`;
    });
  }

  navButtons.forEach(button => button.addEventListener('click', () => switchView(button.dataset.view)));
  document.querySelectorAll('[data-jump]').forEach(button => button.addEventListener('click', () => switchView(button.dataset.jump)));
  document.querySelectorAll('[data-story]').forEach(button => button.addEventListener('click', () => openStory(button.dataset.story)));
  document.getElementById('acceptTask').addEventListener('click', openTask);
  document.getElementById('projectAccept').addEventListener('click', openTask);
  document.getElementById('acceptReading').addEventListener('click', openReadingTask);
  document.getElementById('projectReadingOpen').addEventListener('click', openReadingTask);
  document.getElementById('previewPlan').addEventListener('click', openPlan);
  document.getElementById('projectPlan').addEventListener('click', openPlan);
  document.getElementById('openAssistant').addEventListener('click', openAssistant);
  document.getElementById('dateInfo').addEventListener('click', () => openDialog(`<p class="micro-label">日期说明</p><h2 id="dialogTitle">2026 年 10 月 12 日，星期一</h2><p>这是一份固定日期的演示手册。安排、简报、任务与账户状态都是示例数据，页面不会随真实日期更新。</p><div class="dialog-actions"><button class="primary-button" data-close>知道了</button></div>`));
  document.getElementById('mailPermission').addEventListener('click', () => {
    if (mailPermission) return showToast('工作邮件正文仅在本页演示中标记为已授权。');
    openDialog(`<p class="micro-label">单独授权 · 本页演示</p><h2 id="dialogTitle">工作邮件正文</h2><p class="dialog-lead">工作邮件正文可能包含私人与组织信息。跨领域使用需要你单独决定；已有的新闻与持仓、工作与家庭日历许可不会自动覆盖这里。</p><p class="notice">点击下方确认只更新本页的演示状态。不会读取邮箱，也不会将邮件内容用于项目、家庭或投资视图。</p><div class="dialog-actions"><button class="secondary-button" data-close>保持未授权</button><button class="primary-button" id="confirmMail">仅在本页标记授权</button></div>`);
    document.getElementById('confirmMail').addEventListener('click', () => { mailPermission = true; const button = document.getElementById('mailPermission'); button.textContent = '本页演示已授权'; button.setAttribute('aria-pressed', 'true'); closeDialog(); showToast('仅本页演示状态已更新；未读取邮箱。'); });
  });
  dialogContent.addEventListener('click', event => { if (event.target.closest('[data-close]')) closeDialog(); });
})();
