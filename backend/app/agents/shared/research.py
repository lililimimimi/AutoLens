import json
from openai import OpenAI
from app.config import settings
from app.services.rag import search_knowledge
from tavily import TavilyClient

client = OpenAI(
    api_key=settings.SILICONFLOW_API_KEY,
    base_url=settings.SILICONFLOW_BASE_URL,
)

DEEP_SEARCH_PROMPT = """你是一个新能源汽车领域的专家。
请根据用户的问题，提供最新、准确的相关信息。
重点关注：车型参数、价格、政策、用户口碑、技术特点。

只返回 JSON，格式如下：
{
  "results": [
    {"source": "来源说明", "content": "相关内容", "relevance": 0.9},
    {"source": "来源说明", "content": "相关内容", "relevance": 0.8}
  ]
}

不要返回任何其他内容。"""


async def research(
    query: str,
    enable_deep_search: bool = False,
    top_k: int = None,
) -> list[dict]:
    print(f"  [Research] enable_deep_search={enable_deep_search}")
    """
    检索相关知识
    返回: [{"source": str, "content": str, "relevance": float}]
    """
    if top_k is None:
        top_k = settings.RAG_TOP_K

    # ── 1. 本地 RAG 检索 ──────────────────
    local_results = search_knowledge(query, top_k=top_k)

    if not enable_deep_search:
        return local_results

    # ── 2. 联网搜索补充（用 LLM 模拟）────
    deep_results = await _deep_search(query)

    # 合并去重，联网结果排后面
    all_results = local_results + deep_results

    # 按相关度排序
    all_results.sort(key=lambda x: x.get("relevance", 0), reverse=True)

    return all_results[:top_k]


async def _deep_search(query: str) -> list[dict]:
    """真实 Tavily 联网搜索"""
    try:
        print(f"  [Tavily] 开始搜索：{query}")
        tavily = TavilyClient(api_key=settings.TAVILY_API_KEY)
        
        response = tavily.search(
            query=query,
            search_depth="basic",
            max_results=5,
            include_answer=True,
        )
        
        print(f"  [Tavily] 搜索结果数：{len(response.get('results', []))}")
        for r in response.get("results", []):
            print(f"    - {r.get('title')} | {r.get('url')}")
        
        results = []
        for r in response.get("results", []):
            results.append({
                "source": f"[联网] {r.get('title', '网络搜索')}",
                "content": r.get("content", ""),
                "relevance": r.get("score", 0.7),
                "url": r.get("url", ""),
            })
        
        return results

    except Exception as e:
        print(f"[TavilySearch Error] {type(e).__name__}: {e}")
        return []


async def research_for_recommend(
    profile: dict,
    enable_deep_search: bool = False,
) -> list[dict]:
    """
    专门为推荐场景构建查询
    """
    parts = []
    if profile.get("budget_max"):
        parts.append(f"预算{profile['budget_max']}万以内")
    if profile.get("preferred_energy"):
        parts.append(f"{'或'.join(profile['preferred_energy'])}车型")
    if profile.get("focus_points"):
        parts.append(f"关注{'和'.join(profile['focus_points'])}")
    if profile.get("charging_available") == "无":
        parts.append("没有家充")
    if profile.get("commute_distance"):
        parts.append(f"通勤距离{profile['commute_distance']}")

    query = "，".join(parts) if parts else "新能源汽车推荐"
    return await research(query, enable_deep_search=enable_deep_search)