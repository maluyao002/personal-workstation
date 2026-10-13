# 交互原型

当前设计方向为 C v2：[打开原型](dist/observatory-v2/index.html)。A/B/C 初始方案作为设计参考保留，[方案比较](dist/index.html)。

所有账户、金额、邮件、日程、新闻和研究结论都是虚构演示，不是用户真实数据。此副本已移除个人称呼，原始截图和历史核验记录仅在不入 Git 的私人存档中保留。图片位置保留题材与尺寸说明。

在仓库根目录运行：

```sh
python3 -m http.server 8765 --bind 127.0.0.1 --directory prototypes/dist
```

访问 `http://127.0.0.1:8765/observatory-v2/index.html`。仅供本机静态预览，不是应用、认证或远程访问实现。

原型的状态测试只验证演示行为；原型不连接真实账户，不调用 AI，不执行外部操作。后续产品仍须满足 [需求](../docs/requirements.md) 的全部验收场景。
