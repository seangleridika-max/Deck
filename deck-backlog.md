# Deck 项目 Backlog

## Epic 1: 基础架构与认证 [P0]
**目标**: 搭建项目基础，实现用户认证
**验收标准**: 用户可注册登录，Token验证正常

### Feature 1.1: 项目初始化
- [ ] Task 1.1.1: 创建Monorepo结构 (2h)
  - DoD: 前端/Worker/Shared目录就绪，package.json配置完成
- [ ] Task 1.1.2: 配置TypeScript + ESLint (1h)
  - DoD: 类型检查和Lint规则通过
- [ ] Task 1.1.3: 配置Vite构建 (1h)
  - DoD: 本地dev server启动正常

### Feature 1.2: 数据库设计
- [ ] Task 1.2.1: 设计users表Schema (2h)
  - DoD: SQL迁移文件编写完成，包含索引
- [ ] Task 1.2.2: 设计projects表Schema (2h)
  - DoD: 外键关系正确，支持级联删除
- [ ] Task 1.2.3: 设计sources表Schema (2h)
  - DoD: 支持多种来源类型，JSON字段设计合理

### Feature 1.3: 用户认证API
- [ ] Task 1.3.1: 实现用户注册API (4h)
  - DoD: POST /users，密码加密，返回userId
  - 测试点: 邮箱重复校验、密码强度校验
- [ ] Task 1.3.2: 实现用户登录API (3h)
  - DoD: POST /users/login，返回JWT Token
  - 测试点: 错误密码拒绝、Token有效期24h
- [ ] Task 1.3.3: 实现Token验证中间件 (2h)
  - DoD: withAuth()守卫，无效Token返回401

### Feature 1.4: 前端认证流程
- [ ] Task 1.4.1: 登录/注册页面UI (4h)
  - DoD: 响应式设计，表单验证
- [ ] Task 1.4.2: API Service封装 (2h)
  - DoD: axios配置，自动添加Token
- [ ] Task 1.4.3: 全局状态管理 (3h)
  - DoD: Zustand store，持久化Token

---

## Epic 2: 项目与知识库管理 [P0]
**目标**: 用户可创建项目，导入资料
**验收标准**: 支持URL和PDF导入，内容提取成功

### Feature 2.1: 项目管理API
- [ ] Task 2.1.1: 创建项目API (3h)
  - DoD: POST /projects，关联userId
  - 测试点: 标题必填、默认状态active
- [ ] Task 2.1.2: 列举项目API (2h)
  - DoD: GET /projects?status=active
  - 测试点: 分页、排序、过滤
- [ ] Task 2.1.3: 项目详情API (2h)
  - DoD: GET /projects/:id，包含统计信息

### Feature 2.2: 资料导入服务
- [ ] Task 2.2.1: URL内容提取 (4h)
  - DoD: 使用Cheerio提取正文，去除广告
  - 测试点: 支持常见新闻网站、处理反爬
- [ ] Task 2.2.2: PDF文本提取 (4h)
  - DoD: 使用pdf-parse，保留表格结构
  - 测试点: 多页PDF、扫描件OCR（后期）
- [ ] Task 2.2.3: 资料来源存储API (3h)
  - DoD: POST /projects/:id/sources
  - 测试点: 文件大小限制50MB、类型校验

### Feature 2.3: 前端知识库界面
- [ ] Task 2.3.1: Dashboard页面 (5h)
  - DoD: 项目卡片网格、创建项目弹窗
- [ ] Task 2.3.2: 知识库管理组件 (6h)
  - DoD: 资料列表、添加URL/上传文件
- [ ] Task 2.3.3: 文件上传组件 (3h)
  - DoD: 拖拽上传、进度条、错误提示

---

## Epic 3: AI深度研究 [P0]
**目标**: 基于知识库进行AI对话研究
**验收标准**: 流式输出正常，引用来源准确

### Feature 3.1: Gemini集成
- [ ] Task 3.1.1: Gemini API封装 (3h)
  - DoD: 支持Pro/Flash模型切换
  - 测试点: API Key验证、错误重试
- [ ] Task 3.1.2: 流式输出实现 (4h)
  - DoD: Server-Sent Events，前端实时渲染
  - 测试点: 连接中断重连、超时处理
- [ ] Task 3.1.3: 多源内容聚合 (3h)
  - DoD: 将所有sources内容拼接为context

