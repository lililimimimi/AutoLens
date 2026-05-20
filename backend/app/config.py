

from pydantic_settings import BaseSettings
from pathlib import Path

# 项目根目录
BASE_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    # ── 硅基流动 API ──────────────────────────
    SILICONFLOW_API_KEY: str
    TAVILY_API_KEY: str = ""
    SILICONFLOW_BASE_URL: str = "https://api.siliconflow.cn/v1"

    # 推荐使用的模型（硅基流动上的 DeepSeek）
    LLM_MODEL: str = "deepseek-ai/DeepSeek-V3"

    # 联网搜索用轻量模型，省 token
    LLM_MODEL_LIGHT: str = "deepseek-ai/DeepSeek-V3"

    # ── 数据库 ────────────────────────────────
    DATABASE_URL: str = f"sqlite:///{BASE_DIR}/autolens.db"

    # ── ChromaDB ──────────────────────────────
    CHROMA_PATH: str = str(BASE_DIR / "chroma_db")
    CHROMA_COLLECTION_VEHICLES: str = "vehicles"
    CHROMA_COLLECTION_KNOWLEDGE: str = "knowledge"

    # ── 推荐配置 ──────────────────────────────
    # 预算超出多少比例才过滤（改进3：110%）
    BUDGET_TOLERANCE: float = 1.10
    # 默认推荐数量
    DEFAULT_TOP_N: int = 3
    # 联网搜索默认关闭
    DEEP_SEARCH_DEFAULT: bool = False

    # ── 客服配置 ──────────────────────────────
    # MemoryAgent 读取最近几条对话
    MEMORY_WINDOW: int = 8

    # ── RAG 配置 ──────────────────────────────
    # 每次检索返回最多几条证据
    RAG_TOP_K: int = 5

    # ── 应用配置 ──────────────────────────────
    APP_NAME: str = "AutoLens"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = False
    CORS_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"

    @property
    def cors_origins(self) -> list[str]:
        return [
            origin.strip()
            for origin in self.CORS_ORIGINS.split(",")
            if origin.strip()
        ]

    class Config:
        env_file = str(BASE_DIR / ".env")
        env_file_encoding = "utf-8"


# 全局单例
settings = Settings()
