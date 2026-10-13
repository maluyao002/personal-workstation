(function (root) {
  'use strict';
  const DEMO_DATE = '2026-10-12';
  const topics = [
    {id:'inference',domain:'AI 技术趋势',title:'AI 推理成本',code:'研究 01',updated:'今天 07:40',question:'长上下文推理的单位成本，何时会真正下降？',judgment:'核对原始厂商说明后，工作站更正了遗漏配置条件的摘要。吞吐改善仅限演示条件；成本基线暂不变，仍需独立测试与报价。',confidence:'待核对',thesis:'把模型能力、请求长度、批量、能耗和软件迁移放在同一张成本表里，避免只比较芯片吞吐。',assetIds:['nvda','msft'],eventIds:['atlas','atlas-fix'],actionId:'check-benchmark',image:true,evidence:[{date:'10.12 07:40',kind:'工作站更正',text:'核对 07:20 原始说明后，更正 07:25 摘要遗漏的批量 32 与 128K 上下文条件。',eventId:'atlas-fix'},{date:'10.12 07:20',kind:'新增',text:'Northstar Compute 公布已注明配置条件的 Atlas X2 演示规格。',eventId:'atlas'},{date:'10.08',kind:'研究记录',text:'基线表仍采用现有云实例报价；尚未纳入 Atlas。'}],questions:['独立基准能否复现长上下文吞吐？','小批量请求的延迟与单位成本如何变化？','部署迁移和内存配置需要多少额外成本？']},
    {id:'rates',domain:'宏观经济',title:'利率与资产定价',code:'研究 02',updated:'今天 06:55',question:'利率预期变化会如何改变久期资产的估值？',judgment:'单日利率预期的小幅上移不足以改写中期判断。先观察本周数据与实际利率，再核对 TLT 和黄金的不同敏感度。',confidence:'观察中',thesis:'按名义利率、通胀预期和实际利率拆解影响，不把单日波动当成长期结论。',assetIds:['tlt','gold'],eventIds:['yields'],actionId:'check-rates',image:false,evidence:[{date:'10.12 06:55',kind:'新增',text:'演示市场日评记录短端利率预期小幅上移。',eventId:'yields'},{date:'10.09',kind:'研究记录',text:'保留久期与实际利率两个观察指标。'}],questions:['本周数据会改变实际利率方向吗？','TLT 的久期风险在当前组合中有多大？','黄金与实际利率的关系是否受到其他变量干扰？']},
    {id:'policy',domain:'地缘政治',title:'中美科技政策',code:'研究 03',updated:'今天 06:20',question:'政策草案会怎样传导到 AI 供应链与软件生态？',judgment:'目前只有征询草案，不能将潜在限制写成已生效规则。关注最终定义、地域范围和企业应对披露。',confidence:'等待正式文本',thesis:'分开追踪法规阶段、供应链暴露和企业响应；事件有进展时再调整主题判断。',assetIds:['nvda','msft','gold'],eventIds:['consultation'],actionId:'watch-policy',image:false,evidence:[{date:'10.12 06:20',kind:'新增',text:'演示公告样稿称计算设备出口审查草案进入征询。',eventId:'consultation'},{date:'10.06',kind:'研究记录',text:'建立“草案 / 正式文本 / 生效”阶段记录。'}],questions:['正式文本如何定义适用设备？','企业会如何披露地域收入与供给调整？','政策不确定性会否转移到避险资产？']}
  ];
  const assets = [
    {id:'nvda',symbol:'NVDA',name:'英伟达',kind:'持仓',account:'Robinhood',value:'演示持仓 8 股',change:'+1.8%',update:'10.12 07:30',topicIds:['inference','policy'],note:'同时暴露于推理需求与科技政策。价格与持仓均为虚构演示。',question:'独立基准和政策最终文本分别会怎样影响预期？'},
    {id:'msft',symbol:'MSFT',name:'微软',kind:'关注',account:'关注清单',value:'未持有（演示）',change:'+0.6%',update:'10.12 07:30',topicIds:['inference','policy'],note:'云推理成本与全球业务政策变量均值得跟踪。',question:'新硬件成本能否传导到服务价格与利润率？'},
    {id:'tlt',symbol:'TLT',name:'长期美国国债 ETF',kind:'持仓',account:'Robinhood',value:'演示持仓 12 股',change:'−0.4%',update:'10.12 07:30',topicIds:['rates'],note:'对利率变化较敏感。这里只提供研究关联，不提出交易建议。',question:'组合的久期暴露是否符合原先的风险预算？'},
    {id:'gold',symbol:'黄金',name:'黄金观察',kind:'关注',account:'关注清单',value:'未持有（演示）',change:'+0.2%',update:'10.12 07:30',topicIds:['rates','policy'],note:'关联实际利率与地缘不确定性，但不同情境下方向不固定。',question:'这次变化由实际利率还是避险需求主导？'}
  ];
  const events = [
    {id:'atlas',domain:'AI 技术',status:'新增',time:'07:20',title:'Atlas X2 公布长上下文推理演示规格',summary:'原始厂商说明已注明 128K 上下文、批量 32；真实单位成本仍需核对。',source:'Northstar Compute 产品说明样稿（虚构）',sourceTime:'2026.10.12 07:20',quote:'在 128K 上下文、批量 32 的演示配置下，Atlas X2 输出吞吐提升 2.1 倍。',correction:'07:40 工作站更正 07:25 摘要遗漏的配置条件；原始厂商说明已有完整条件。',topicIds:['inference'],assetIds:['nvda','msft'],analysis:'这是厂商自述的演示指标，不等于所有请求场景的成本改善。',provenance:'虚构原始产品说明样稿；没有访问真实公告或新闻源。'},
    {id:'atlas-fix',domain:'AI 技术',status:'更正',time:'07:40',title:'工作站更正 Atlas 吞吐摘要的批量条件',summary:'07:25 工作站摘要遗漏“批量 32”；核对 07:20 原始说明后更正。',source:'Northstar Compute 原始产品说明样稿（虚构）',sourceTime:'2026.10.12 07:20',quote:'在 128K 上下文、批量 32 的演示配置下，Atlas X2 输出吞吐提升 2.1 倍。',correction:'工作站 07:25 摘要：“输出吞吐提升 2.1 倍”，遗漏配置；07:40 更正并保留原记录。厂商原始说明从 07:20 起已有完整条件。',topicIds:['inference'],assetIds:['nvda','msft'],analysis:'低并发工作负载不能直接套用厂商演示增益。',provenance:'对照虚构 07:20 原始厂商说明与 07:25 工作站演示摘要；这是工作站更正，不是厂商新增披露。'},
    {id:'yields',domain:'宏观',status:'新增',time:'06:55',title:'短端利率预期小幅上移',summary:'本周仍有关键数据；今天的变化先放入长期研究脉络。',source:'市场日评样稿（虚构）',sourceTime:'2026.10.12 06:55',quote:'短端利率预期较上周五小幅上移，市场等待本周数据。',correction:'暂无更正。',topicIds:['rates'],assetIds:['tlt','gold'],analysis:'单日变化不足以推出趋势，也不改变已确认安排。',provenance:'虚构市场日评；无实时行情连接。'},
    {id:'consultation',domain:'地缘政策',status:'新增',time:'06:20',title:'计算设备出口审查草案进入征询',summary:'草案尚未生效；适用范围取决于最终文本。',source:'政策征询公告样稿（虚构）',sourceTime:'2026.10.12 06:20',quote:'有关计算设备的出口审查草案自发布日起进入公开意见征询期。',correction:'暂无更正。',topicIds:['policy'],assetIds:['nvda','msft','gold'],analysis:'先记录法规阶段，不能将草案视为已执行限制。',provenance:'虚构公告样稿；无真实法规判断。'}
  ];
  const projects = [
    {id:'cost-study',name:'推理成本研究笔记',area:'学习',detail:'形成可复核的成本比较表。',next:'核对演示条件与独立基准。'},
    {id:'prototype-review',name:'工作站原型评估',area:'工作',detail:'比较五个入口的阅读路径与手机端操作。',next:'记录桌面与手机端反馈。'},
    {id:'portfolio-review',name:'组合风险复核',area:'个人财务',detail:'复核久期与政策暴露，保留自己的风险判断。',next:'更新只读覆盖与待核对问题。'},
    {id:'family-week',name:'家庭周安排',area:'家庭',detail:'协调本周已确认与待讨论事项。',next:'周三前完成沟通。'}
  ];
  const actions = [
    {id:'check-benchmark',topicId:'inference',title:'核对 Atlas 独立基准与真实请求条件',suggestedProject:'cost-study',sourceDate:'2026-10-12',suggestedDate:'2026-10-14',source:'研究主题：AI 推理成本 / Atlas 新增与工作站更正'},
    {id:'check-rates',topicId:'rates',title:'复核利率数据与久期敏感度',suggestedProject:'portfolio-review',sourceDate:'2026-10-12',suggestedDate:'2026-10-16',source:'研究主题：利率与资产定价 / 利率预期事件'},
    {id:'watch-policy',topicId:'policy',title:'查收出口审查正式文本与企业说明',suggestedProject:'cost-study',sourceDate:'2026-10-12',suggestedDate:'2026-10-19',source:'研究主题：中美科技政策 / 草案征询事件'}
  ];
  const researchBriefs = {
    inference: {
      window:'2026.10.08—10.12', baseline:'2026.10.08 18:00', checked:'2026.10.12 07:43', coverage:'07:20 厂商原始说明与 07:40 工作站更正；缺少独立基准、实例报价',
      status:'适用范围收窄', statusTone:'mauve', result:'本轮核对 07:20 原始厂商说明后，发现工作站 07:25 摘要遗漏配置条件。原先较宽的成本改善设想需要收窄。',
      prior:{date:'10.08',text:'专用推理硬件可能普遍降低长上下文服务的单位成本。'},
      current:{date:'10.12',text:'目前只可说在厂商指定的 128K、批量 32 演示配置下吞吐提高；真实单位成本仍未证实。'},
      reason:'07:20 原始厂商说明已写明批量与上下文；07:40 工作站更正 07:25 过宽摘要。更正收窄我们的解释，仍没有实际价格。',
      confidence:'把握有限：依据只有厂商演示和修订说明，尚无独立复现。',
      uncertainty:'小批量场景可能没有同等收益；功耗、内存与迁移成本仍空缺。',
      changes:[
        {eventId:'atlas-fix',date:'10.12 07:40',kind:'工作站更正',fact:'核对 07:20 原始说明，确认其已有 128K 上下文、批量 32；07:25 工作站摘要遗漏了这些条件。',effect:'收窄工作站先前判断；不能把演示增益套用于低并发请求。'},
        {eventId:'atlas',date:'10.12 07:20',kind:'新增',fact:'厂商原始说明公布了带完整配置条件的 Atlas X2 吞吐演示。',effect:'提供值得验证的新候选，但尚不足以更新成本基线。'}
      ],
      verification:[
        {question:'独立基准能否复现吞吐？',status:'等待外部证据',needed:'相同上下文与批量条件下的第三方测试，含延迟和功耗。',trigger:'若结果明显低于厂商披露，撤回改善预期；若稳定复现，再进入报价比较。'},
        {question:'真实请求的单位成本是多少？',status:'待报价',needed:'云实例价格、内存配置、常见请求长度与批量分布。',trigger:'只有综合每百万 token 成本持续低于当前基线，才上调成本改善判断。'},
        {question:'迁移是否抵消硬件收益？',status:'待工程估算',needed:'软件改造、模型适配与运维工时估算。',trigger:'若迁移成本吞噬两季内节省，则保留现有方案。'}
      ],
      impacts:{
        nvda:{direction:'条件性利好 / 尚未确认',horizon:'中期，未来 2–4 季',path:'若推理需求增长且硬件收益可复现，可能支撑加速计算采购。',assumption:'独立测试复现、客户愿意部署且报价可接受。',unknown:'竞争产品、供给限制和实际毛利传导未知。'},
        msft:{direction:'方向未定',horizon:'中期，未来 2–4 季',path:'云端推理成本若下降，可能影响服务定价和利润率。',assumption:'新硬件能部署在相关云工作负载中。',unknown:'节省会留在利润端，还是让利给客户，当前无法判断。'}
      }
    },
    rates: {
      window:'2026.10.09—10.12', baseline:'2026.10.09 17:30', checked:'2026.10.12 07:41', coverage:'虚构市场日评；缺少本周数据结果与实时利率曲线',
      status:'判断维持', statusTone:'neutral', result:'单日预期上移带来一个观察点，没有改变“先拆解实际利率、再看久期资产”的判断。',
      prior:{date:'10.09',text:'TLT 与黄金需分别按久期和实际利率观察，不能从单一名义利率变化直接推导。'},
      current:{date:'10.12',text:'维持上述框架；短端预期小幅上移尚不足以改变中期资产定价判断。'},
      reason:'今天只有市场日评中的小幅变化，本周关键数据尚未出现。',
      confidence:'把握中等偏低：方向判断暂稳，但新数据可能迅速改变利率路径。',
      uncertainty:'若通胀预期而非实际利率主导变化，TLT 与黄金的传导可能不同。',
      changes:[{eventId:'yields',date:'10.12 06:55',kind:'新增',fact:'演示日评称短端利率预期较上周五小幅上移。',effect:'增加本周观察优先级；不据此改写中期判断。'}],
      verification:[
        {question:'本周数据会改变实际利率路径吗？',status:'等待公布',needed:'通胀、就业数据及对应的名义与实际利率变化。',trigger:'若实际利率持续偏离原假设，再重估久期与黄金框架。'},
        {question:'TLT 的组合久期暴露是否过高？',status:'待账户补齐',needed:'只读持仓覆盖恢复后的仓位与久期测算。',trigger:'若实际暴露超出既定风险预算，提出复核任务；此页不执行交易。'},
        {question:'黄金变化由什么驱动？',status:'继续观察',needed:'实际利率、美元与避险需求的同期走势。',trigger:'若避险需求持续主导，单一利率解释需要降权。'}
      ],
      impacts:{
        tlt:{direction:'若实际利率继续上行，偏负面',horizon:'短至中期，数周至一季',path:'长期债券价格通常对收益率变化更敏感。',assumption:'实际利率上行且期限溢价没有反向抵消。',unknown:'Schwab 读取失败，组合整体久期覆盖不完整。'},
        gold:{direction:'方向不确定',horizon:'短期数周',path:'实际利率上行可能形成压力；避险需求可能反向支持。',assumption:'需分清驱动变量，而非只看名义利率。',unknown:'美元与地缘情绪的相对贡献尚未验证。'}
      }
    },
    policy: {
      window:'2026.10.06—10.12', baseline:'2026.10.06 18:10', checked:'2026.10.12 07:41', coverage:'虚构征询公告样稿；缺少正式条款与企业回应',
      status:'跟踪判断调整', statusTone:'mauve', result:'从“可能出现政策文本”调整为“草案征询已出现”。这是证据阶段的变化，不是限制已经生效。',
      prior:{date:'10.06',text:'出口审查可能进入公开文本阶段，适用范围和时间点均未确认。'},
      current:{date:'10.12',text:'演示草案进入征询；继续跟踪正式定义与企业披露。现阶段不判断已生效影响。'},
      reason:'新增的是草案征询这一可标记阶段，不是最终规则、执法或企业财务结果。',
      confidence:'对“处于征询阶段”的演示记录把握较高；对最终影响把握很低。',
      uncertainty:'正式文本可能缩小或改变范围；企业业务暴露和应对措施未知。',
      changes:[{eventId:'consultation',date:'10.12 06:20',kind:'新增',fact:'演示公告样稿称计算设备出口审查草案进入公开征询。',effect:'提高正式文本的跟踪优先级；不把草案写成已生效限制。'}],
      verification:[
        {question:'正式条款如何定义适用设备？',status:'等待正式文本',needed:'最终规则、适用地域、豁免与生效日期。',trigger:'只有正式文本确定后，才调整供应链暴露判断。'},
        {question:'企业会如何披露和应对？',status:'等待企业回应',needed:'NVDA、MSFT 对地域收入、供给和替代方案的说明。',trigger:'若披露显示实质业务影响，再评估标的敏感度。'},
        {question:'避险资产的反应是否持续？',status:'继续观察',needed:'黄金与实际利率、美元、风险偏好的同步数据。',trigger:'若政策风险独立驱动黄金，再提高其相关性权重。'}
      ],
      impacts:{
        nvda:{direction:'若最终范围覆盖相关产品，偏负面',horizon:'中期，规则明确后 1–4 季',path:'潜在出口范围变化可能影响可服务市场与供给安排。',assumption:'最终文本包含其相关产品和市场。',unknown:'正式定义、豁免与客户替代需求都未确定。'},
        msft:{direction:'影响方向未定',horizon:'中期，规则明确后',path:'云与软件业务可能经采购、客户地域和合规成本间接受影响。',assumption:'规则实际触及其供应链或服务。',unknown:'企业未给出演示情境下的财务敏感度。'},
        gold:{direction:'仅在避险需求增强时可能受益',horizon:'短期事件窗口',path:'政策不确定性可能提高避险需求。',assumption:'风险情绪主导，且实际利率没有形成反向压力。',unknown:'实际利率和美元变化可能盖过政策因素。'}
      }
    }
  };
  function byId(list,id){return list.find(item=>item.id===id);}
  function parseRoute(hash){
    const parts=String(hash||'').replace(/^#\/?/,'').split('/').filter(Boolean);
    if(parts[0]==='today')return {view:'today'};
    if(parts[0]==='news')return {view:'news',id:byId(events,parts[1])?parts[1]:events[0].id};
    if(parts[0]==='research')return {view:'research',id:byId(topics,parts[1])?parts[1]:topics[0].id};
    if(parts[0]==='investing')return {view:'investing',id:byId(assets,parts[1])?parts[1]:assets[0].id};
    if(parts[0]==='schedule'){
      const tab=['calendar','inbox','projects'].includes(parts[1])?parts[1]:'calendar';
      return tab==='projects'?{view:'schedule',tab,id:byId(projects,parts[2])?parts[2]:projects[0].id}:{view:'schedule',tab};
    }
    return {view:'today'};
  }
  function createState(){return {inbox:[],tasks:[],planConfirmed:false,mailPermission:false};}
  function enqueueAction(state,actionId){
    const action=byId(actions,actionId);
    if(!action||state.inbox.some(item=>item.actionId===actionId)||state.tasks.some(item=>item.actionId===actionId))return state;
    const item={actionId,title:action.title,source:action.source,date:{source:{value:action.sourceDate,kind:'source'},suggestion:{value:action.suggestedDate,kind:'suggestion'},user:null},suggestedProject:action.suggestedProject};
    return {...state,inbox:[...state.inbox,item]};
  }
  function acceptAction(state,actionId,projectId,userDate){
    const item=state.inbox.find(entry=>entry.actionId===actionId);
    if(!item||!byId(projects,projectId))return state;
    const validDate=/^\d{4}-\d{2}-\d{2}$/.test(userDate||'');
    const task={...item,projectId,date:{...item.date,user:validDate?{value:userDate,kind:'user'}:null}};
    return {...state,inbox:state.inbox.filter(entry=>entry.actionId!==actionId),tasks:[...state.tasks,task]};
  }
  function confirmPlan(state){return {...state,planConfirmed:true};}
  function assetsForTopic(topicId){const topic=byId(topics,topicId);return topic?topic.assetIds.map(id=>byId(assets,id)).filter(Boolean):[];}
  function topicsForAsset(assetId){const asset=byId(assets,assetId);return asset?asset.topicIds.map(id=>byId(topics,id)).filter(Boolean):[];}
  const api={DEMO_DATE,topics,assets,events,projects,actions,researchBriefs,byId,parseRoute,createState,enqueueAction,acceptAction,confirmPlan,assetsForTopic,topicsForAsset};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.ObservatoryModel=api;
})(typeof window!=='undefined'?window:globalThis);
