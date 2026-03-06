# Deck DevOps 实施指南

## 1. 环境配置

### 1.1 GitHub Secrets 配置

在GitHub仓库设置中添加以下Secrets：

**通用Secrets:**
```
CLOUDFLARE_API_TOKEN=<your_cloudflare_api_token>
CLOUDFLARE_ZONE_ID=<your_zone_id>
GH_PAT=<github_personal_access_token>
SNYK_TOKEN=<snyk_token>
SLACK_WEBHOOK=<slack_webhook_url>
AO_WEBHOOK_URL=<composio_ao_webhook>
```

**Staging环境:**
```
STAGING_WORKER_URL=https://deck-staging.workers.dev
STAGING_FRONTEND_URL=https://deck-staging.pages.dev
STAGING_GEMINI_API_KEY=<staging_gemini_key>
```

**Production环境:**
```
PROD_WORKER_URL=https://deck.workers.dev
PROD_FRONTEND_URL=https://deck.app
PROD_GEMINI_API_KEY=<prod_gemini_key>
```

### 1.2 Cloudflare 资源创建

```bash
# 创建D1数据库
wrangler d1 create deck_db

# 创建R2存储桶
wrangler r2 bucket create deck-assets

# 创建Pages项目
wrangler pages project create deck-staging
wrangler pages project create deck-production
```

### 1.3 Vibe Kanban 配置

1. 导入 `deck-backlog.md` 到Vibe Kanban
2. 设置列：Backlog → Ready → In Progress → Review → Done
3. 配置优先级标签：P0（红）、P1（橙）、P2（蓝）
4. 设置Epic分组视图

---

## 2. AO 并行开发配置

### 2.1 AO Webhook 配置

在Composio AO中配置以下触发器：

**触发器1: Issue创建自动开发**
```json
{
  "trigger": "github.issue.opened",
  "condition": "labels contains 'ready-for-dev'",
  "action": "parallel_develop",
  "agents": ["codex", "claude"],
  "strategy": "race"
}
```

**触发器2: CI失败自动修复**
```json
{
  "trigger": "github.workflow.failed",
  "condition": "workflow_name == 'CI Pipeline'",
  "action": "auto_fix_ci",
  "max_retries": 3
}
```

**触发器3: Review Comment自动处理**
```json
{
  "trigger": "github.pull_request_review_comment.created",
  "action": "handle_review_comment",
  "auto_push": true
}
```

### 2.2 AO 任务模板

创建 `.ao/templates/feature-task.yaml`:
```yaml
name: Feature Development
steps:
  - name: analyze_issue
    agent: claude
    prompt: "分析Issue需求，输出技术方案"

  - name: implement
    agent: codex
    prompt: "根据技术方案实现代码"
    parallel: true

  - name: write_tests
    agent: codex
    prompt: "编写单元测试"

  - name: create_pr
    action: github.create_pull_request
    auto_link_issue: true
```

---

## 3. 分支策略

### 3.1 分支命名规范

```
feature/DECK-123-user-auth
fix/DECK-456-login-bug
chore/DECK-789-update-deps
```

### 3.2 提交规范

```bash
# 格式
<type>(<scope>): <subject>

# 示例
feat(auth): add user registration API
fix(research): resolve streaming timeout issue
chore(deps): upgrade react to 19.0.1
```

### 3.3 分支保护规则

在GitHub设置main分支保护：
- ✅ Require pull request reviews (1人)
- ✅ Require status checks to pass
  - CI Pipeline / lint
  - CI Pipeline / test-frontend
  - CI Pipeline / test-worker
  - CI Pipeline / build-frontend
  - CI Pipeline / build-worker
- ✅ Require branches to be up to date
- ✅ Do not allow bypassing

---

## 4. 数据库迁移管理

### 4.1 迁移文件命名

```
worker/migrations/
├── 0001_initial_schema.sql
├── 0002_add_sources_table.sql
├── 0003_add_research_logs.sql
└── rollback/
    ├── 0002_rollback.sql
    └── 0003_rollback.sql
```