### Feature 3.2: 研究对话API
- [ ] Task 3.2.1: 对话API (5h)
  - DoD: POST /projects/:id/research/chat
  - 测试点: 上下文管理、Token限制
- [ ] Task 3.2.2: 来源引用标注 (4h)
  - DoD: AI回答包含[来源1]标记
  - 测试点: 引用准确性验证
- [ ] Task 3.2.3: 对话历史存储 (2h)
  - DoD: 存入logs表，支持检索

### Feature 3.3: 前端研究界面
- [ ] Task 3.3.1: 对话界面UI (6h)
  - DoD: 消息列表、输入框、流式渲染
- [ ] Task 3.3.2: 来源引用交互 (3h)
  - DoD: 点击引用跳转到来源详情
- [ ] Task 3.3.3: 对话历史管理 (2h)
  - DoD: 加载历史、清空对话

---

## Epic 4: 报告生成 [P1]
**目标**: AI生成报告，支持编辑和导出
**验收标准**: DOCX导出格式正确，编辑功能完整

### Feature 4.1: 报告生成API
- [ ] Task 4.1.1: 报告生成Prompt设计 (3h)
  - DoD: 结构化输出JSON Schema
- [ ] Task 4.1.2: 报告生成API (4h)
  - DoD: POST /projects/:id/report/generate
  - 测试点: 超时处理、内容长度限制
- [ ] Task 4.1.3: DOCX导出服务 (5h)
  - DoD: 使用docx库，保留格式
  - 测试点: 标题层级、表格、图片

### Feature 4.2: 前端报告编辑器
- [ ] Task 4.2.1: 富文本编辑器集成 (6h)
  - DoD: TipTap配置，工具栏
- [ ] Task 4.2.2: 报告模板系统 (4h)
  - DoD: 3种预设模板可选
- [ ] Task 4.2.3: 导出功能 (3h)
  - DoD: 下载DOCX/PDF按钮

---

## Epic 5: 幻灯片生成 [P1]
**目标**: 从报告生成幻灯片，支持编辑
**验收标准**: PPTX导出正常，布局可调整

### Feature 5.1: 幻灯片生成API
- [ ] Task 5.1.1: 幻灯片结构设计 (3h)
  - DoD: JSON Schema定义slide结构
- [ ] Task 5.1.2: 幻灯片生成API (4h)
  - DoD: POST /projects/:id/slides/generate
- [ ] Task 5.1.3: PPTX导出服务 (5h)
  - DoD: 使用pptxgenjs，支持模板

### Feature 5.2: 前端幻灯片编辑器
- [ ] Task 5.2.1: 幻灯片预览组件 (5h)
  - DoD: 缩略图列表、当前页预览
- [ ] Task 5.2.2: 拖拽编辑功能 (6h)
  - DoD: 元素拖拽、大小调整
- [ ] Task 5.2.3: 模板选择 (3h)
  - DoD: 5种主题模板

---

## Epic 6: 技能系统 [P1]
**目标**: 提供场景化工作流模板
**验收标准**: 财务分析技能可用

### Feature 6.1: 技能引擎
- [ ] Task 6.1.1: 技能配置Schema (2h)
  - DoD: JSON定义技能元数据
- [ ] Task 6.1.2: 技能执行引擎 (4h)
  - DoD: 按步骤引导用户
- [ ] Task 6.1.3: 财务分析技能实现 (5h)
  - DoD: 提取PE/PS/营收等指标

### Feature 6.2: 前端技能中心
- [ ] Task 6.2.1: 技能中心页面 (4h)
  - DoD: 技能卡片展示、分类筛选
- [ ] Task 6.2.2: 技能详情页 (3h)
  - DoD: 步骤说明、开始使用按钮
- [ ] Task 6.2.3: 技能工作流引导 (5h)
  - DoD: 分步骤UI、进度指示

---

## Epic 7: 用户中心与优化 [P2]
**目标**: 完善用户体验
**验收标准**: 历史记录可查询，性能优化完成

### Feature 7.1: 用户中心
- [ ] Task 7.1.1: 个人信息编辑 (3h)
- [ ] Task 7.1.2: 使用统计展示 (4h)
- [ ] Task 7.1.3: 主题设置 (2h)

### Feature 7.2: 性能优化
- [ ] Task 7.2.1: 前端Bundle优化 (3h)
- [ ] Task 7.2.2: 图片懒加载 (2h)
- [ ] Task 7.2.3: API响应缓存 (3h)
