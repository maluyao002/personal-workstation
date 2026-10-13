const signals = [
  {
    id: 'atlas', domain: 'AI 技术', type: '新增', time: '07:40',
    title: 'Atlas 推理芯片公布：重点是长上下文的单位成本',
    abstract: '虚构厂商的新规格值得核对，但还不能直接换算到现有部署。',
    deck: 'Northstar Compute 的演示公告给出一组长上下文吞吐数字。对你的推理成本研究，真正需要确认的是测量条件、内存价格与软件迁移成本。',
    source: '演示来源：Northstar Compute 产品说明（虚构）', sourceTime: '2026.10.12 07:20',
    sourceQuote: '在 128K 上下文、批量 32 的演示配置下，Atlas X2 的输出吞吐提升 2.1 倍。',
    provenance: '官方产品说明（演示文本）；本页未连接真实新闻源。',
    revision: '新增记录。07:40 整理，尚未经过独立基准测试验证。',
    facts: [
      ['已披露', '演示配置为 128K 上下文、批量 32；厂商声称输出吞吐为上一代的 2.1 倍。'],
      ['未披露', '完整功耗曲线、可用实例价格、较小批量下的结果与迁移工时。'],
      ['核对点', '寻找独立测试，并以你的真实请求长度重新计算每百万 token 成本。']
    ],
    inference: '如果工作负载确实接近厂商演示条件，单位成本可能改善；目前不能据此替换预算中的基线价格。这是工作站的演示性推断，不是来源原文。',
    relation: { project: '推理成本研究', projectText: '本周正在比较长上下文推理方案。先记录待验证参数，再决定是否更新成本表。', calendar: '今天 09:00—10:30 已安排研究笔记。建议在这段时间加入 15 分钟规格核对。', holding: '没有可确认的直接持仓关联。投资信息只读且覆盖不完整。' },
    action: '核对 Atlas X2 的测量条件与独立基准', actionProject: '推理成本研究',
    image: true
  },
  {
    id: 'atlas-correction', domain: 'AI 技术', type: '更正', time: '07:40',
    title: 'Atlas 吞吐对比补上批量条件',
    abstract: '早间记录缺少“批量 32”，现已标明更正。',
    deck: '07:05 的演示摘录只写了“提升 2.1 倍”。核对产品说明后，发现该数字对应批量 32 与 128K 上下文；先前表述过宽。',
    source: '演示来源：Northstar Compute 产品说明修订页（虚构）', sourceTime: '2026.10.12 07:35',
    sourceQuote: '2.1 倍输出吞吐基于 128K 上下文、批量 32 的演示配置。',
    provenance: '虚构修订页与本页 07:05 的演示摘录对照。',
    revision: '更正：07:05 记录未写出“批量 32”；07:40 已补充，原记录保留在此。',
    facts: [['原记录', '“输出吞吐提升 2.1 倍”，缺少条件。'], ['更正后', '“在 128K 上下文、批量 32 的演示配置下，输出吞吐提升 2.1 倍。”']],
    inference: '对低并发或短请求工作负载，演示增益不能直接套用。这是工作站的演示性推断。',
    relation: { project: '推理成本研究', projectText: '成本表应保留配置条件，避免把厂商演示数字当成普遍结果。', calendar: '今天研究笔记时可一并核对。', holding: '没有可确认的直接持仓关联。' },
    action: '在成本表中注明 Atlas 比较条件', actionProject: '推理成本研究', image: false
  },
  {
    id: 'rates', domain: '宏观', type: '新增', time: '06:55',
    title: '利率预期小幅变化，先看本周数据',
    abstract: '宏观速览；没有足够证据改动个人计划。',
    deck: '演示市场简报显示，短端利率预期略有上移。本周仍有关键数据公布，单日价格变化不足以推断趋势。',
    source: '演示来源：市场日评样稿（虚构）', sourceTime: '2026.10.12 06:55',
    sourceQuote: '短端利率预期较上周五小幅上移，市场等待本周通胀与就业数据。',
    provenance: '虚构日评样稿；未连接市场数据，也不提供投资建议。',
    revision: '新增记录。当前没有更正。',
    facts: [['已知', '演示日评描述短端预期小幅上移。'], ['未知', '后续经济数据与政策表态。']],
    inference: '保持观察即可；这条变化与今天的已确认安排没有直接冲突。这是工作站的演示性推断。',
    relation: { project: '暂无直接项目', projectText: '可保留在宏观观察，不必自动创建任务。', calendar: '今天没有需要因这条消息调整的已确认日程。', holding: 'Schwab 读取失败，无法判断最新持仓暴露；页面不展示账户总额。' },
    action: '本周复核利率预期与数据差异', actionProject: '暂不分配', image: false
  },
  {
    id: 'policy', domain: '地缘政策', type: '新增', time: '06:20',
    title: '出口审查草案进入征询期',
    abstract: '政策仍在草案阶段；先标记时间节点。',
    deck: '虚构政策简报提到，一份计算设备出口审查草案开放意见征询。文本尚未定稿，影响范围取决于最终条款。',
    source: '演示来源：政策征询公告样稿（虚构）', sourceTime: '2026.10.12 06:20',
    sourceQuote: '有关计算设备的出口审查草案自发布日起进入公开意见征询期。',
    provenance: '虚构公告样稿；尚无真实法规或适用范围可供判断。',
    revision: '新增记录。当前没有更正。',
    facts: [['阶段', '草案征询，非已生效规则。'], ['待确认', '最终定义、地域范围与生效日期。']],
    inference: '对于推理成本研究，可留意供应链变量；现在不应将草案写成既定限制。这是工作站的演示性推断。',
    relation: { project: '推理成本研究', projectText: '仅作背景变量，待正式文本公布再评估。', calendar: '没有需要修改的已确认日程。', holding: '没有足够的最新账户数据判断直接影响。' },
    action: '留意出口审查草案的正式文本', actionProject: '推理成本研究', image: false
  }
];