### 4.2 迁移模板

`0002_add_sources_table.sql`:
```sql
-- Migration: Add sources table
-- Date: 2026-03-06
-- Author: DevOps Team

CREATE TABLE IF NOT EXISTS sources (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('url', 'pdf', 'video', 'text')),
  url TEXT,
  content TEXT,
  metadata TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE INDEX idx_sources_project ON sources(project_id);
```

`rollback/0002_rollback.sql`:
```sql
-- Rollback: Remove sources table
DROP INDEX IF EXISTS idx_sources_project;
DROP TABLE IF EXISTS sources;
```

### 4.3 迁移执行流程

```bash
# 本地测试
wrangler d1 migrations apply deck_db --local

# Staging部署
wrangler d1 migrations apply deck_db --remote --env staging

# Production部署（带备份）
wrangler d1 export deck_db --remote > backup-$(date +%Y%m%d).sql
wrangler d1 migrations apply deck_db --remote --env production
```

---

## 5. 监控与告警配置

### 5.1 Cloudflare Analytics 指标

在Worker中添加自定义指标：

```typescript
// worker/src/metrics.ts
export async function trackMetric(
  env: Env,
  metric: string,
  value: number,
  tags: Record<string, string>
) {
  await env.ANALYTICS.writeDataPoint({
    blobs: [metric],
    doubles: [value],
    indexes: [tags.endpoint || '', tags.status || '']
  });
}

// 使用示例
await trackMetric(env, 'api_latency', duration, {
  endpoint: '/projects',
  status: '200'
});
```

### 5.2 Sentry 配置

`frontend/src/main.tsx`:
```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 0.1,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay()
  ]
});
```

### 5.3 告警规则配置

创建 `monitoring/alerts.yaml`:
```yaml
alerts:
  - name: high_error_rate
    condition: error_rate > 5%
    window: 5m
    severity: critical
    channels: [slack, pagerduty]

  - name: slow_response
    condition: p95_latency > 3s
    window: 10m
    severity: warning
    channels: [slack]

  - name: gemini_api_failure
    condition: gemini_error_rate > 10%
    window: 5m
    severity: critical
    channels: [slack, pagerduty]

  - name: storage_limit
    condition: r2_usage > 90%
    window: 1h
    severity: warning
    channels: [slack]
```

---

## 6. 回滚预案

### 6.1 应用回滚

```bash
# 查看历史版本
wrangler deployments list

# 回滚到指定版本
wrangler rollback <deployment-id>

# 前端回滚
wrangler pages deployment list --project-name=deck-production
wrangler pages deployment rollback <deployment-id>
```

### 6.2 数据库回滚

```bash
# 执行回滚脚本
wrangler d1 execute deck_db --remote --file=rollback/0003_rollback.sql

# 恢复备份（如需要）
wrangler d1 execute deck_db --remote --file=backup-20260306.sql
```

### 6.3 一键回滚脚本

创建 `scripts/rollback.sh`:
```bash
#!/bin/bash
set -e

VERSION=$1
if [ -z "$VERSION" ]; then
  echo "Usage: ./rollback.sh <version>"
  exit 1
fi

echo "🔄 Rolling back to version $VERSION..."

# 1. 回滚Worker
echo "Rolling back Worker..."
DEPLOYMENT_ID=$(wrangler deployments list --json | jq -r ".[] | select(.version==\"$VERSION\") | .id")
wrangler rollback $DEPLOYMENT_ID

# 2. 回滚Frontend
echo "Rolling back Frontend..."
cd frontend
PAGES_DEPLOYMENT=$(wrangler pages deployment list --project-name=deck-production --json | jq -r ".[0].id")
wrangler pages deployment rollback $PAGES_DEPLOYMENT

echo "✅ Rollback completed!"
echo "Please verify: $PROD_FRONTEND_URL"
```

