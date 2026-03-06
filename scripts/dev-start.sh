#!/bin/bash
# 快速启动开发环境

set -e

echo "🚀 Starting Deck development environment..."

# 检查依赖
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler not found. Installing..."
    npm install -g wrangler
fi

# 安装依赖
echo "📦 Installing dependencies..."
npm install

# 初始化数据库
echo "🗄️  Setting up local database..."
cd worker
wrangler d1 migrations apply deck_db --local
cd ..

# 启动服务
echo "✅ Starting services..."
echo "Frontend: http://localhost:5173"
echo "Worker: http://localhost:8787"
echo ""

npm run dev
