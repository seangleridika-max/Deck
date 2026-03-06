#!/bin/bash
# 监控脚本 - 检查关键指标

set -e

WORKER_URL=${1:-$STAGING_WORKER_URL}
THRESHOLD_ERROR_RATE=5
THRESHOLD_LATENCY=3000

echo "🔍 Monitoring Deck services..."
echo "Worker URL: $WORKER_URL"

# 1. 健康检查
echo -n "Health check... "
HEALTH=$(curl -s -o /dev/null -w "%{http_code}" "$WORKER_URL/health")
if [ "$HEALTH" = "200" ]; then
  echo "✅ OK"
else
  echo "❌ FAILED (HTTP $HEALTH)"
  exit 1
fi

# 2. 响应时间检查
echo -n "Response time check... "
START=$(date +%s%3N)
curl -s "$WORKER_URL/health" > /dev/null
END=$(date +%s%3N)
LATENCY=$((END - START))

if [ $LATENCY -lt $THRESHOLD_LATENCY ]; then
  echo "✅ ${LATENCY}ms"
else
  echo "⚠️  ${LATENCY}ms (threshold: ${THRESHOLD_LATENCY}ms)"
fi

# 3. 数据库连接检查
echo -n "Database check... "
DB_CHECK=$(curl -s "$WORKER_URL/health/db" | jq -r '.status')
if [ "$DB_CHECK" = "ok" ]; then
  echo "✅ OK"
else
  echo "❌ FAILED"
  exit 1
fi

# 4. R2存储检查
echo -n "Storage check... "
STORAGE_CHECK=$(curl -s "$WORKER_URL/health/storage" | jq -r '.status')
if [ "$STORAGE_CHECK" = "ok" ]; then
  echo "✅ OK"
else
  echo "❌ FAILED"
  exit 1
fi

echo ""
echo "✅ All checks passed"
