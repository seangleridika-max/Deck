# Deck 项目文件结构

## 已创建的DevOps配置文件

```
deck/
├── README.md                              # 项目说明文档
├── DEVOPS.md                              # 完整DevOps实施指南
├── DEVOPS-SUMMARY.md                      # DevOps快速上手总结
├── deck-backlog.md                        # Vibe Kanban任务拆解
├── .gitignore                             # Git忽略规则
├── .env.example                           # 环境变量示例
├── package.json                           # Monorepo根配置
├── .prettierrc                            # 代码格式化规则
├── .eslintrc.cjs                          # ESLint规则
│
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                         # CI流程（lint/test/build）
│   │   ├── cd-staging.yml                 # Staging自动部署
│   │   └── cd-production.yml              # Production金丝雀部署
│   └── pull_request_template.md           # PR模板
│
├── .ao/
│   └── config.yaml                        # AO自动化配置
│
├── scripts/
│   ├── ao-parallel-dev.sh                 # AO并行开发启动脚本
│   ├── monitor.sh                         # 服务监控脚本
│   └── dev-start.sh                       # 快速启动开发环境
│
├── worker/
│   ├── wrangler.toml                      # Cloudflare Worker配置
│   ├── tsconfig.json                      # TypeScript配置
│   ├── package.json                       # Worker依赖
│   ├── src/
│   │   └── index.ts                       # Worker入口（待创建）
│   └── migrations/
│       ├── 0001_initial_schema.sql        # 初始数据库Schema
│       └── rollback/
│           └── 0001_rollback.sql          # 回滚脚本
│
├── frontend/
│   ├── tsconfig.json                      # TypeScript配置
│   ├── package.json                       # 前端依赖（待创建）
│   └── src/                               # 源代码（待创建）
│
├── shared/                                # 共享类型定义（待创建）
│
└── docs/                                  # 文档目录
    ├── Deck技术架构图.html                # 技术架构可视化
    └── Deck产品设计文档.docx              # 产品需求文档
```

## 配置文件说明

### 核心配置
- **package.json**: Monorepo配置，定义工作空间和脚本
- **wrangler.toml**: Cloudflare Worker部署配置，包含D1和R2绑定
- **tsconfig.json**: TypeScript编译配置（前端和Worker各一份）

### CI/CD
- **ci.yml**: 每个PR触发，运行lint/test/build/security scan
- **cd-staging.yml**: main分支推送时自动部署到Staging
- **cd-production.yml**: 手动触发，金丝雀发布到Production

### 数据库
- **0001_initial_schema.sql**: 创建users/projects/sources/research_logs/assets表
- **0001_rollback.sql**: 回滚脚本，删除所有表

### 自动化
- **ao-parallel-dev.sh**: 调用AO API启动并行开发
- **monitor.sh**: 健康检查和性能监控
- **dev-start.sh**: 一键启动本地开发环境

### AO配置
- **config.yaml**: 定义3个触发器（issue开发/CI修复/review处理）和2个工作流模板

## 下一步需要创建的文件

### Worker后端
```
worker/src/
├── index.ts                    # Worker入口
├── routes/
│   ├── users.ts               # 用户API
│   ├── projects.ts            # 项目API
│   ├── sources.ts             # 资料来源API
│   ├── research.ts            # 研究API
│   └── assets.ts              # 资产API
├── services/
│   ├── auth.ts                # 认证服务
│   ├── gemini.ts              # Gemini集成
│   └── storage.ts             # R2存储服务
└── types.ts                   # 类型定义
```

### 前端应用
```
frontend/
├── index.html
├── vite.config.ts
├── package.json
└── src/
    ├── main.tsx               # 入口
    ├── App.tsx                # 根组件
    ├── pages/
    │   ├── LoginPage.tsx
    │   ├── DashboardPage.tsx
    │   ├── ProjectPage.tsx
    │   └── SkillsPage.tsx
    ├── components/            # 可复用组件
    ├── services/
    │   └── api.ts            # API封装
    └── types.ts              # 类型定义
```

### 共享代码
```
shared/
├── package.json
├── tsconfig.json
└── src/
    └── types.ts              # 前后端共享类型
```

## 使用指南

### 1. 初始化项目
```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑.env.local填入API密钥

# 初始化数据库
cd worker
wrangler d1 migrations apply deck_db --local
```

### 2. 启动开发
```bash
# 快速启动
./scripts/dev-start.sh

# 或手动启动
npm run dev
```

### 3. 使用AO并行开发
```bash
# 为Issue #123启动并行开发
./scripts/ao-parallel-dev.sh 123 codex,claude
```

### 4. 提交代码
```bash
# 创建feature分支
git checkout -b feature/DECK-123-user-auth

# 提交代码
git add .
git commit -m "feat(auth): add user authentication"

# 推送并创建PR
git push origin feature/DECK-123-user-auth
```

### 5. 部署
```bash
# Staging自动部署（合并到main）
git checkout main
git merge feature/DECK-123-user-auth
git push

# Production手动部署
gh workflow run cd-production.yml -f version=v2026.03.06-1
```

## 关键指标

- **配置文件数量**: 20+
- **自动化脚本**: 3个
- **CI/CD流程**: 3个
- **数据库迁移**: 1个（含回滚）
- **任务拆解**: 7个Epic，50+任务
- **预计搭建时间**: 3个工作日
