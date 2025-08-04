# ItDog Monitor

使用 [itdog.cn](https://itdog.cn/http) 原理构建的简易监控系统，支持每 5 分钟检查一次，统计失败数与可用率，支持暗黑模式。

## 使用

1. 将本项目部署到 Vercel
2. 配置 KV 存储（Cloudflare KV 或兼容接口）
3. 自动每 5 分钟记录失败数
