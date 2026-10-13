(function () {
  'use strict';
  const M = window.ObservatoryModel;
  const $ = selector => document.querySelector(selector);
  const state = {work:M.createState(),newsFilter:'全部',assetFilter:'全部',menuOpen:false};
  const names = {today:'今日动态',schedule:'日程和待办',news:'新闻热点',investing:'投资观察',research:'研究跟踪'};
  let route = M.parseRoute(location.hash);
  let lastDialogFocus = null;
  let toastTimer;
  const link = (kind,id) => `#/${kind}/${id}`;
  const topicLink = topic => `<a class="entity-link" href="${link('research',topic.id)}">${topic.title}<span aria-hidden="true">↗</span></a>`;
  const assetLink = asset => `<a class="entity-link asset-link" href="${link('investing',asset.id)}"><strong>${asset.symbol}</strong><span>${asset.name}</span><span aria-hidden="true">↗</span></a>`;
  const eventLink = event => `<a class="entity-link" href="${link('news',event.id)}">${event.title}<span aria-hidden="true">↗</span></a>`;
  const smallArrow = '<span aria-hidden="true">↗</span>';
  function toast(message){const el=$('#toast');el.textContent=message;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),3200);}
  function openModal(id){lastDialogFocus=document.activeElement;$(id).showModal();}
  function closeModal(dialog){dialog.close();lastDialogFocus?.focus?.();}
  function closeMenu(){state.menuOpen=false;$('#sidebar').classList.remove('menu-open');$('#menuButton').setAttribute('aria-expanded','false');$('#menuButton').setAttribute('aria-label','打开主导航');}
  function pageIntro(kicker,title,description,extra=''){return `<div class="page-intro"><div><p class="kicker">${kicker}</p><h1>${title}<span class="period">.</span></h1><p class="intro-desc">${description}</p></div>${extra}</div>`;}
  function updateChrome(){
    $('#topPageName').textContent=names[route.view];
    document.title=`${names[route.view]} · 信号观察室 v2`;
    document.querySelectorAll('[data-nav]').forEach(el=>{const active=el.dataset.nav===route.view;el.classList.toggle('active',active);if(active)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');});
    $('#navInboxCount').textContent=state.work.inbox.length;
  }
  function renderToday(){
    const lead=M.events[1], topic=M.topics[0], asset=M.assets[0];
    const changes=[lead,M.events[2],M.events[3]];
    return `${pageIntro('2026 年 10 月 12 日 · 周一 / 演示数据','今天，先看与你有关的变化','从研究主题、关注标的与已确认安排出发。变化先核对，再决定是否进入行动。',`<a class="intro-link" href="#/research/inference">进入研究跟踪 ${smallArrow}</a>`)}
      <div class="today-layout"><section class="today-feed"><div class="section-heading"><div><span class="eyebrow">自上次查看以来</span><h2>三件值得留意的事</h2></div><span class="section-small">上次查看：昨天 20:10</span></div>
      <div class="change-stack">${changes.map((e,index)=>`<article class="change-item"><div class="change-index">0${index+1}</div><div><div class="meta-line"><span class="${e.status==='更正'?'mauve-text':'yellow-text'}">${e.status}</span><span>${e.domain}</span><span>今天 ${e.time}</span></div><h3><a href="${link('news',e.id)}">${e.title}${smallArrow}</a></h3><p>${e.summary}</p><div class="change-connections"><span>关联研究</span>${e.topicIds.map(id=>topicLink(M.byId(M.topics,id))).join('')}</div></div></article>`).join('')}</div>
      <div class="brief-strip"><span>今日简报</span><p>工作站对 AI 规格的摘要已更正；利率与政策信息仍在观察阶段。今天没有必须改动的已确认日程。</p><a href="#/news/atlas">读完整新闻 ${smallArrow}</a></div>
      <div class="today-related"><div><span class="eyebrow">研究线索</span><h3>${topic.title}</h3><p>${topic.judgment}</p><a href="${link('research',topic.id)}">继续研究 ${smallArrow}</a></div><div><span class="eyebrow">标的观察 · 只读</span><h3>${asset.symbol} <small>${asset.name}</small></h3><p>${asset.note}</p><a href="${link('investing',asset.id)}">查看标的关联 ${smallArrow}</a></div></div></section>
      <aside class="today-aside"><div class="aside-section"><span class="eyebrow">今天的时间</span><h2>有安排，也留有空白。</h2><div class="mini-schedule"><div><time>09:00</time><span>推理成本研究笔记<small>已确认 · 90 分钟</small></span></div><div><time>11:00</time><span>原型同步<small>已确认 · 30 分钟</small></span></div><div><time>14:00</time><span>Atlas 规格核对<small>建议 · 尚未确认</small></span></div></div><a class="button-outline full" href="#/schedule/calendar">查看日程和待办 ${smallArrow}</a></div>
      <div class="aside-section"><span class="eyebrow">待整理箱</span><div class="inbox-summary"><strong>${state.work.inbox.length}</strong><span>条行动等待接受和分配。新闻或研究不会直接改动日程。</span></div><a class="plain-link" href="#/schedule/inbox">打开待整理箱 ${smallArrow}</a></div>
      ${runtimePanel()}</aside></div>`;
  }
  function runtimePanel(){return `<details class="runtime"><summary><span class="status-dot"></span> 数据与运行状态 <span class="summary-arrow">⌄</span></summary><dl><div><dt>最近数据</dt><dd>今天 07:40</dd></div><div><dt>最近检查</dt><dd>今天 07:43</dd></div><div><dt>最近成功</dt><dd>今天 07:40</dd></div></dl><p>恢复后待补查：06:00–07:40 新闻更新。补查完成前不声称覆盖完整。</p><p>Schwab：今日 07:42 读取失败；持仓仅显示 10 月 11 日 18:20 快照。</p></details>`;}
  function renderSchedule(){
    const tab=route.tab||'calendar';
    return `${pageIntro('时间 / 任务 / 项目','日程和待办','已确认安排、待整理行动与项目任务各自保留状态。任务分配不会改变日历。')}
      <div class="subtabs" role="tablist" aria-label="日程和待办子页"><a role="tab" aria-selected="${tab==='calendar'}" class="${tab==='calendar'?'active':''}" href="#/schedule/calendar">日程</a><a role="tab" aria-selected="${tab==='inbox'}" class="${tab==='inbox'?'active':''}" href="#/schedule/inbox">待整理箱 <span>${state.work.inbox.length}</span></a><a role="tab" aria-selected="${tab==='projects'}" class="${tab==='projects'?'active':''}" href="#/schedule/projects/cost-study">项目</a></div>
      ${tab==='calendar'?renderCalendar():tab==='inbox'?renderInbox():renderProjects()}`;
  }
  function renderCalendar(){return `<div class="schedule-layout"><section class="panel schedule-panel"><div class="section-heading"><div><span class="eyebrow">周一 · 10 月 12 日</span><h2>今天的安排</h2></div><span class="section-small">可用专注时间 4 小时 30 分</span></div>
    <div class="schedule-list"><div class="schedule-entry"><time>09:00<br><small>10:30</small></time><div><strong>推理成本研究笔记</strong><p>学习 / 已确认</p></div><span class="tag confirmed">已确认</span></div><div class="schedule-entry"><time>11:00<br><small>11:30</small></time><div><strong>原型同步</strong><p>工作 / 已确认</p></div><span class="tag confirmed">已确认</span></div><div class="schedule-entry suggested"><time>14:00<br><small>15:00</small></time><div><strong>阅读 Atlas 技术说明</strong><p>建议时间 · 来源于 AI 推理成本主题</p></div><span class="tag">建议</span></div><div class="schedule-entry suggested"><time>16:00<br><small>16:30</small></time><div><strong>整理家庭周安排</strong><p>建议时间 · 需你决定</p></div><span class="tag">建议</span></div></div>
    <div class="plan-confirm"><div><strong>${state.work.planConfirmed?'今日计划已确认':'建议计划待你确认'}</strong><p>确认仅保存在本页；写入日历和发送邮件需要分别确认，演示版未连接账户。</p></div><button class="button-primary" id="confirmPlan" ${state.work.planConfirmed?'disabled title="计划已在本页确认"':''}>${state.work.planConfirmed?'已确认':'确认今日计划'}</button></div></section>
    <aside class="panel schedule-side"><span class="eyebrow">下一步</span><h2>任务有自己的归属。</h2><p>研究行动先进入待整理箱，选择项目后才成为项目任务。建议时间不会自动占用已确认日程。</p><a class="button-outline full" href="#/schedule/inbox">查看待整理箱 ${smallArrow}</a><div class="callout-line"><strong>日历 / 邮件</strong><p>本原型无真实连接或写入。</p><button class="button-disabled" disabled title="演示版未连接日历或邮箱">写入日历 / 发送邮件 · 未连接</button></div></aside></div>`;}
  function renderInbox(){
    const items=state.work.inbox;
    return `<div class="inbox-page"><div class="inbox-intro"><span class="eyebrow">等待你的决定</span><h2>${items.length} 条待整理行动</h2><p>选择项目并接受后才进入项目任务。日期依次区分来源事件日期、建议处理日期与用户决定。</p></div>${items.length?`<div class="inbox-cards">${items.map(item=>`<article class="inbox-card" data-inbox-item="${item.actionId}"><div><span class="item-origin">研究行动 / 待接受</span><h3>${item.title}</h3><p class="source-line">${item.source}</p><div class="date-provenance"><span>来源事件日期 <strong>${item.date.source.value}</strong></span><span>建议处理日期 <strong>${item.date.suggestion.value}</strong></span><span>用户决定 <strong>尚未选择</strong></span></div></div><div class="inbox-controls"><label>分配项目<select data-project><option value="">请选择项目</option>${M.projects.map(p=>`<option value="${p.id}" ${p.id===item.suggestedProject?'selected':''}>${p.name}</option>`).join('')}</select></label><label>你决定的日期 <small>可留空</small><input data-user-date type="date" min="2026-10-12"></label><button class="button-primary" data-accept="${item.actionId}">接受并分配</button></div></article>`).join('')}</div>`:`<div class="empty-panel"><div class="empty-symbol">⌁</div><h3>还没有待整理行动</h3><p>从研究主题选择一个下一步，它会先出现在这里。</p><a class="button-outline" href="#/research/inference">前往研究跟踪 ${smallArrow}</a></div>`}<div class="inbox-foot"><span>${state.work.tasks.length} 条已接受任务</span><a href="#/schedule/projects/cost-study">在项目中查看 ${smallArrow}</a></div></div>`;
  }
  function renderProjects(){
    const project=M.byId(M.projects,route.id)||M.projects[0];
    const tasks=state.work.tasks.filter(item=>item.projectId===project.id);
    return `<div class="projects-layout"><div class="project-selector"><span class="eyebrow">工作 / 学习 / 家庭</span>${M.projects.map(p=>`<a class="project-choice ${p.id===project.id?'active':''}" href="#/schedule/projects/${p.id}" ${p.id===project.id?'aria-current="true"':''}><span>${p.area}</span><strong>${p.name}</strong><small>${p.detail}</small></a>`).join('')}</div><section class="project-detail"><div class="project-detail-head"><span class="eyebrow">${project.area}项目</span><h2>${project.name}</h2><p>${project.detail}</p></div><div class="project-next"><span>当前下一步</span><strong>${project.next}</strong></div><div class="section-heading"><div><span class="eyebrow">已接受</span><h3>项目任务</h3></div><span class="section-small">${tasks.length} 条来自研究的任务</span></div>${tasks.length?tasks.map(item=>`<article class="accepted-task"><span class="task-mark">✓</span><div><strong>${item.title}</strong><p>${item.source}</p><div class="date-provenance"><span>来源事件 ${item.date.source.value}</span><span>建议处理 ${item.date.suggestion.value}</span><span>用户决定 ${item.date.user?item.date.user.value:'未设置'}</span></div></div></article>`).join(''):`<p class="project-empty">当前没有从研究中接受的任务。项目现有安排保持独立。</p>`}<a class="plain-link" href="#/schedule/inbox">查看待整理箱 ${smallArrow}</a></section></div>`;
  }
  const newsGroups=[{id:'atlas',ids:['atlas','atlas-fix'],domain:'AI 技术',title:'Atlas 推理规格与工作站更正',time:'07:40',summary:'原始说明条件完整；工作站 07:25 摘要遗漏，07:40 更正。'},{id:'yields',ids:['yields'],domain:'宏观',title:'利率预期变化',time:'06:55',summary:'将单日变化放入长期利率研究。'},{id:'consultation',ids:['consultation'],domain:'地缘政策',title:'计算设备政策草案',time:'06:20',summary:'草案进入征询，尚未生效。'}];
  function renderNews(){
    const e=M.byId(M.events,route.id)||M.events[0];
    const filtered=newsGroups.filter(g=>state.newsFilter==='全部'||g.domain===state.newsFilter);
    const selectedGroup=newsGroups.find(g=>g.ids.includes(e.id));
    if(!filtered.some(g=>g.id===selectedGroup.id)){state.newsFilter='全部';}
    const visible=newsGroups.filter(g=>state.newsFilter==='全部'||g.domain===state.newsFilter);
    return `${pageIntro('事件阅读 / 来源可核对','新闻热点','按事件聚合，再追溯新增和更正。事件可进入长期研究，也可查看关联标的。',`<span class="intro-stat">3 条事件<br><strong>4 条记录</strong></span>`)}<div class="three-pane"><aside class="list-pane"><div class="list-pane-head"><span class="eyebrow">事件流</span><div class="filter-row">${['全部','AI 技术','宏观','地缘政策'].map(f=>`<button class="filter-chip ${state.newsFilter===f?'active':''}" data-news-filter="${f}" aria-pressed="${state.newsFilter===f}">${f}</button>`).join('')}</div></div><div class="entity-list">${visible.map(g=>`<a class="entity-choice ${g.id===selectedGroup.id?'active':''}" href="#/news/${g.id}" ${g.id===selectedGroup.id?'aria-current="true"':''}><span class="choice-meta">${g.domain} / 今天 ${g.time}</span><strong>${g.title}</strong><small>${g.summary}</small></a>`).join('')}</div></aside>
      <article class="reading-pane"><div class="article-meta"><span class="${e.status==='更正'?'mauve-text':'yellow-text'}">${e.status}</span><span>${e.domain}</span><time>今天 ${e.time}</time></div><h2>${e.title}</h2><p class="article-deck">${e.summary}</p>${selectedGroup.ids.length>1?`<div class="revision-tabs"><span>此事件的记录</span><a href="#/news/atlas" class="${e.id==='atlas'?'active':''}">新增 07:20</a><a href="#/news/atlas-fix" class="${e.id==='atlas-fix'?'active':''}">更正 07:40</a></div>`:''}<div class="reading-section"><h3>已确认的演示文本</h3><p>这是一条用于界面验证的虚构事件。下面的摘录保留来源措辞，与工作站分析分开展示。</p><blockquote><span>来源摘录 / ${e.source}</span>“${e.quote}”</blockquote><p class="provenance">发布 ${e.sourceTime} · ${e.provenance}</p></div><div class="reading-section"><h3>更正与判断</h3><p>${e.correction}</p><div class="inference"><span>AI 推断 · 演示</span><p>${e.analysis}</p></div><button class="text-button" data-source="${e.id}">查看完整来源与修订记录 ${smallArrow}</button></div></article>
      <aside class="relation-pane"><span class="eyebrow">延伸阅读</span><h3>把事件放回脉络。</h3><div class="relation-block"><span>关联研究主题</span>${e.topicIds.map(id=>topicLink(M.byId(M.topics,id))).join('')}</div><div class="relation-block"><span>关联标的 · 只读</span>${e.assetIds.map(id=>assetLink(M.byId(M.assets,id))).join('')}</div><p class="relation-note">新闻不会自动创建任务。研究主题中可选择具体下一步。</p></aside></div>`;
  }
  function renderResearch(){
    const topic=M.byId(M.topics,route.id)||M.topics[0];
    const brief=M.researchBriefs[topic.id];
    const action=M.byId(M.actions,topic.actionId);
    const pending=state.work.inbox.some(item=>item.actionId===action.id);
    const accepted=state.work.tasks.some(item=>item.actionId===action.id);
    const changes=brief.changes.map(change=>{
      const event=M.byId(M.events,change.eventId);
      return `<article class="research-change"><div class="research-change-date"><time>${change.date}</time><span class="${change.kind.includes('更正')?'mauve-text':'yellow-text'}">${change.kind}</span></div><div><div class="research-field"><span>来源事实</span><p>${change.fact}</p></div><div class="research-field effect"><span>对判断的影响</span><p>${change.effect}</p></div><p class="research-source">来源发布时间 ${event.sourceTime} · ${event.source}</p><a href="${link('news',event.id)}">查看事件与来源 ${smallArrow}</a></div></article>`;
    }).join('');
    const questions=brief.verification.map((item,index)=>`<details class="verify-question" ${index===0?'open':''}><summary><span class="verify-number">0${index+1}</span><strong>${item.question}</strong><span class="verify-state">${item.status}</span><span class="verify-chevron" aria-hidden="true">⌄</span></summary><div class="verify-body"><div><span>还需要什么证据</span><p>${item.needed}</p></div><div><span>何时改变判断</span><p>${item.trigger}</p></div></div></details>`).join('');
    const impacts=M.assetsForTopic(topic.id).map(asset=>{
      const impact=brief.impacts[asset.id];
      return `<article class="impact-item"><div class="impact-title"><div><span>${asset.kind} · ${asset.account}</span><h4>${asset.symbol} <small>${asset.name}</small></h4></div><a href="${link('investing',asset.id)}" aria-label="查看 ${asset.symbol} 投资观察">↗</a></div><div class="impact-direction">${impact.direction}</div><dl><div><dt>传导路径</dt><dd>${impact.path}</dd></div><div><dt>时间范围</dt><dd>${impact.horizon}</dd></div><div><dt>前提</dt><dd>${impact.assumption}</dd></div><div><dt>尚未知</dt><dd>${impact.unknown}</dd></div></dl></article>`;
    }).join('');
    return `${pageIntro('长期议题 / 证据随时间累积','研究跟踪','记录长期议题的新变化、判断是否改变，以及对关联标的的有条件影响。',`<span class="intro-stat">3 个主题<br><strong>演示研究记录</strong></span>`)}<div class="three-pane research-pane"><aside class="list-pane"><div class="list-pane-head"><span class="eyebrow">正在跟踪</span><p>本轮收录的变化与研究判断；覆盖并不完整。</p></div><div class="entity-list">${M.topics.map(t=>{const b=M.researchBriefs[t.id];return `<a class="entity-choice research-choice ${t.id===topic.id?'active':''}" href="${link('research',t.id)}" ${t.id===topic.id?'aria-current="true"':''}><span class="choice-meta">${t.domain} / ${t.updated}</span><strong>${t.title}</strong><span class="research-choice-status ${b.statusTone}">${b.status}</span><small>本轮收录 ${b.changes.length} 条变化 · ${t.question}</small></a>`;}).join('')}</div></aside>
      <article class="reading-pane research-reading"><div class="article-meta"><span class="yellow-text">${topic.code}</span><span>${topic.domain}</span><span>演示数据</span></div><h2>${topic.title}</h2><div class="research-question"><span>核心问题</span><p>${topic.question}</p></div><div class="research-meta"><div><span>本次比较区间</span><strong>${brief.window}</strong></div><div><span>上次成功对照</span><strong>${brief.baseline}</strong></div><div><span>最近检查</span><strong>${brief.checked}</strong></div><div class="wide"><span>本轮覆盖</span><strong>${brief.coverage}</strong></div></div>
      <nav class="research-jumps" aria-label="主题章节"><button data-research-jump="changes">新变化</button><button data-research-jump="judgment">判断对照</button><button data-research-jump="verify">待验证</button><button data-research-jump="impact">标的影响</button></nav>
      <section id="research-judgment" class="research-section judgment-compare" tabindex="-1"><div class="research-section-head"><span>工作站研究判断 · 演示</span><h3>这次，判断如何变化</h3></div><div class="judgment-result ${brief.statusTone}"><span>${brief.status}</span><p>${brief.result}</p></div><div class="judgment-pair"><div><span>上次判断 / ${brief.prior.date}</span><p>${brief.prior.text}</p></div><div><span>当前判断 / ${brief.current.date}</span><p>${brief.current.text}</p></div></div><div class="judgment-notes"><p><strong>改变原因</strong>${brief.reason}</p><p><strong>把握与保留意见</strong>${brief.confidence}</p></div></section>
      <section id="research-changes" class="research-section" tabindex="-1"><div class="research-section-head"><span>本轮收录 · ${brief.changes.length} 条</span><h3>新变化与判断影响</h3></div><div class="research-change-list">${changes}</div><div class="uncertainty"><strong>潜在反证与证据缺口</strong><p>${brief.uncertainty}</p></div></section>
      <section id="research-verify" class="research-section" tabindex="-1"><div class="research-section-head"><span>${brief.verification.length} 个开放问题 · 等待证据</span><h3>继续验证的问题</h3></div><div class="verify-list">${questions}</div></section>
      <details class="research-history"><summary>展开判断历史 <span aria-hidden="true">⌄</span></summary><div class="judgment-history"><div><time>${brief.prior.date}</time><span>上次判断</span><p>${brief.prior.text}</p></div><div><time>${brief.current.date}</time><span>当前判断 · ${brief.status}</span><p>${brief.current.text}</p><small>修订原因：${brief.reason}</small></div></div><h4>关联证据记录</h4><div class="evidence-timeline">${topic.evidence.map(item=>`<div class="evidence-item"><time>${item.date}</time><div><span class="${item.kind.includes('更正')?'mauve-text':''}">${item.kind}</span><p>${item.text}</p>${item.eventId?`<a href="${link('news',item.eventId)}">查看事件与来源 ${smallArrow}</a>`:''}</div></div>`).join('')}</div></details>
      ${topic.image?`<details class="research-history visual-note"><summary>展开专题配图说明 <span aria-hidden="true">⌄</span></summary><figure class="image-placeholder"><span class="image-label">图片占位</span><figcaption>编辑图像建议：真实算力设施的暗场纪实摄影，少量柔紫光点；16:7 横幅。图像不承载证据或行情。</figcaption></figure></details>`:''}</article>
      <aside class="relation-pane research-impact-pane" id="research-impact" tabindex="-1"><span class="eyebrow">条件性演示分析 · 只读</span><h3>关联标的影响</h3><p class="impact-intro">方向取决于前提是否成立。主题与标的可往返查看，不构成交易建议。</p><div class="impact-evidence"><span>本轮事件证据</span>${brief.changes.map(change=>eventLink(M.byId(M.events,change.eventId))).join('')}</div><div class="impact-list">${impacts}</div><div class="impact-coverage"><strong>账户覆盖仍不完整</strong><p>Robinhood 为演示只读数据；Schwab 07:42 读取失败，仅有 10.11 18:20 快照。不能据此判断完整组合影响。</p></div><div class="action-panel"><span>建议行动 / 先入待整理箱</span><strong>${action.title}</strong><p>你选项目并接受后才成为项目任务，不改变已确认日计划。</p><button class="button-primary full" data-enqueue="${action.id}" ${pending||accepted?`disabled title="${accepted?'已接受并分配到项目':'已在待整理箱'}"`:''}>${accepted?'已成为项目任务':pending?'已在待整理箱':'加入待整理箱'}</button><a href="${accepted?`#/schedule/projects/${state.work.tasks.find(item=>item.actionId===action.id).projectId}`:'#/schedule/inbox'}">${accepted?'查看项目任务':'查看待整理箱'} ${smallArrow}</a></div></aside></div>`;
  }
  function renderInvesting(){
    const asset=M.byId(M.assets,route.id)||M.assets[0];
    if(state.assetFilter!=='全部'&&asset.kind!==state.assetFilter)state.assetFilter='全部';
    const visible=M.assets.filter(a=>state.assetFilter==='全部'||a.kind===state.assetFilter);
    return `${pageIntro('只读 / 部分覆盖','投资观察','把标的放进研究主题，而不是把不完整账户相加成一个总资产数字。行情与持仓均为虚构演示。',`<button class="intro-link button-link" id="accountButton">账户覆盖详情 ${smallArrow}</button>`)}<div class="invest-layout"><aside class="asset-list"><div class="list-pane-head"><span class="eyebrow">持仓与关注</span><div class="filter-row">${['全部','持仓','关注'].map(f=>`<button class="filter-chip ${state.assetFilter===f?'active':''}" data-asset-filter="${f}" aria-pressed="${state.assetFilter===f}">${f}</button>`).join('')}</div></div><div class="entity-list">${visible.map(a=>`<a class="entity-choice asset-choice ${a.id===asset.id?'active':''}" href="${link('investing',a.id)}" ${a.id===asset.id?'aria-current="true"':''}><span class="choice-meta">${a.kind} / ${a.account}</span><strong>${a.symbol} <small>${a.name}</small></strong><span class="asset-bottom">${a.value}<em>${a.change}</em></span></a>`).join('')}</div></aside><article class="asset-detail"><div class="asset-detail-top"><span class="eyebrow">${asset.kind} · ${asset.account}</span><h2>${asset.symbol}<small>${asset.name}</small></h2><div class="asset-meta"><span>${asset.value}</span><span>演示日变动 ${asset.change}</span><span>数据 ${asset.update}</span></div></div><div class="reading-section"><h3>为什么在观察</h3><p>${asset.note}</p></div><div class="reading-section"><h3>当前要问的问题</h3><p class="asset-question">${asset.question}</p></div><div class="reading-section"><h3>关联研究主题</h3><p>从标的进入长期议题，阅读判断与证据变化。</p><div class="topic-link-grid">${M.topicsForAsset(asset.id).map(t=>`<a href="${link('research',t.id)}"><span>${t.domain}</span><strong>${t.title}</strong><small>${t.question}</small><b aria-hidden="true">↗</b></a>`).join('')}</div></div><div class="read-only-note">只读演示 · 无交易操作。关联不构成投资建议。</div></article><aside class="invest-side"><span class="eyebrow">数据边界</span><h3>只展示看得见的部分。</h3><div class="coverage-mini"><div><span class="status-dot"></span><strong>Robinhood</strong><small>演示只读成功 · 07:30</small></div><div><span class="status-dot amber"></span><strong>Charles Schwab</strong><small>07:42 读取失败；上次成功 10.11 18:20</small></div><div><span class="status-dot mauve"></span><strong>其他账户</strong><small>未连接，覆盖未知</small></div></div><button class="text-button" id="accountButtonSide">查看详细覆盖 ${smallArrow}</button><p>不展示跨账户合计、收益排名或交易建议。</p></aside></div>`;
  }
  function showSource(eventId){const e=M.byId(M.events,eventId);if(!e)return;$('#sourceBody').innerHTML=`<h2>${e.title}</h2><p>本事件为虚构演示。来源摘录、整理判断及更正分开展示。</p><blockquote>“${e.quote}”</blockquote><dl class="modal-facts"><div><dt>来源</dt><dd>${e.source}</dd></div><div><dt>发布时间</dt><dd>${e.sourceTime}</dd></div><div><dt>可追溯性</dt><dd>${e.provenance}</dd></div><div><dt>修订</dt><dd>${e.correction}</dd></div></dl>`;openModal('#sourceDialog');}
  function showAccounts(){$('#accountBody').innerHTML=`<h2>只读覆盖，不计算总额</h2><p>以下账户与持仓均为演示。读取失败的数据保留时间标记，不与其他账户相加。</p><dl class="modal-facts"><div><dt>Robinhood</dt><dd>演示持仓读取成功 · 最近数据 10.12 07:30 · 最近检查 07:31 · 只读</dd></div><div><dt>Charles Schwab</dt><dd>最近检查 10.12 07:42 失败 · 最近成功 10.11 18:20 · 页面仅显示旧快照，不声称当前完整</dd></div><div><dt>其他账户</dt><dd>未连接；覆盖未知，不能推断总资产。</dd></div><div><dt>恢复缺口</dt><dd>06:00–07:40 的新闻更新待补查；补查完成前标记为部分覆盖。</dd></div></dl><p>没有银行连接、交易按钮或写入权限。</p>`;openModal('#accountDialog');}
  function renderNotice(){$('#noticeBody').innerHTML=`<div class="notice-item"><span class="status-dot mauve"></span><p><strong>07:40 工作站更正</strong><br>Atlas 原始说明已有配置条件；工作站 07:25 摘要遗漏，现已更正。<a href="#/news/atlas-fix" data-dialog-link>查看更正 ↗</a></p></div><div class="notice-item"><span class="status-dot amber"></span><p><strong>07:42 读取失败</strong><br>Schwab 使用 10.11 18:20 的旧快照。<button class="inline-button" id="noticeAccounts">查看覆盖</button></p></div><p>消息仅显示在本站内；没有真实后台监测或推送。</p>`;openModal('#noticeDialog');}
  function render(){route=M.parseRoute(location.hash);updateChrome();const html={today:renderToday,schedule:renderSchedule,news:renderNews,investing:renderInvesting,research:renderResearch}[route.view]();$('#mainContent').innerHTML=html;closeMenu();}
  window.addEventListener('hashchange',()=>{render();window.scrollTo(0,0);});
  document.addEventListener('click',event=>{
    const btn=event.target.closest('button');if(!btn)return;
    if(btn.dataset.close!==undefined){closeModal(btn.closest('dialog'));return;}
    if(btn.dataset.researchJump){
      const section=document.getElementById(`research-${btn.dataset.researchJump}`);
      if(section){section.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});section.focus({preventScroll:true});}
      return;
    }
    if(btn.dataset.newsFilter){
      state.newsFilter=btn.dataset.newsFilter;
      const selected=newsGroups.find(group=>group.ids.includes(route.id));
      if(state.newsFilter!=='全部'&&selected?.domain!==state.newsFilter){
        location.hash=`#/news/${newsGroups.find(group=>group.domain===state.newsFilter).id}`;
      }else render();
      return;
    }
    if(btn.dataset.assetFilter){
      state.assetFilter=btn.dataset.assetFilter;
      const selected=M.byId(M.assets,route.id);
      if(state.assetFilter!=='全部'&&selected?.kind!==state.assetFilter){
        location.hash=`#/investing/${M.assets.find(asset=>asset.kind===state.assetFilter).id}`;
      }else render();
      return;
    }
    if(btn.dataset.source){showSource(btn.dataset.source);return;}
    if(btn.dataset.enqueue){const next=M.enqueueAction(state.work,btn.dataset.enqueue);if(next===state.work){toast('这条行动已在待整理箱或项目中');return;}state.work=next;render();toast('已加入待整理箱，等待你接受并分配');return;}
    if(btn.dataset.accept){const card=btn.closest('[data-inbox-item]');const project=card.querySelector('[data-project]').value;const date=card.querySelector('[data-user-date]').value;if(!project){toast('请先选择项目');card.querySelector('[data-project]').focus();return;}state.work=M.acceptAction(state.work,btn.dataset.accept,project,date);location.hash=`#/schedule/projects/${project}`;render();toast('已接受并分配到项目，今日计划没有改变');return;}
    switch(btn.id){
      case 'menuButton':state.menuOpen=!state.menuOpen;$('#sidebar').classList.toggle('menu-open',state.menuOpen);btn.setAttribute('aria-expanded',String(state.menuOpen));btn.setAttribute('aria-label',state.menuOpen?'关闭主导航':'打开主导航');break;
      case 'confirmPlan':state.work=M.confirmPlan(state.work);render();toast('今日计划已在本页确认');break;
      case 'accountButton':case 'accountButtonSide':case 'noticeAccounts':if(btn.id==='noticeAccounts')closeModal($('#noticeDialog'));showAccounts();break;
      case 'permissionButton':$('#mailCheckbox').checked=state.work.mailPermission;openModal('#permissionDialog');break;
      case 'savePermission':state.work={...state.work,mailPermission:$('#mailCheckbox').checked};closeModal($('#permissionDialog'));toast(state.work.mailPermission?'已保存跨领域演示权限':'已关闭跨领域演示权限');break;
      case 'assistantButton':openModal('#assistantDialog');break;
      case 'noticeButton':renderNotice();break;
    }
  });
  document.addEventListener('click',event=>{const link=event.target.closest('a[data-dialog-link]');if(link)closeModal(link.closest('dialog'));});
  document.querySelectorAll('dialog').forEach(dialog=>{dialog.addEventListener('click',event=>{if(event.target===dialog)closeModal(dialog);});dialog.addEventListener('close',()=>lastDialogFocus?.focus?.());});
  $('#assistantForm').addEventListener('submit',event=>{event.preventDefault();const question=$('#assistantInput').value.trim();if(!question)return;const output=$('#assistantOutput');const context=route.view==='research'?M.byId(M.topics,route.id).judgment:route.view==='news'?M.byId(M.events,route.id).analysis:route.view==='investing'?M.byId(M.assets,route.id).note:route.view==='schedule'?'任务先经待整理箱和项目分配；确认计划是独立操作。':'今天的 AI 规格有更正，利率与政策仍在观察。';output.innerHTML='<p><strong>你问：</strong><span id="assistantQuestion"></span></p><p><strong>模拟回答：</strong>'+context+' 这是当前页面的预设回答，请继续核对来源。</p>';$('#assistantQuestion').textContent=question;$('#assistantInput').value='';});
  if(!location.hash)location.hash='#/today';else render();
})();
