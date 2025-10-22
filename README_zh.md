# FusionRun Node.js 一键部署到 Render · V11.3_FusionRun

> 无需信用卡，免费托管 Node.js 应用，每月 750 小时免费额度。

---

## 🚀 一键部署方法

1. 注册 Render：https://render.com
2. 登录后点击下方按钮：

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

3. 在出现的页面中：
   - **Repository name** 可自定义（如 fusionrun-node）
   - **Region** 建议选择：`Singapore`
   - **Environment** 选择：`Node`
   - **Branch**：默认 main
   - **Build Command**：`npm install`
   - **Start Command**：`npm start`
   - **Plan**：选 Free（免费）
   - 点击 **Deploy Web Service**

4. 等待 1–2 分钟构建完成后，Render 会自动分配一个域名：
   `https://fusionrun-node.onrender.com`

---

## 🧩 文件结构

```
.
├─ server.js         # Express 主入口
├─ package.json
├─ render.yaml       # Render 部署配置文件
└─ README_zh.md
```

---

## 🧠 默认配置
- 监听端口：Render 自动注入 `$PORT`（模板默认 10000）
- 环境变量：`APP_NAME=FusionRun`, `APP_MODE=production`
- 健康检查：`/healthz` `/readyz`
- 测试 API：`/api/ping`

---

## 🧰 日志查看
在 Render 控制台点击你的服务 → Logs，可查看实时输出：
```
FusionRun service listening on port 10000
```

---

## 🔄 更新部署
只需推送代码到 GitHub，对应仓库有变更时 Render 自动重新构建。

---

## 💰 免费额度
- 每月 750 小时免费实例时间
- 空闲状态会自动休眠，不计入额度
- 可升级到 Starter 计划获取持续在线

---

## ✅ 完成效果
访问：https://fusionrun-node.onrender.com  
可看到返回：
```json
{"message":"Hello from FusionRun Node.js on Render!","version":"V11.3_FusionRun"}
```
