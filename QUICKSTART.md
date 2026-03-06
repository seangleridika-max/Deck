# Deck 项目快速启动指南

## 🚀 立即开始

### 前置条件检查
```bash
# 检查必需工具
node --version    # 需要 >= 18
npm --version
git --version
wrangler --version  # 如未安装: npm install -g wrangler
```

### 第一步：克隆并初始化
```bash
# 1. 进入项目目录
cd /root/project

# 2. 查看已创建的配置文件
ls -la

# 3. 查看任务拆解
cat deck-backlog.md | head -50
```

### 第二步：创建GitHub仓库
```bash
# 创建新仓库
gh repo create deck --private --description "深度研究与知识创作平台"

# 初始化Git
git init
git add .
git commit -m "chore: initial DevOps setup"
git branch -M main
git remote add origin git@github.com:[your-org]/deck.git
git push -u origin main
```

### 第三步：配置GitHub Secrets
在GitHub仓库设置中添加以下Secrets（Settings → Secrets and variables → Actions）：

**必需的11个Secrets:**
```
CLOUDFLARE_API_TOKEN=<从Cloudflare获取>
CLOUDFLARE_ZONE_ID=<从Cloudflare获取>
GH_PAT=<GitHub Personal Access Token>
SNYK_TOKEN=<从Snyk获取>
SLACK_WEBHOOK=<Slack Webhook URL>
AO_WEBHOOK_URL=<Composio AO Webhook>
STAGING_WORKER_URL=https://deck-staging.workers.dev
STAGING_GEMINI_API_KEY=<Google Gemini API Key>
PROD_WORKER_URL=https://deck.workers.dev
PROD_GEMINI_API_KEY=<Google Gemini API Key>
PROD_FRONTEND_URL=https://deck.app
```

### 第四步：创建Cloudflare资源
```bash
# 登录Cloudflare
wrangler login

# 创建D1数据库
wrangler d1 create deck_db
# 复制输出的database_id，更新到worker/wrangler.toml

# 创建R2存储桶
wrangler r2 bucket create deck-assets

# 创建Pages项目
wrangler pages project create deck-staging
wrangler pages project create deck-production
```

### 第五步：配置Vibe Kanban
1. 打开Vibe Kanban
2. 创建新项目 "Deck"
3. 导入 `deck-backlog.md` 中的任务
4. 设置列：Backlog → Ready → In Progress → Review → Done
5. 添加标签：P0（红）、P1（橙）、P2（蓝）

### 第六步：配置AO
1. 打开Composio Agent Orchestrator
2. 创建新配置文件，复制 `.ao/config.yaml` 内容
3. 配置Webhook URL
4. 测试触发器

### 第七步：验证环境
```bash
# 运行监控脚本测试
./scripts/monitor.sh https://deck-staging.workers.dev

# 检查CI配置
cat .github/workflows/ci.yml
```

---

## 📋 当前状态

### ✅ 已完成
- [x] DevOps文档（3份）
- [x] 任务拆解（7个Epic，50+任务）
- [x] CI/CD配置（3个workflow）
- [x] 数据库Schema（5张表）
- [x] 自动化脚本（3个）
- [x] 基础配置文件（10+个）

### 🔄 待完成
- [ ] GitHub仓库创建
- [ ] Secrets配置
- [ ] Cloudflare资源创建
- [ ] Vibe Kanban导入
- [ ] AO配置
- [ ] 第一个Sprint启动

---

## 🎯 第一个Sprint建议

从Epic 1开始，选择以下任务：

**Week 1: 基础架构**
1. Task 1.1.1: 创建Monorepo结构 (2h)
2. Task 1.1.2: 配置TypeScript + ESLint (1h)
3. Task 1.2.1-1.2.3: 数据库Schema设计 (6h)
4. Task 1.3.1: 实现用户注册API (4h)

**Week 2: 认证完成**
5. Task 1.3.2-1.3.3: 登录API + Token验证 (5h)
6. Task 1.4.1-1.4.3: 前端认证流程 (9h)

**验收标准:**
- 用户可以注册和登录
- Token验证正常工作
- CI/CD流程运行正常
- 至少2个PR成功合并

---

## 🔧 常用命令

```bash
# 开发
./scripts/dev-start.sh              # 启动开发环境
npm run dev                         # 前端开发
npm run worker:dev                  # Worker开发

# 测试
npm run test                        # 运行测试
npm run test:coverage               # 覆盖率报告

# 数据库
wrangler d1 migrations apply deck_db --local   # 本地迁移
wrangler d1 migrations apply deck_db --remote  # 生产迁移

# 部署
git push origin main                # 自动部署Staging
gh workflow run cd-production.yml   # 手动部署Production

# 监控
./scripts/monitor.sh                # 健康检查
wrangler tail                       # 实时日志

# AO
./scripts/ao-parallel-dev.sh 123 codex,claude  # 并行开发Issue #123
```

---

## 📚 文档索引

- **DEVOPS.md** - 完整实施手册（10章节）
- **DEVOPS-SUMMARY.md** - 快速上手总结
- **deck-backlog.md** - 任务拆解详情
- **PROJECT-STRUCTURE.md** - 文件结构说明

---

## 💡 提示

1. **先搭环境，再开发** - 确保CI/CD正常后再开始编码
2. **小步快跑** - 每个PR不超过500行
3. **利用AO** - 让AI并行处理独立任务
4. **监控优先** - 部署后立即检查监控指标
5. **文档同步** - 代码变更时更新相关文档

---

## 🆘 遇到问题？

1. 查看 **DEVOPS.md** 第9节"故障处理流程"
2. 检查GitHub Actions日志
3. 查看Cloudflare Worker日志：`wrangler tail`
4. 检查Sentry错误报告
5. 运行监控脚本：`./scripts/monitor.sh`

---

**预计完成时间**:
- 环境搭建: 1天
- 第一个Sprint: 2周
- MVP上线: 4.5个月

**开始吧！🚀**
