
import chromadb
from chromadb.utils import embedding_functions
from pathlib import Path
from app.config import settings

# ─────────────────────────────────────────
# ChromaDB 初始化
# ─────────────────────────────────────────

CHROMA_PATH = Path(settings.CHROMA_PATH)
CHROMA_PATH.mkdir(parents=True, exist_ok=True)

# 使用多语言模型，支持中文
_ef = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="paraphrase-multilingual-MiniLM-L12-v2"
)

_client = chromadb.PersistentClient(path=str(CHROMA_PATH))


def get_collection(name: str):
    """获取或创建 collection"""
    return _client.get_or_create_collection(
        name=name,
        embedding_function=_ef,
        metadata={"hnsw:space": "cosine"},
    )


# ─────────────────────────────────────────
# 知识库初始化（内置样本数据）
# ─────────────────────────────────────────

SAMPLE_KNOWLEDGE = [
    {
        "id": "k001",
        "document": "比亚迪DM-i插混系统在无家充场景下表现优异，亏电油耗约5.5L/100km，适合没有固定充电条件的用户。",
        "metadata": {"source": "车型知识库", "category": "插混技术", "brand": "比亚迪"}
    },
    {
        "id": "k002",
        "document": "增程式车型综合续航通常超过1000km，彻底解决里程焦虑，适合长途出行较多的用户。代表车型：理想L系列、问界M系列。",
        "metadata": {"source": "车型知识库", "category": "增程技术", "brand": "通用"}
    },
    {
        "id": "k003",
        "document": "纯电车型在有家充的条件下使用成本最低，每公里电费约0.08-0.12元，远低于燃油车。",
        "metadata": {"source": "车型知识库", "category": "纯电技术", "brand": "通用"}
    },
    {
        "id": "k004",
        "document": "800V高压快充技术可在30分钟内将电量从20%充至80%，代表车型包括小鹏G6、极氪001、保时捷Taycan。",
        "metadata": {"source": "车型知识库", "category": "充电技术", "brand": "通用"}
    },
    {
        "id": "k005",
        "document": "2024年新能源汽车购置税减免政策：售价30万以下免征购置税，30万以上减半征收，政策延续至2025年底。",
        "metadata": {"source": "政策法规", "category": "购车政策", "brand": "通用"}
    },
    {
        "id": "k006",
        "document": "家庭用车选购建议：4人以上家庭优先考虑7座SUV或大型SUV，后排腿部空间和后备厢容积是关键指标。",
        "metadata": {"source": "用户案例", "category": "选车建议", "brand": "通用"}
    },
    {
        "id": "k007",
        "document": "华为HUAWEI ADS 2.0智能驾驶系统支持城区无图NCA，在复杂城市道路表现优异，搭载车型包括问界M5、M7、M9。",
        "metadata": {"source": "车型知识库", "category": "智驾技术", "brand": "华为"}
    },
    {
        "id": "k008",
        "document": "理想汽车采用增程电动方案，L6/L7/L8/L9系列覆盖25-45万价格区间，以家庭舒适性和超长续航为核心卖点。",
        "metadata": {"source": "车型知识库", "category": "品牌介绍", "brand": "理想"}
    },
    {
        "id": "k009",
        "document": "无家充用户选车优先级：增程 > 插混 > 纯电。增程车型充电灵活，插混亏电可用油，纯电依赖公共充电桩。",
        "metadata": {"source": "用户案例", "category": "选车建议", "brand": "通用"}
    },
    {
        "id": "k010",
        "document": "特斯拉Supercharger超级充电网络覆盖全国主要城市和高速公路，补能便利性行业领先，Model Y保值率在新能源市场排名前列。",
        "metadata": {"source": "车型知识库", "category": "品牌介绍", "brand": "特斯拉"}
    },
]


def init_knowledge_base():
    """初始化知识库，插入样本数据"""
    collection = get_collection(settings.CHROMA_COLLECTION_KNOWLEDGE)

    # 检查是否已有数据
    existing = collection.count()
    if existing >= len(SAMPLE_KNOWLEDGE):
        print(f"✅ 知识库已有 {existing} 条数据，跳过初始化")
        return

    # 插入样本数据
    collection.upsert(
        ids=[k["id"] for k in SAMPLE_KNOWLEDGE],
        documents=[k["document"] for k in SAMPLE_KNOWLEDGE],
        metadatas=[k["metadata"] for k in SAMPLE_KNOWLEDGE],
    )
    print(f"✅ 知识库初始化完成，共 {len(SAMPLE_KNOWLEDGE)} 条数据")


# ─────────────────────────────────────────
# 检索接口
# ─────────────────────────────────────────

def search_knowledge(query: str, top_k: int = None) -> list[dict]:
    """
    在知识库中检索相关内容
    返回: [{"source": ..., "content": ..., "relevance": ...}]
    """
    if top_k is None:
        top_k = settings.RAG_TOP_K

    collection = get_collection(settings.CHROMA_COLLECTION_KNOWLEDGE)

    if collection.count() == 0:
        init_knowledge_base()

    results = collection.query(
        query_texts=[query],
        n_results=min(top_k, collection.count()),
        include=["documents", "metadatas", "distances"],
    )

    evidence = []
    for doc, meta, dist in zip(
        results["documents"][0],
        results["metadatas"][0],
        results["distances"][0],
    ):
        # cosine distance → similarity
        relevance = round(1 - dist, 3)
        if relevance < 0.3:  # 过滤低相关度
            continue
        evidence.append({
            "source": meta.get("source", "知识库"),
            "content": doc,
            "relevance": relevance,
        })

    return evidence


def add_knowledge(doc_id: str, document: str, metadata: dict):
    """向知识库添加新内容"""
    collection = get_collection(settings.CHROMA_COLLECTION_KNOWLEDGE)
    collection.upsert(
        ids=[doc_id],
        documents=[document],
        metadatas=[metadata],
    )


def search_vehicles_by_profile(
    budget_max: float,
    energy_types: list[str] = None,
    body_types: list[str] = None,
    top_k: int = 10,
) -> list[dict]:
    """
    根据用户画像从向量库检索候选车型
    这里用知识库做简化实现，实际可建独立 vehicles collection
    """
    query_parts = []
    if budget_max:
        query_parts.append(f"预算{budget_max}万以内")
    if energy_types:
        query_parts.append(f"能源类型{'或'.join(energy_types)}")
    if body_types:
        query_parts.append(f"车身类型{'或'.join(body_types)}")

    query = "，".join(query_parts) if query_parts else "新能源汽车推荐"
    return search_knowledge(query, top_k=top_k)