---

## 7. 质量门禁配置

### 7.1 覆盖率检查脚本

创建 `scripts/check-coverage.js`:
```javascript
const fs = require('fs');
const threshold = parseInt(process.argv[2]) || 70;

const coverage = JSON.parse(fs.readFileSync('coverage/coverage-summary.json'));
const total = coverage.total;

const metrics = ['lines', 'statements', 'functions', 'branches'];
let failed = false;

metrics.forEach(metric => {
  const pct = total[metric].pct;
  console.log(`${metric}: ${pct}%`);
  if (pct < threshold) {
    console.error(`❌ ${metric} coverage ${pct}% below threshold ${threshold}%`);
    failed = true;
  }
});

if (failed) process.exit(1);
console.log('✅ Coverage check passed');
```

### 7.2 安全扫描配置

`.snyk`:
```yaml
version: v1.22.0
ignore:
  SNYK-JS-AXIOS-1234567:
    - '*':
        reason: False positive
        expires: 2026-04-01
```

---

## 8. 日常运维流程

### 8.1 每日检查清单

```
□ 查看Staging部署状态
□ 检查错误率和延迟指标
□ 审查Sentry错误报告
□ 检查D1数据库大小
□ 检查R2存储使用量
□ 审查待处理PR
```

### 8.2 每周任务

```
□ 依赖更新检查（npm outdated）
□ 安全漏洞扫描（npm audit）
□ 性能指标分析
□ 成本分析（Cloudflare账单）
□ 技术债务评估
```

### 8.3 发布检查清单

```
□ 所有CI检查通过
□ Code Review完成
□ 迁移脚本已测试
□ 回滚预案准备
□ 监控告警配置
□ 发布公告准备
□ 团队成员知晓
```

---

## 9. 故障处理流程

### 9.1 故障等级定义

**P0 - 紧急**: 服务完全不可用
**P1 - 严重**: 核心功能受影响
**P2 - 一般**: 部分功能异常
**P3 - 轻微**: 体验问题

### 9.2 故障响应流程

```
1. 发现问题（监控告警/用户反馈）
2. 确认影响范围和等级
3. 启动应急响应
   - P0/P1: 立即回滚
   - P2/P3: 评估后决定
4. 修复问题
5. 验证修复
6. 24h内复盘
7. 更新文档和测试
```

### 9.3 复盘模板

创建 `.github/ISSUE_TEMPLATE/incident-report.md`:
```markdown
## 故障复盘报告

**故障时间**: 2026-03-06 14:30 - 15:00
**故障等级**: P1
**影响范围**: 所有用户无法登录

### 时间线
- 14:30 监控告警触发
- 14:32 确认故障，启动回滚
- 14:45 回滚完成
- 15:00 服务恢复正常

### 根因分析
<!-- 详细描述问题原因 -->

### 改进措施
- [ ] 增加登录API的集成测试
- [ ] 添加登录成功率监控
- [ ] 更新部署检查清单

### 责任人
@username
```

---

## 10. 快速参考

### 常用命令

```bash
# 本地开发
npm run dev                    # 启动前端
npm run worker:dev             # 启动Worker

# 测试
npm run test                   # 运行所有测试
npm run test:coverage          # 生成覆盖率报告

# 部署
git push origin main           # 自动部署Staging
gh workflow run cd-production.yml  # 手动部署Production

# 数据库
wrangler d1 execute deck_db --local --command "SELECT * FROM users"
wrangler d1 migrations apply deck_db --remote

# 监控
wrangler tail                  # 实时日志
wrangler deployments list      # 查看部署历史
```

### 关键链接

- Vibe Kanban: [内部链接]
- Cloudflare Dashboard: https://dash.cloudflare.com
- Sentry: https://sentry.io/deck
- GitHub Actions: https://github.com/[org]/deck/actions
- Staging: https://deck-staging.pages.dev
- Production: https://deck.app
