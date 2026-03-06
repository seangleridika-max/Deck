# GitHub驱动开发流程指南

## 🎯 工作流程

### 1. 初始化GitHub仓库
```bash
# 设置执行权限
chmod +x scripts/*.sh

# 初始化仓库（替换your-org为你的GitHub组织或用户名）
./scripts/init-github.sh your-org

# 配置Secrets
./scripts/setup-secrets.sh your-org/deck

# 创建初始Issues
./scripts/create-issues.sh your-org/deck
```

### 2. 开发流程

#### 方式A: AO自动开发（推荐）
```bash
# 1. 在GitHub上为Issue添加 'ready-for-dev' 标签
# 2. AO会自动检测并触发并行开发
# 3. Codex和Claude会竞速开发
# 4. 自动创建PR并关联Issue
# 5. CI自动运行，失败则AO自动修复
# 6. Code Review后，AO自动处理review comment
# 7. 合并后自动部署到Staging
```

#### 方式B: 手动开发
```bash
# 1. 从Issue创建分支
gh issue develop <issue-number> --checkout

# 2. 开发代码
# ... 编写代码 ...

# 3. 提交并创建PR
git add .
git commit -m "feat: implement user registration API"
git push origin feature/DECK-001-user-registration

gh pr create --title "feat: implement user registration API" \
  --body "Closes #<issue-number>"

# 4. CI自动运行
# 5. 等待Code Review
# 6. 合并后自动部署
```

### 3. Issue管理

#### 创建新Issue
```bash
# 使用模板创建
gh issue create --template feature.md

# 或直接创建
gh issue create \
  --title "[DECK-XXX] 任务标题" \
  --label "ready-for-dev,feature,P0" \
  --body "任务描述"
```

#### 查看Issues
```bash
# 查看所有Issues
gh issue list

# 查看待开发Issues
gh issue list --label "ready-for-dev"

# 查看P0 Issues
gh issue list --label "P0"
```

#### 分配Issue
```bash
# 分配给自己
gh issue develop <issue-number> --checkout

# 分配给AO（添加标签触发）
gh issue edit <issue-number> --add-label "ready-for-dev"
```

### 4. PR管理

#### 查看PR
```bash
# 查看所有PR
gh pr list

# 查看待审核PR
gh pr list --state open
```

#### 审核PR
```bash
# 查看PR详情
gh pr view <pr-number>

# 审核通过
gh pr review <pr-number> --approve

# 请求修改
gh pr review <pr-number> --request-changes --body "修改建议"

# 合并PR
gh pr merge <pr-number> --squash
```

### 5. 监控部署

#### 查看CI状态
```bash
# 查看workflow运行状态
gh run list

# 查看特定workflow
gh run view <run-id>

# 查看日志
gh run view <run-id> --log
```

#### 查看部署
```bash
# Staging自动部署（main分支）
# 查看: https://deck-staging.pages.dev

# Production手动部署
gh workflow run cd-production.yml -f version=v2026.03.06-1
```

### 6. AO触发器

#### 自动触发场景
1. **Issue开发**: 添加`ready-for-dev`标签 → AO并行开发
2. **CI失败**: CI检查失败 → AO自动修复（最多3次）
3. **Review Comment**: PR收到review comment → AO自动处理

#### 手动触发AO
```bash
# 为特定Issue启动并行开发
./scripts/ao-parallel-dev.sh <issue-number> codex,claude
```

### 7. 发布流程

#### Staging发布（自动）
```bash
# 合并PR到main即自动部署
gh pr merge <pr-number> --squash
```

#### Production发布（手动）
```bash
# 1. 确认Staging正常
./scripts/monitor.sh https://deck-staging.workers.dev

# 2. 触发Production部署
gh workflow run cd-production.yml \
  -f version=v$(date +%Y.%m.%d)-1

# 3. 监控部署
gh run watch

# 4. 验证Production
./scripts/monitor.sh https://deck.workers.dev
```

### 8. 回滚

#### 应用回滚
```bash
# 查看部署历史
wrangler deployments list

# 回滚到指定版本
wrangler rollback <deployment-id>
```

#### 数据库回滚
```bash
# 执行回滚脚本
cd worker
wrangler d1 execute deck_db --remote \
  --file=migrations/rollback/0001_rollback.sql
```

---

## 📋 开发检查清单

### 开始开发前
- [ ] Issue已创建并标记`ready-for-dev`
- [ ] 验收标准(DoD)已明确
- [ ] 技术方案已确定
- [ ] 本地环境正常运行

### 开发过程中
- [ ] 遵循代码规范（ESLint/Prettier）
- [ ] 编写单元测试
- [ ] 提交信息符合规范（feat/fix/chore）
- [ ] PR描述清晰，关联Issue

### 提交PR前
- [ ] 本地测试通过
- [ ] 代码已格式化
- [ ] 无TypeScript错误
- [ ] 覆盖率>=70%

### 合并前
- [ ] CI检查全部通过
- [ ] 至少1人审核通过
- [ ] 无未解决的review comment
- [ ] 已更新相关文档

---

## 🚨 故障处理

### CI失败
1. 查看失败日志: `gh run view <run-id> --log`
2. 如果是AO可修复的错误，等待自动修复
3. 如果需要手动修复，本地修复后重新推送

### AO未触发
1. 检查Issue是否有`ready-for-dev`标签
2. 检查AO Webhook配置
3. 手动触发: `./scripts/ao-parallel-dev.sh <issue-number>`

### 部署失败
1. 查看部署日志
2. 检查Secrets配置
3. 验证数据库迁移
4. 必要时回滚

---

## 📊 进度跟踪

### 查看Sprint进度
```bash
# 查看当前Sprint的Issues
gh issue list --label "sprint-1"

# 查看完成情况
gh issue list --state closed --label "sprint-1"
```

### 生成报告
```bash
# 查看本周合并的PR
gh pr list --state merged --search "merged:>=$(date -d '7 days ago' +%Y-%m-%d)"

# 查看代码变更统计
git log --since="1 week ago" --pretty=tformat: --numstat | \
  awk '{add+=$1; del+=$2} END {print "Added:",add,"Deleted:",del}'
```

---

## 🎯 下一步

1. 运行 `./scripts/init-github.sh your-org` 初始化仓库
2. 运行 `./scripts/setup-secrets.sh your-org/deck` 配置Secrets
3. 运行 `./scripts/create-issues.sh your-org/deck` 创建初始Issues
4. 在Vibe Kanban中导入Issues
5. 开始第一个Sprint！
