# AutoLens Agent Guide

## 项目概览

AutoLens 是一个新能源汽车销售辅助系统，采用前后端分离架构：

- `backend/`：FastAPI 后端，负责车型/客户 CRUD、智能推荐、智能客服、RAG 检索和 SQLite 持久化。
- `frontend/`：Create React App + TypeScript 前端，负责仪表盘、智能推荐、客服对话、竞品对比、客户管理和车型管理。

核心业务目标是帮助销售根据客户画像、车型库和知识库证据生成可解释的购车推荐与客服答复。

## 目录约定

- `backend/app/main.py`：FastAPI 应用入口和 HTTP API 路由。
- `backend/app/config.py`：运行配置，读取 `backend/.env`。
- `backend/app/database.py`：SQLite 表结构、CRUD 和推荐/对话记录读写。
- `backend/app/schemas.py`：Pydantic 请求/响应模型。
- `backend/app/services/rag.py`：ChromaDB 知识库初始化和检索。
- `backend/app/agents/shared/`：通用 Agent 能力，包括意图路由、检索、反思检查。
- `backend/app/agents/recommend/`：推荐链，包含规则筛选、LLM 评分排序、推荐报告拼接。
- `backend/app/agents/customer_service/`：客服链，包含会话记忆、画像抽取和问答编排。
- `backend/scripts/`：数据导入脚本，例如车型和知识库初始化。
- `frontend/src/api/client.ts`：前端 API 客户端，默认请求 `http://localhost:8003`。
- `frontend/src/types/index.ts`：前端共享 TypeScript 类型。
- `frontend/src/pages/`：页面级组件。
- `frontend/src/components/`：可复用 UI 组件。

## 本地运行

后端：

```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8003
```

前端：

```bash
cd frontend
npm start
```

前端默认运行在 `http://localhost:3000`，后端默认运行在 `http://localhost:8003`。如需修改后端地址，在前端设置 `REACT_APP_API_URL`。

## 环境变量

后端通过 `backend/.env` 读取配置，至少需要：

```env
SILICONFLOW_API_KEY=your_api_key
SILICONFLOW_BASE_URL=https://api.siliconflow.cn/v1
LLM_MODEL=deepseek-ai/DeepSeek-V3
LLM_MODEL_LIGHT=deepseek-ai/DeepSeek-V3
```

不要提交真实 API Key。涉及模型、联网搜索或 RAG 的改动，应确认降级路径不会让接口直接崩溃。

## 数据与运行产物

以下文件/目录是本地运行数据或环境产物，通常不要在功能改动中编辑或提交：

- `backend/venv/`
- `backend/autolens.db`
- `backend/chroma_db/`
- `backend/app/**/__pycache__/`

如果需要重建数据，优先使用脚本：

```bash
cd backend
source venv/bin/activate
python scripts/import_vehicles.py
python scripts/import_knowledge.py
```

## 后端开发注意事项

- API 路由集中在 `backend/app/main.py`，新增接口时同步更新 `backend/app/schemas.py` 和前端 `frontend/src/api/client.ts`、`frontend/src/types/index.ts`。
- SQLite 字段中存储 JSON 时，写入前使用 `json.dumps(..., ensure_ascii=False)`，读取后恢复为 Python 对象。
- 不要把业务逻辑直接堆进路由函数。复杂流程优先放入 `app/agents/`、`app/services/` 或 `app/database.py` 中已有职责相近的位置。
- Agent 输出给前端的结构要稳定。推荐链当前返回 `session_id`、`profile`、`scene`、`results`、`report_md`、`evidence`、`created_at`。
- LLM 返回 JSON 时要保留容错解析和异常兜底，避免坏响应导致整个接口 500。
- RAG 本地检索优先使用 `search_knowledge`，所谓 deep search 当前是 LLM 补充信息，不是真实搜索 API。

## 前端开发注意事项

- 使用 TypeScript 类型约束 API 数据，新增字段先改 `frontend/src/types/index.ts`。
- 页面放在 `frontend/src/pages/`，领域组件放在 `frontend/src/components/<domain>/`。
- API 调用统一经过 `frontend/src/api/client.ts`，不要在组件里散落 axios 配置。
- 当前 UI 使用 React、React Router、Recharts、lucide-react 和项目内 CSS。新增交互要保持后台工具风格：信息密度高、可扫描、少装饰。
- Agent 返回的 Markdown 内容应通过现有聊天/报告组件展示，不要在业务组件中手写脆弱的字符串拆分逻辑，除非已有组件模式需要。

## 验证建议

目前仓库没有完整测试套件。改动后至少执行与改动相关的轻量检查：

```bash
cd frontend
npm run build
```

后端语法检查可使用：

```bash
cd backend
source venv/bin/activate
python -m compileall app
```

涉及 Agent、RAG 或数据库的改动，建议启动后端并手动检查：

- `GET /`
- `GET /api/vehicles`
- `GET /api/customers`
- `POST /api/recommend`
- `POST /api/chat`

## 代码风格

- 保持现有中文注释和业务命名风格。
- Python 代码优先使用清晰函数和小型编排，避免过深抽象。
- TypeScript 组件保持显式类型和简单 props。
- 不要做无关格式化或大范围重排。
- 不要修改用户未要求的数据库、向量库、虚拟环境和缓存文件。

## 常见任务路径

- 新增车型字段：数据库建表/迁移逻辑、Pydantic schema、前端类型、表单、表格、API 客户端一起更新。
- 调整推荐逻辑：优先查看 `backend/app/agents/recommend/recommender.py` 的规则过滤和 LLM prompt，再检查 `orchestrator.py` 的返回结构。
- 调整客服能力：优先查看 `backend/app/agents/customer_service/orchestrator.py`，再看 shared router/research/reflection。
- 调整知识库：优先修改 `backend/app/services/rag.py` 或 `backend/scripts/import_knowledge.py`，注意 Chroma collection 与元数据字段兼容。
- 调整前端展示：先看对应 `frontend/src/pages/*.tsx`，再沿组件拆分到 `frontend/src/components/`。
