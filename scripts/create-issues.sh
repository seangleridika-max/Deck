#!/bin/bash
# 创建初始Issues

set -e

REPO=${1:-"your-org/deck"}

echo "📝 创建Epic和Feature Issues..."

# Epic 1: 基础架构与认证
gh issue create -R "$REPO" \
  --title "Epic 1: 基础架构与认证" \
  --label "epic,P0" \
  --body "## Epic目标
搭建项目基础，实现用户认证

## 验收标准
- 用户可注册登录
- Token验证正常
- 项目可本地运行

## 子任务
- Feature 1.1: 项目初始化
- Feature 1.2: 数据库设计
- Feature 1.3: 用户认证API
- Feature 1.4: 前端认证流程

## 优先级
P0

## 预计完成时间
Sprint 1 (2周)"

# Feature 1.3.1: 实现用户注册API
gh issue create -R "$REPO" \
  --title "[DECK-001] 实现用户注册API" \
  --label "ready-for-dev,feature,P0" \
  --body "## 任务描述
实现用户注册API，支持邮箱密码注册

## 验收标准 (DoD)
- [x] POST /users 端点实现
- [ ] 密码加密存储
- [ ] 邮箱重复校验
- [ ] 返回userId
- [ ] 单元测试覆盖

## 技术方案
- 使用nanoid生成userId
- SHA-256加密密码
- D1数据库存储

## 相关Issue
Epic 1

## 预计工时
4小时"

# Feature 1.3.2: 实现用户登录API
gh issue create -R "$REPO" \
  --title "[DECK-002] 实现用户登录API" \
  --label "ready-for-dev,feature,P0" \
  --body "## 任务描述
实现用户登录API，返回JWT Token

## 验收标准 (DoD)
- [ ] POST /users/login 端点实现
- [ ] 密码验证
- [ ] 返回JWT Token
- [ ] Token有效期24h
- [ ] 单元测试覆盖

## 技术方案
- 验证邮箱密码
- 生成JWT Token
- 返回token和userId

## 相关Issue
Epic 1

## 预计工时
3小时"

echo "✅ Issues创建完成！"
echo "查看: gh issue list -R $REPO"
