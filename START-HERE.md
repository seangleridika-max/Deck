# 🚀 GitHub驱动开发 - 立即开始

## 第一步：初始化GitHub仓库

```bash
# 1. 设置你的GitHub组织或用户名
export GITHUB_ORG="your-org"  # 替换为你的GitHub组织或用户名

# 2. 初始化仓库
./scripts/init-github.sh $GITHUB_ORG

# 3. 配置Secrets
./scripts/setup-secrets.sh $GITHUB_ORG/deck

# 4. 创建初始Issues
./scripts/create-issues.sh $GITHUB_ORG/deck
```

## 第二步：配置Cloudflare资源

```bash
# 1. 登录Cloudflare
wrangler login

# 2. 创建D1数据库
wrangler d1 create deck_db
# 复制输出的database_id，更新到 worker/wrangler.toml

# 3. 创建R2存储桶
wrangler r2 bucket create deck-assets

# 4. 创建Pages项目
wrangler pages project create deck-staging
wrangler pages project create deck-production
```

## 第三步：启动AO驱动开发

### 方式A: 自动触发（推荐）

1. 在GitHub上查看Issues：
```bash
gh issue list -R $GITHUB_ORG/deck
```

2. 为Issue添加`ready-for-dev`标签：
```bash
gh issue edit 1 --add-label "ready-for-dev" -R $GITHUB_ORG/deck
```

3. AO会自动检测并启动并行开发（Codex + Claude竞速）

4. 等待PR自动创建，CI自动运行

### 方式B: 手动触发

```bash
# 为Issue #1启动并行开发
./scripts/ao-parallel-dev.sh 1 codex,claude
```

## 第四步：监控进度

```bash
# 查看PR状态
gh pr list -R $GITHUB_ORG/deck

# 查看CI运行状态
gh run list -R $GITHUB_ORG/deck

# 查看实时日志
gh run watch -R $GITHUB_ORG/deck
```

## 第五步：Code Review与合并

```bash
# 查看PR详情
gh pr view 1 -R $GITHUB_ORG/deck

# 审核通过
gh pr review 1 --approve -R $GITHUB_ORG/deck

# 合并PR（自动部署到Staging）
gh pr merge 1 --squash -R $GITHUB_ORG/deck
```

## 第六步：验证部署

```bash
# 监控Staging
./scripts/monitor.sh https://deck-staging.workers.dev

# 查看部署日志
gh run list --workflow=cd-staging.yml -R $GITHUB_ORG/deck
```

---

## 🔄 完整开发循环

```
1. 创建Issue →
2. 添加ready-for-dev标签 →
3. AO自动开发 →
4. 自动创建PR →
5. CI自动检查 →
6. 失败则AO自动修复 →
7. Code Review →
8. Review comment自动处理 →
9. 合并PR →
10. 自动部署Staging →
11. 验证通过 →
12. 手动部署Production
```

---

## 📋 当前可用的Issues

运行初始化脚本后，会自动创建以下Issues：

- **Epic 1**: 基础架构与认证
- **DECK-001**: 实现用户注册API（已标记ready-for-dev）
- **DECK-002**: 实现用户登录API（已标记ready-for-dev）

---

## 🎯 立即开始

```bash
# 一键启动
export GITHUB_ORG="your-org"
./scripts/init-github.sh $GITHUB_ORG && \
./scripts/setup-secrets.sh $GITHUB_ORG/deck && \
./scripts/create-issues.sh $GITHUB_ORG/deck

# 查看第一个Issue
gh issue view 1 -R $GITHUB_ORG/deck

# 触发AO开发
gh issue edit 1 --add-label "ready-for-dev" -R $GITHUB_ORG/deck
```

开始你的GitHub驱动开发之旅！🚀
