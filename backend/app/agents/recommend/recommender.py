
import json
from openai import OpenAI
from app.config import settings
from app.database import get_all_vehicles

client = OpenAI(
    api_key=settings.SILICONFLOW_API_KEY,
    base_url=settings.SILICONFLOW_BASE_URL,
)

# ─────────────────────────────────────────
# SceneAgent：规则判断场景（不调用 LLM）
# ─────────────────────────────────────────

def identify_scene_by_rule(profile: dict) -> str:
    """规则判断推荐场景，不调用 LLM"""
    budget_max = profile.get("budget_max", 0) or 0
    focus_points = profile.get("focus_points", []) or []
    family_size = profile.get("family_size", 1) or 1

    social_keywords = ["品牌", "面子", "社交", "保值"]
    family_keywords = ["空间", "安全", "续航", "性价比"]

    if budget_max >= 35 or any(w in focus_points for w in social_keywords):
        return "豪华社交"
    if family_size >= 3 or any(w in focus_points for w in family_keywords):
        return "家庭通勤"
    return "通用"


# ─────────────────────────────────────────
# 预过滤：规则筛选候选车型
# ─────────────────────────────────────────

def filter_candidates(vehicles: list, profile: dict) -> list:
    """规则预过滤，不调用 LLM"""
    budget_max = profile.get("budget_max")
    preferred_energy = profile.get("preferred_energy", []) or []
    preferred_body = profile.get("preferred_body", []) or []

    filtered = []
    for v in vehicles:
        if budget_max and v["price_min"] > budget_max * settings.BUDGET_TOLERANCE:
            continue
        if preferred_energy and "不限" not in preferred_energy:
            if v.get("energy_type") not in preferred_energy:
                continue
        if preferred_body and "不限" not in preferred_body:
            if v.get("body_type") not in preferred_body:
                continue
        filtered.append(v)

    return filtered or vehicles


# ─────────────────────────────────────────
# RecommenderAgent：1次 LLM 完成评分+话术
# ─────────────────────────────────────────

RECOMMENDER_PROMPT = """你是新能源汽车推荐专家。

根据用户画像、推荐场景和候选车型，完成：
1. 对每辆车多维度评分（0-100分）
2. 为每辆车生成销售话术（Markdown格式）

评分维度：
- 价格匹配（30分）
- 续航匹配（20分）
- 空间匹配（15分）
- 智驾匹配（15分）
- 性价比（20分）

只返回 JSON：
{
  "rankings": [
    {
      "vehicle_id": 1,
      "total_score": 92.5,
      "price_score": 28,
      "range_score": 18,
      "space_score": 14,
      "autopilot_score": 13,
      "value_score": 19,
      "within_budget": true,
      "price_gap": null,
      "sales_pitch": "## 车型名\\n\\n**直接结论：**...",
      "rank_reason": "推荐理由"
    }
  ],
  "report_summary": "整体推荐总结（2-3句话）"
}

不要返回任何其他内容。"""


async def recommend(
    profile: dict,
    top_n: int = 3,
    evidence: list = None,
) -> dict:
    """评分推荐：规则预过滤 + 1次 LLM 评分排序"""

    vehicles = get_all_vehicles()
    if not vehicles:
        return {
            "rankings": [],
            "report_summary": "车型库暂无数据，请先在车型管理页面添加车型。",
            "scene": "通用",
        }

    # 规则识别场景（不调用 LLM）
    scene = identify_scene_by_rule(profile)
    print(f"       [SceneAgent] 规则识别场景：{scene}")

    # 规则预过滤（不调用 LLM）
    candidates = filter_candidates(vehicles, profile)
    print(f"       [FilterAgent] 过滤后候选：{len(candidates)} 辆")

    # 1次 LLM：评分 + 话术
    user_content = f"""
用户画像：{json.dumps(profile, ensure_ascii=False)}
推荐场景：{scene}
候选车型（共{len(candidates)}辆）：{json.dumps(candidates[:15], ensure_ascii=False)}
参考知识：{json.dumps((evidence or [])[:3], ensure_ascii=False)}
请选出最匹配的{top_n}辆，评分排序并生成销售话术。
"""

    try:
        response = client.chat.completions.create(
            model=settings.LLM_MODEL,
            messages=[
                {"role": "system", "content": RECOMMENDER_PROMPT},
                {"role": "user", "content": user_content},
            ],
            max_tokens=3000,
            temperature=0.3,
        )
        content = response.choices[0].message.content.strip()
        content = content.replace("```json", "").replace("```", "").strip()
        result = json.loads(content)
        result["scene"] = scene
        return result

    except Exception as e:
        print(f"[RecommenderAgent Error] {e}")
        return {"rankings": [], "report_summary": f"推荐生成失败：{str(e)}", "scene": scene}