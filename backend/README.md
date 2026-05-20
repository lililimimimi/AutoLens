# AutoLens Backend

AutoLens 后端是新能源汽车智能推荐平台的 API 服务，基于 FastAPI 构建。后端负责车型库、客户管理、数据统计、RAG 知识库检索、智能推荐、智能客服和竞品对比报告生成。

## 技术栈

- FastAPI
- SQLite
- Pydantic / pydantic-settings
- OpenAI SDK compatible client
- ChromaDB
- Sentence Transformers
- Tavily Search

## 目录结构

```text
backend/
├── app/
│   ├── agents/
│   │   ├── compare/             # 竞品对比和报告生成 Agent
│   │   ├── customer_service/    # 智能客服 Agent
│   │   ├── recommend/           # 智能推荐 Agent
│   │   └── shared/              # 共享检索和工具逻辑
│   ├── services/                # RAG / ChromaDB 服务
│   ├── config.py                # 环境变量与应用配置
│   ├── database.py              # SQLite 初始化和数据访问
│   ├── main.py                  # FastAPI 应用入口
│   └── schemas.py               # Pydantic 数据模型
├── data/
│   └── vehicles.csv             # 初始车型数据
├── scripts/
│   ├── import_customers.py      # 导入示例客户
│   ├── import_knowledge.py      # 导入知识库片段
│   └── import_vehicles.py       # 导入车型 CSV
├── autolens.db                  # SQLite 数据库
└── chroma_db/                   # ChromaDB 持久化目录
```

## 环境要求

- Python 3.10+
- 推荐使用虚拟环境

## 环境变量

后端默认读取 `backend/.env`：

```env
SILICONFLOW_API_KEY=your_siliconflow_api_key
TAVILY_API_KEY=your_tavily_api_key
SILICONFLOW_BASE_URL=https://api.siliconflow.cn/v1
LLM_MODEL=deepseek-ai/DeepSeek-V3
LLM_MODEL_LIGHT=deepseek-ai/DeepSeek-V3
```

说明：

- `SILICONFLOW_API_KEY`：必填，用于智能推荐、客服和报告生成。
- `TAVILY_API_KEY`：可选，仅启用联网搜索时需要。
- `SILICONFLOW_BASE_URL`：OpenAI 兼容接口地址。
- `LLM_MODEL`：主要大模型。
- `LLM_MODEL_LIGHT`：轻量任务模型。

更多配置见 `app/config.py`，包括：

- `DATABASE_URL`
- `CHROMA_PATH`
- `CHROMA_COLLECTION_VEHICLES`
- `CHROMA_COLLECTION_KNOWLEDGE`
- `BUDGET_TOLERANCE`
- `DEFAULT_TOP_N`
- `RAG_TOP_K`
- `MEMORY_WINDOW`

## 安装依赖

进入后端目录：

```bash
cd backend
```

创建虚拟环境：

```bash
python -m venv .venv
source .venv/bin/activate
```

安装依赖：

```bash
pip install fastapi uvicorn pydantic pydantic-settings openai tavily-python chromadb sentence-transformers
```

## 启动服务

```bash
uvicorn app.main:app --reload --port 8003
```

启动后可访问：

```text
http://localhost:8003
http://localhost:8003/docs
```

应用启动时会自动初始化 SQLite 数据表。

## 初始化数据

按需执行以下脚本：

```bash
python scripts/import_vehicles.py
python scripts/import_customers.py
python scripts/import_knowledge.py
```

脚本说明：

| 脚本 | 说明 |
| --- | --- |
| `scripts/import_vehicles.py` | 从 `data/vehicles.csv` 导入车型数据 |
| `scripts/import_customers.py` | 导入示例客户和购车画像 |
| `scripts/import_knowledge.py` | 导入新能源选购、补能、安全、智驾、销售话术和竞品对比知识 |

## 主要 API

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `GET` | `/` | 健康检查 |
| `GET` | `/api/dashboard` | 获取数据总览 |
| `GET` | `/api/vehicles` | 获取车型列表 |
| `GET` | `/api/vehicles/{vehicle_id}` | 获取单个车型 |
| `POST` | `/api/vehicles` | 新增车型 |
| `PUT` | `/api/vehicles/{vehicle_id}` | 更新车型 |
| `DELETE` | `/api/vehicles/{vehicle_id}` | 删除车型 |
| `GET` | `/api/customers` | 获取客户列表 |
| `GET` | `/api/customers/{customer_id}` | 获取单个客户 |
| `POST` | `/api/customers` | 新增客户 |
| `PUT` | `/api/customers/{customer_id}` | 更新客户 |
| `PUT` | `/api/customers/{customer_id}/notes` | 更新客户备注 |
| `POST` | `/api/recommend` | 生成智能推荐 |
| `POST` | `/api/chat` | 智能客服对话 |
| `POST` | `/api/compare` | 车型对比 |
| `POST` | `/api/compare/report` | 生成竞品对比报告 |

## 核心流程

### 智能推荐

`POST /api/recommend`

输入用户画像，包括预算、家庭人数、通勤距离、有无家充、偏好车型、偏好能源和关注点。后端会进行场景判断、候选车型筛选、多维评分、知识库检索和推荐报告生成。

### 智能客服

`POST /api/chat`

支持会话 ID、客户 ID 和联网搜索开关。流程包含记忆读取、意图理解、知识库检索、回答生成和合规表达控制。

### 竞品对比

`POST /api/compare`

输入至少 2 个车型 ID，返回车型分析和选购建议。

`POST /api/compare/report`

生成结构化竞品对比报告，前端用于展示完整报告。

## 数据说明

- SQLite 数据库默认保存在 `backend/autolens.db`。
- ChromaDB 默认保存在 `backend/chroma_db/`。
- 车型初始数据来自 `backend/data/vehicles.csv`。
- 知识库内容目前由 `scripts/import_knowledge.py` 中的知识片段导入。

## 常见问题

### 智能推荐或报告生成失败

优先检查：

- `.env` 中是否配置了 `SILICONFLOW_API_KEY`
- 模型名称是否可用
- 后端控制台是否有 API 报错

### 联网搜索没有结果

确认：

- 已配置 `TAVILY_API_KEY`
- 前端开启了联网搜索或请求中传入 `enable_deep_search` / `enable_web_search`

### 知识库检索为空

可以重新导入知识库：

```bash
python scripts/import_knowledge.py
```

首次运行 ChromaDB 或 embedding 模型时可能需要等待模型加载。
