#!/bin/bash
# GitHub Secrets配置脚本

set -e

REPO=${1:-"your-org/deck"}

echo "🔐 配置GitHub Secrets..."

# 提示用户输入Secrets
read -p "Cloudflare API Token: " CLOUDFLARE_API_TOKEN
read -p "Cloudflare Zone ID: " CLOUDFLARE_ZONE_ID
read -p "GitHub PAT: " GH_PAT
read -p "Snyk Token: " SNYK_TOKEN
read -p "Slack Webhook URL: " SLACK_WEBHOOK
read -p "AO Webhook URL: " AO_WEBHOOK_URL
read -p "Gemini API Key (Staging): " STAGING_GEMINI_API_KEY
read -p "Gemini API Key (Production): " PROD_GEMINI_API_KEY

# 设置Secrets
echo "设置通用Secrets..."
gh secret set CLOUDFLARE_API_TOKEN -b "$CLOUDFLARE_API_TOKEN" -R "$REPO"
gh secret set CLOUDFLARE_ZONE_ID -b "$CLOUDFLARE_ZONE_ID" -R "$REPO"
gh secret set GH_PAT -b "$GH_PAT" -R "$REPO"
gh secret set SNYK_TOKEN -b "$SNYK_TOKEN" -R "$REPO"
gh secret set SLACK_WEBHOOK -b "$SLACK_WEBHOOK" -R "$REPO"
gh secret set AO_WEBHOOK_URL -b "$AO_WEBHOOK_URL" -R "$REPO"

echo "设置Staging环境Secrets..."
gh secret set STAGING_WORKER_URL -b "https://deck-staging.workers.dev" -R "$REPO"
gh secret set STAGING_GEMINI_API_KEY -b "$STAGING_GEMINI_API_KEY" -R "$REPO"

echo "设置Production环境Secrets..."
gh secret set PROD_WORKER_URL -b "https://deck.workers.dev" -R "$REPO"
gh secret set PROD_GEMINI_API_KEY -b "$PROD_GEMINI_API_KEY" -R "$REPO"
gh secret set PROD_FRONTEND_URL -b "https://deck.app" -R "$REPO"

echo "✅ Secrets配置完成！"