const state = { view: 'signals', filter: '全部', selected: 'atlas', inbox: [], planConfirmed: false, mailPermission: false };
const $ = (selector) => document.querySelector(selector);
const getSelected = () => signals.find(signal => signal.id === state.selected) || signals[0];
let toastTimer;
let activeDialogOpener = null;

function toast(message) {
  const element = $('#toast'); element.textContent = message; element.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => element.classList.remove('show'), 3400);
}
function openDialog(dialog) { activeDialogOpener = document.activeElement; dialog.showModal(); }
function closeDialog(dialog) { dialog.close(); if (activeDialogOpener?.focus) activeDialogOpener.focus(); }

function renderDomains() {
  const domains = ['全部', 'AI 技术', '宏观', '地缘政策'];
  $('#domainList').innerHTML = domains.map(domain => {
    const count = domain === '全部' ? signals.length : signals.filter(signal => signal.domain === domain).length;
    return `<button class="domain-chip ${state.filter === domain ? 'active' : ''}" data-domain="${domain}" aria-pressed="${state.filter === domain}">${domain}<span class="chip-count">${count}</span></button>`;
  }).join('');
  $('#signalCount').textContent = state.filter === '全部' ? signals.length : signals.filter(s => s.domain === state.filter).length;
}
function renderList() {
  const list = signals.filter(signal => state.filter === '全部' || signal.domain === state.filter);
  $('#signalList').innerHTML = list.map(signal => `<button class="signal-item ${state.selected === signal.id ? 'active' : ''}" data-signal="${signal.id}" aria-pressed="${state.selected === signal.id}"><span class="signal-meta"><span class="signal-label ${signal.type === '更正' ? 'corrected' : ''}">${signal.type}</span><span>${signal.domain}</span><span>${signal.time}</span></span><strong>${signal.title}</strong><span class="signal-abstract">${signal.abstract}</span></button>`).join('');
}
function renderReading() {
  const s = getSelected();
  const facts = s.facts.map(([label, content]) => `<div class="fact-row"><span>${label}</span><span>${content}</span></div>`).join('');
  $('#readingPane').innerHTML = `<div class="article-meta"><span class="article-status ${s.type === '更正' ? 'corrected' : ''}">${s.type}</span><span class="dot"></span><span>${s.domain}</span><span class="dot"></span><span>今天 ${s.time}</span></div><h2>${s.title}</h2><p class="article-deck">${s.deck}</p><div class="article-byline"><span aria-hidden="true">观</span><span>工作站整理 / 演示数据</span><span>·</span><span>约 3 分钟</span></div>${s.image ? `<figure class="editorial-image"><span class="image-label">图片占位</span><figcaption class="image-caption">编辑图像建议：算力机房纪实摄影，暗场中保留少量柔紫色光点；16:7 横幅。仅用于阅读氛围，不承载数据。</figcaption></figure>` : ''}<section class="article-section"><h3>发生了什么</h3><p>${s.deck}</p><div class="fact-list">${facts}</div></section><section class="article-section"><h3>来源原文与工作站判断</h3><p>来源摘录与推断分开展示。此页的来源均为虚构演示文本，不代表真实世界事件。</p><div class="source-excerpt"><span>来源摘录 / ${s.source}</span><p>“${s.sourceQuote}”</p></div><div class="inference"><div class="inference-label">AI 推断 · 演示</div><p>${s.inference}</p></div><button class="source-action" id="sourceDetailButton">查看完整来源信息与修订记录 ↗</button></section>`;
}
function renderContext() {
  const s = getSelected();
  const inInbox = state.inbox.some(item => item.signalId === s.id);
  $('#contextContent').innerHTML = `<p class="context-eyebrow">与我的关联</p><h3>信息到了这里，<br>才考虑行动。</h3><div class="relation-block"><h4>进行中的项目</h4><p class="relation-detail">${s.relation.project}</p><p>${s.relation.projectText}</p></div><div class="relation-block"><h4>今天的时间</h4><p>${s.relation.calendar}</p></div><div class="relation-block"><h4>持仓关联 · 只读</h4><p>${s.relation.holding}</p><span class="stale-note">Schwab：上次成功 10 月 11 日 18:20 / 本次读取失败 · 账户覆盖不完整</span></div><div class="context-action"><p class="context-eyebrow">下一步</p><p class="action-brief">${s.action}</p><button class="primary-button" id="addInboxButton" ${inInbox ? 'disabled title="已在任务箱中"' : ''}>${inInbox ? '已加入任务箱' : '加入待处理任务箱'}</button><p class="pending-note">加入后仍待你接受、分配项目；不会自动进入今日计划。</p></div>`;
}
function renderSignals() { renderDomains(); renderList(); renderReading(); renderContext(); }
function updateInboxCounters() { const count = state.inbox.filter(item => !item.accepted).length; ['#inboxCount','#todayInboxCount','#projectsInboxCount'].forEach(selector => $(selector).textContent = count); }
function switchView(view) {
  state.view = view;
  document.querySelectorAll('.view').forEach(section => { const active = section.id === `${view}View`; section.classList.toggle('active', active); section.hidden = !active; });
  document.querySelectorAll('.nav-item').forEach(button => { const active = button.dataset.view === view; button.classList.toggle('active', active); if (active) button.setAttribute('aria-current', 'page'); else button.removeAttribute('aria-current'); });
  window.scrollTo({top: 0, behavior: 'instant'});
}
function showSource() {
  const s = getSelected();
  $('#sourceDialogContent').innerHTML = `<div class="source-dialog-body"><h2>${s.title}</h2><p>来源摘录独立于工作站分析显示。以下内容均为演示材料。</p><div class="source-quote">“${s.sourceQuote}”</div><div class="source-detail-list"><div><span>来源</span><span>${s.source}</span></div><div><span>发布时间</span><span>${s.sourceTime}</span></div><div><span>可追溯性</span><span>${s.provenance}</span></div></div><div class="source-revision">${s.revision}</div></div>`;
  openDialog($('#sourceDialog'));
}
function showInbox() { renderInbox(); openDialog($('#inboxDialog')); }
function renderInbox() {
  const container = $('#inboxDialogContent');
  if (!state.inbox.length) { container.innerHTML = '<div class="inbox-empty">任务箱还是空的。从信号阅读页选择“加入待处理任务箱”，再决定是否接受。</div>'; return; }
  container.innerHTML = `<div class="inbox-list">${state.inbox.map(item => `<div class="inbox-item"><div><h3>${item.title}</h3><p>来自 ${item.source} · ${item.accepted ? `已分配到 ${item.project}` : '等待你接受与分配'}</p>${item.accepted ? '' : `<select data-project-for="${item.signalId}" aria-label="为 ${item.title} 选择项目"><option value="推理成本研究" ${item.project === '推理成本研究' ? 'selected' : ''}>推理成本研究</option><option value="工作站原型" ${item.project === '工作站原型' ? 'selected' : ''}>工作站原型</option><option value="家庭周计划" ${item.project === '家庭周计划' ? 'selected' : ''}>家庭周计划</option></select>`}</div>${item.accepted ? '<span class="inbox-accepted">已接受</span>' : `<button class="primary-button" data-accept="${item.signalId}">接受并分配</button>`}</div>`).join('')}</div>`;
}

