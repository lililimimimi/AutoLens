# AutoLens

AutoLens 是一个面向新能源汽车销售场景的智能推荐与客户运营平台。项目通过车型数据库、客户画像、RAG 知识库和大模型 Agent 流程，为销售顾问提供数据总览、智能推荐、智能客服、竞品对比、客户管理和车型管理能力。

## 文档导航

- 前端开发说明：[frontend/README.md](frontend/README.md)
- 后端开发说明：[backend/README.md](backend/README.md)

## 功能特性

- 数据总览：查看车型、客户阶段、销量、能源类型等业务统计。
- 智能推荐：基于预算、家庭人数、通勤距离、补能条件和关注点生成车型推荐。
- 智能客服：支持多轮咨询、客户记忆、资料提取和知识库检索。
- 竞品对比：对多个车型进行能力对比，并生成 Markdown 对比报告。
- 客户管理：维护客户基础信息、购车画像、跟进阶段和备注。
- 车型管理：管理车型参数、价格、续航、智驾、销量、安全评分等数据。
- RAG 知识库：使用 ChromaDB 和多语言向量模型检索新能源选购、技术路线、销售话术和合规表达知识。

## 技术栈

**前端**

- React 19
- TypeScript
- React Router
- Axios
- Recharts
- Lucide React
- Create React App

**后端**

- FastAPI
- SQLite
- Pydantic / pydantic-settings
- OpenAI SDK compatible client
- ChromaDB
- Sentence Transformers
- Tavily Search

## 项目结构

```text
AutoLens/
├── backend/
│   ├── app/
│   │   ├── agents/              # 推荐、客服、竞品对比 Agent 流程
│   │   ├── services/            # RAG 检索服务
│   │   ├── config.py            # 环境变量与应用配置
│   │   ├── database.py          # SQLite 建表与数据访问
│   │   ├── main.py              # FastAPI 入口
│   │   └── schemas.py           # API 数据模型
│   ├── data/                    # 初始车型 CSV
│   ├── scripts/                 # 数据导入脚本
│   ├── autolens.db              # SQLite 数据库
│   └── chroma_db/               # ChromaDB 持久化目录
└── frontend/
    ├── public/
    ├── src/
    │   ├── api/                 # API client
    │   ├── components/          # 页面组件
    │   ├── pages/               # 路由页面
    │   └── types/               # TypeScript 类型
    └── package.json
```

## 环境要求

- Node.js 18+
- npm
- Python 3.10+

## 快速启动

推荐先启动后端，再启动前端。

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install fastapi uvicorn pydantic pydantic-settings openai tavily-python chromadb sentence-transformers
uvicorn app.main:app --reload --port 8003
```

另开一个终端：

```bash
cd frontend
npm install
npm start
```

访问：

```text
http://localhost:3000
```

## 后端启动

进入后端目录：

```bash
cd backend
```

创建并激活虚拟环境：

```bash
python -m venv .venv
source .venv/bin/activate
```

安装依赖：

```bash
pip install fastapi uvicorn pydantic pydantic-settings openai tavily-python chromadb sentence-transformers
```

创建 `backend/.env`：

```env
SILICONFLOW_API_KEY=your_siliconflow_api_key
TAVILY_API_KEY=your_tavily_api_key
```

`TAVILY_API_KEY` 只在启用联网搜索时需要。后端默认读取 `backend/.env`。

启动 API 服务：

```bash
uvicorn app.main:app --reload --port 8003
```

服务启动后可访问：

- API 根路径：http://localhost:8003
- Swagger 文档：http://localhost:8003/docs

## 初始化数据

首次启动后端时会自动创建 SQLite 表。可按需导入示例数据：

```bash
cd backend
python scripts/import_vehicles.py
python scripts/import_customers.py
python scripts/import_knowledge.py
```

脚本说明：

- `import_vehicles.py`：从 `backend/data/vehicles.csv` 导入车型数据。
- `import_customers.py`：导入测试客户数据。
- `import_knowledge.py`：导入新能源选购、销售话术、竞品对比等知识库数据。

## 前端启动

进入前端目录：

```bash
cd frontend
```

安装依赖：

```bash
npm install
```

如果后端不是运行在默认地址，可创建 `frontend/.env`：

```env
REACT_APP_API_URL=http://localhost:8003
```

启动前端：

```bash
npm start
```

浏览器打开：

```text
http://localhost:3000
```

## 常用命令

后端开发服务：

```bash
cd backend
uvicorn app.main:app --reload --port 8003
```

前端开发服务：

```bash
cd frontend
npm start
```

前端生产构建：

```bash
cd frontend
npm run build
```

前端测试：

```bash
cd frontend
npm test
```

## 主要 API

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `GET` | `/api/dashboard` | 获取数据总览 |
| `GET` | `/api/vehicles` | 获取车型列表 |
| `POST` | `/api/vehicles` | 新增车型 |
| `PUT` | `/api/vehicles/{vehicle_id}` | 更新车型 |
| `DELETE` | `/api/vehicles/{vehicle_id}` | 删除车型 |
| `GET` | `/api/customers` | 获取客户列表 |
| `POST` | `/api/customers` | 新增客户 |
| `PUT` | `/api/customers/{customer_id}` | 更新客户 |
| `PUT` | `/api/customers/{customer_id}/notes` | 更新客户备注 |
| `POST` | `/api/recommend` | 生成智能推荐 |
| `POST` | `/api/chat` | 智能客服对话 |
| `POST` | `/api/compare` | 车型对比 |
| `POST` | `/api/compare/report` | 生成对比报告 |

## 配置说明

后端配置位于 `backend/app/config.py`，主要参数包括：

- `SILICONFLOW_API_KEY`：大模型服务 API Key。
- `TAVILY_API_KEY`：联网搜索 API Key。
- `SILICONFLOW_BASE_URL`：OpenAI 兼容接口地址，默认 `https://api.siliconflow.cn/v1`。
- `LLM_MODEL`：推荐、客服和报告生成使用的模型。
- `DATABASE_URL`：SQLite 数据库地址，默认 `backend/autolens.db`。
- `CHROMA_PATH`：ChromaDB 持久化目录，默认 `backend/chroma_db`。
- `RAG_TOP_K`：知识库检索返回数量。

前端 API 地址位于 `frontend/src/api/client.ts`，默认请求：

```text
http://localhost:8003
```

也可通过 `frontend/.env` 中的 `REACT_APP_API_URL` 覆盖。

## 开发提示

- 推荐先启动后端，再启动前端，避免页面请求接口失败。
- 如智能推荐、智能客服或对比报告报错，请优先检查 `SILICONFLOW_API_KEY` 是否配置正确。
- 如启用深度搜索或联网搜索，请确认 `TAVILY_API_KEY` 可用。
- ChromaDB 首次运行会下载 embedding 模型，可能需要一些时间。
- SQLite 数据库和 ChromaDB 数据默认保存在 `backend/` 目录下，便于本地开发调试。
