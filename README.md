# Personal Workstation · 个人工作站

一个以新闻、投资观察和长期研究为核心，整合个人邮件、日程、项目与待办的私人工作站。

**当前状态：** 已建立独立项目，保存需求、系统设计、工程路线图和脱敏静态原型。应用功能尚未开发，未接入真实账户或 AI。仓库当前为私有；公开身份、许可证及内容审查完成后再公开。

## 从这里开始

- [已确认需求](docs/requirements.md)：第一版完整范围和验收场景。
- [系统设计](docs/system-design.md)：身份、权限、数据、AI、连接器与运行边界。
- [工程 Roadmap](docs/superpowers/plans/2026-10-13-engineering-roadmap.md)：M0–M10 的交付物、依赖和验收标准。
- [C v2 原型](prototypes/dist/observatory-v2/index.html) 与 [设计说明](prototypes/observatory-v2-design.md)。
- [材料整理说明](docs/material-inventory.md)、[隐私与公开边界](PRIVACY.md)、[项目工作规则](AGENTS.md)。

## 原型预览

在本仓库根目录运行：

```sh
python3 -m http.server 8765 --bind 127.0.0.1 --directory prototypes/dist
```

打开 `http://127.0.0.1:8765/observatory-v2/index.html`。所有金融数据、邮件、日程和研究判断都是虚构演示；操作只影响演示状态。此服务器仅用于本机预览，不提供登录、AI、真实后台或远程访问。

现有原型行为测试（需要 Node.js）：

```sh
node --test prototypes/dist/observatory-v2/model.test.js prototypes/dist/journal/task-state.test.cjs
```

## 后续工程方向

先核验外部接入及隐私条件，建立权限、数据与调度基础，再依次交付新闻研究、只读投资、Google 个人行动、确认后操作、综合简报与恢复能力。完整顺序见 Roadmap；静态原型不代表相关能力已经实现。

第一版只供个人使用，未来预留独立家庭身份和指定共享。金融只读，外部写入须具体确认。代码公开不意味着工作站服务或私人数据公开。

## 许可证

许可证尚未选择，本仓库暂不授予开源许可。公开前须确定许可证并审查复用代码与素材的许可兼容性。
