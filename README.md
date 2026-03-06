# Deck

深度研究与知识创作平台 - 基于AI的一体化研究工具

## 项目概述

Deck是一个面向专业用户的深度研究与知识创作平台，整合了资料收集、AI研究、报告生成、演示文稿制作等功能，帮助分析师、研究员、咨询顾问等专业人士高效完成从研究到输出的全流程工作。

**核心特性:**
- 📚 多源知识库：支持URL、PDF、视频等多种资料导入
- 🔬 AI深度研究：基于Gemini 2.5的多文档融合分析
- 📄 智能报告生成：结构化报告自动生成与富文本编辑
- 🎞️ 演示文稿制作：一键生成可编辑的专业幻灯片
- ⚡ 技能系统：场景化工作流模板（财务分析、行业研究等）
- 🌐 全中文界面：针对中文用户优化

## 技术架构

- **前端**: React 19 + TypeScript + Vite + Tailwind CSS
- **AI引擎**: Google Gemini 2.5 Pro/Flash
- **后端**: Cloudflare Workers (基于Fabric架构扩展)
- **数据库**: Cloudflare D1 (SQLite)
- **存储**: Cloudflare R2
- **DevOps**: GitHub Actions + Composio AO

## 快速开始

### 前置要求

- Node.js 18+
- Wrangler CLI
- Cloudflare账户
- Google Gemini API Key

### 安装

```bash
# 克隆仓库
git clone https://github.com/[org]/deck.git
cd deck

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑.env.local，填入必要的API密钥

# 初始化数据库
cd worker
wrangler d1 migrations apply deck_db --local
cd ..

# 启动开发服务器
npm run dev
```

访问 http://localhost:5173 查看前端，http://localhost:8787 访问Worker API。

## 开发流程

本项目采用完整的DevOps流程，集成了Vibe Kanban和Composio AO自动化开发。

### 标准开发流程

1. **选择任务**: 从Vibe Kanban选择Ready状态的任务
2. **创建分支**: `git checkout -b feature/DECK-123-description`
3. **开发**: 本地开发并测试
4. **提交PR**: 推送代码并创建Pull Request
5. **CI检查**: 自动运行lint、test、build
6. **Code Review**: 团队成员审核
7. **合并**: 合并到main后自动部署Staging

### AO并行开发（可选）

```bash
# 启动AO并行开发
./scripts/ao-parallel-dev.sh <issue_number>

# AO会自动：
# 1. 分析需求
# 2. 并行使用Codex和Claude开发
# 3. 创建PR并关联Issue
# 4. CI失败时自动修复
# 5. 处理Review Comment
```

## 项目结构

```
deck/
├── frontend/              # React前端应用
│   ├── src/
│   │   ├── pages/        # 页面组件
│   │   ├── components/   # 可复用组件
│   │   └── services/     # API服务
│   └── package.json
├── worker/               # Cloudflare Worker后端
│   ├── src/
│   │   ├── routes/       # API路由
│   │   └── services/     # 业务逻辑
│   ├── migrations/       # 数据库迁移
│   └── wrangler.toml
├── shared/               # 共享类型定义
├── .github/
│   └── workflows/        # CI/CD配置
├── scripts/              # 自动化脚本
└── docs/                 # 文档
```

## 文档

- [DevOps实施指南](DEVOPS.md) - 完整的DevOps流程和配置
- [任务拆解](deck-backlog.md) - Vibe Kanban任务清单
- [实施总结](DEVOPS-SUMMARY.md) - 快速上手指南
- [技术架构图](Deck技术架构图.html) - 可视化架构
- [产品设计文档](Deck产品设计文档.docx) - 详细需求

## 部署

### Staging环境

合并到main分支后自动部署：
- Worker: https://deck-staging.workers.dev
- Frontend: https://deck-staging.pages.dev

### Production环境

手动触发部署：
```bash
gh workflow run cd-production.yml -f version=v2026.03.06-1
```

## 监控

```bash
# 健康检查
./scripts/monitor.sh https://deck-staging.workers.dev

# 查看实时日志
wrangler tail

# 查看部署历史
wrangler deployments list
```

## 贡献指南

1. Fork本仓库
2. 创建feature分支
3. 提交变更
4. 推送到分支
5. 创建Pull Request

请确保：
- 遵循代码规范（ESLint + Prettier）
- 添加必要的测试（覆盖率>=70%）
- 更新相关文档
- PR描述清晰

## 许可证

[待定]

## 联系方式

- Issue: https://github.com/[org]/deck/issues
- 文档: https://deck-docs.pages.dev
