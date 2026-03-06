#!/bin/bash
# AO并行开发启动脚本

set -e

ISSUE_NUMBER=$1
AGENTS=${2:-"codex,claude"}

if [ -z "$ISSUE_NUMBER" ]; then
  echo "Usage: ./ao-parallel-dev.sh <issue_number> [agents]"
  echo "Example: ./ao-parallel-dev.sh 123 codex,claude"
  exit 1
fi

echo "🚀 Starting parallel development for Issue #$ISSUE_NUMBER"
echo "Agents: $AGENTS"

# 调用AO API启动并行开发
curl -X POST "$AO_WEBHOOK_URL/parallel-develop" \
  -H "Content-Type: application/json" \
  -d "{
    \"issue_number\": $ISSUE_NUMBER,
    \"repo\": \"$GITHUB_REPOSITORY\",
    \"agents\": \"$AGENTS\",
    \"strategy\": \"race\",
    \"auto_pr\": true,
    \"auto_link_issue\": true
  }"

echo "✅ Parallel development started"
echo "Monitor progress: https://github.com/$GITHUB_REPOSITORY/issues/$ISSUE_NUMBER"