document.addEventListener('click', event => {
  const target = event.target.closest('button'); if (!target) return;
  if (target.dataset.view) { switchView(target.dataset.view); return; }
  if (target.dataset.domain) { state.filter = target.dataset.domain; const visible = signals.filter(s => state.filter === '全部' || s.domain === state.filter); if (!visible.some(s => s.id === state.selected)) state.selected = visible[0].id; renderSignals(); return; }
  if (target.dataset.signal) { state.selected = target.dataset.signal; renderSignals(); return; }
  if (target.dataset.closeDialog !== undefined) { closeDialog(target.closest('dialog')); return; }
  if (target.dataset.accept) { const item = state.inbox.find(entry => entry.signalId === target.dataset.accept); if (item) { item.accepted = true; renderInbox(); updateInboxCounters(); toast(`已接受并分配到${item.project}`); } return; }
  switch (target.id) {
    case 'filterReset': state.filter = '全部'; renderSignals(); break;
    case 'sourceDetailButton': showSource(); break;
    case 'addInboxButton': { const s = getSelected(); if (!state.inbox.some(item => item.signalId === s.id)) { state.inbox.push({signalId:s.id,title:s.action,source:s.title,project:s.actionProject === '暂不分配' ? '推理成本研究' : s.actionProject,accepted:false}); updateInboxCounters(); renderContext(); toast('已加入待处理任务箱，仍待接受与分配'); } break; }
    case 'openInboxButton': case 'todayInboxButton': case 'projectsInboxButton': showInbox(); break;
    case 'confirmPlanButton': state.planConfirmed = true; $('#planStatus').textContent = '今日计划已在本页确认。日历与邮件操作仍需分别确认。'; target.textContent = '今日计划已确认'; target.disabled = true; toast('今日计划已确认（仅本页演示）'); break;
    case 'askButton': openDialog($('#assistantDialog')); break;
    case 'notificationButton': openDialog($('#notificationDialog')); break;
    case 'permissionButton': $('#permissionCheckbox').checked = state.mailPermission; openDialog($('#permissionDialog')); break;
    case 'savePermissionButton': state.mailPermission = $('#permissionCheckbox').checked; $('#permissionStatus').textContent = state.mailPermission ? '演示授权已开启：可用于学习、家庭与项目关联。此页仍不读取真实邮件。' : '仅可用于工作邮件视图。用于学习、家庭或项目关联前，需要你单独授权。'; closeDialog($('#permissionDialog')); toast(state.mailPermission ? '已保存跨领域演示权限' : '已关闭跨领域演示权限'); break;
    case 'runtimeToggle': { const panel = $('#runtimePanel'); const open = panel.hidden; panel.hidden = !open; target.setAttribute('aria-expanded', String(open)); break; }
  }
});
document.addEventListener('change', event => { if (event.target.matches('select[data-project-for]')) { const item = state.inbox.find(entry => entry.signalId === event.target.dataset.projectFor); if (item) item.project = event.target.value; } });
document.querySelectorAll('dialog').forEach(dialog => { dialog.addEventListener('click', event => { if (event.target === dialog) closeDialog(dialog); }); dialog.addEventListener('close', () => { if (activeDialogOpener?.focus) activeDialogOpener.focus(); }); });
$('#assistantForm').addEventListener('submit', event => { event.preventDefault(); const input = $('#assistantInput'); const question = input.value.trim(); if (!question) return; const s = getSelected(); $('#assistantTranscript').innerHTML = `<p><strong>你问：</strong><span id="questionText"></span></p><p><strong>模拟回答：</strong>${s.relation.projectText} 下一步可先${s.action}。这是基于当前演示页面的预设回答，请核对来源摘录。</p>`; $('#questionText').textContent = question; input.value = ''; });
renderSignals(); updateInboxCounters(); switchView('signals');
