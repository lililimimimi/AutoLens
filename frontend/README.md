# AutoLens Frontend

AutoLens 前端是新能源汽车智能推荐平台的用户界面，基于 React 和 TypeScript 构建。前端负责数据总览、智能推荐、智能客服、竞品对比、客户管理和车型管理等页面展示，并通过 REST API 与后端服务交互。

## 技术栈

- React 19
- TypeScript
- React Router
- Axios
- Recharts
- Lucide React
- rc-slider
- Create React App

## 目录结构

```text
frontend/
├── public/                 # 静态资源和 HTML 模板
├── src/
│   ├── api/                # Axios API client
│   ├── assets/             # Logo 等前端资源
│   ├── components/         # 通用组件和业务组件
│   │   ├── chat/           # 智能客服组件
│   │   ├── compare/        # 竞品对比组件
│   │   ├── customer/       # 客户管理组件
│   │   ├── dashboard/      # 数据总览组件
│   │   ├── recommend/      # 智能推荐组件
│   │   └── vehicle/        # 车型管理组件
│   ├── pages/              # 路由页面
│   ├── types/              # TypeScript 类型定义
│   ├── App.tsx             # 应用路由和整体布局
│   └── index.css           # 全局样式和响应式布局
└── package.json
```

## 页面说明

| 页面 | 路由 | 说明 |
| --- | --- | --- |
| 数据总览 | `/` | 展示客户、车型、推荐、客服对话和图表统计 |
| 智能推荐 | `/recommend` | 根据购车画像生成车型推荐、评分雷达和推荐报告 |
| 智能客服 | `/customer-service` | 支持新能源选购咨询、知识库引用和联网搜索 |
| 竞品对比 | `/compare` | 选择 2-3 辆车型进行参数、能力和选购建议对比 |
| 客户管理 | `/customers` | 管理客户信息、阶段、画像和跟进备注 |
| 车型管理 | `/vehicles` | 管理车型库数据，支持新增、编辑和删除 |

## 环境要求

- Node.js 18+
- npm
- 后端服务运行在 `http://localhost:8003`，或通过环境变量指定其他地址

## 环境变量

如后端地址不是默认值，可在 `frontend/.env` 中配置：

```env
REACT_APP_API_URL=http://localhost:8003
```

默认 API 地址定义在 `src/api/client.ts`：

```text
http://localhost:8003
```

## 本地开发

安装依赖：

```bash
npm install
```

启动开发服务：

```bash
npm start
```

浏览器访问：

```text
http://localhost:3000
```

## 构建

```bash
npm run build
```

构建产物会输出到 `frontend/build/`。

## 测试

```bash
npm test
```

## 开发注意

- 推荐先启动后端，再启动前端，否则页面会出现接口请求失败。
- API 请求超时时间为 120 秒，智能推荐和报告生成可能需要等待。
- 移动端和窄屏布局已在全局 `index.css` 中处理，新增页面时建议复用现有响应式 class。
- 表格类页面建议放在可横向滚动容器中，避免小屏撑破页面。
