#!/bin/bash
# GitHub仓库初始化脚本

set -e

REPO_NAME="deck"
ORG_OR_USER=${1:-"your-org"}  # 第一个参数是组织或用户名

echo "🚀 初始化Deck GitHub仓库..."

# 1. 创建GitHub仓库
echo "📦 创建GitHub仓库..."
gh repo create "$ORG_OR_USER/$REPO_NAME" \
  --private \
  --description "深度研究与知识创作平台" \
  --clone=false

# 2. 初始化Git
echo "🔧 初始化Git..."
git init
git add .
git commit -m "chore: initial project setup with DevOps configuration"
git branch -M main
git remote add origin "git@github.com:$ORG_OR_USER/$REPO_NAME.git"

# 3. 推送代码
echo "⬆️  推送代码到GitHub..."
git push -u origin main

# 4. 设置分支保护规则
echo "🔒 设置分支保护规则..."
gh api repos/$ORG_OR_USER/$REPO_NAME/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["CI Pipeline / lint","CI Pipeline / test-frontend","CI Pipeline / test-worker","CI Pipeline / build-frontend","CI Pipeline / build-worker"]}' \
  --field enforce_admins=false \
  --field required_pull_request_reviews='{"required_approving_review_count":1}' \
  --field restrictions=null

echo "✅ 仓库初始化完成！"
echo ""
echo "下一步："
echo "1. 配置GitHub Secrets: ./scripts/setup-secrets.sh"
echo "2. 创建第一个Issue: gh issue create --title 'Epic 1: 基础架构' --body-file .github/ISSUE_TEMPLATE/epic-1.md"
