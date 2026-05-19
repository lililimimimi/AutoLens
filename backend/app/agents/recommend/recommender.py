
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

    def as_list(value):
        """兼容 list / str / None，统一转成 list[str]"""
        if value is None:
            return []
        if isinstance(value, list):
            return [str(v).strip() for v in value if str(v).strip()]
        if isinstance(value, str):
            # 兼容 "空间,安全" / "空间、安全" / "空间 安全"
            normalized = (
                value.replace("，", ",")
                .replace("、", ",")
                .replace(" ", ",")
                .replace("/", ",")
            )
            return [v.strip() for v in normalized.split(",") if v.strip()]
        return [str(value).strip()] if str(value).strip() else []

    def text_of(*values) -> str:
        """把多个字段压成一段文本，便于关键词模糊匹配"""
        parts = []
        for value in values:
            parts.extend(as_list(value))
        return " ".join(parts)

    def has_any(text: str, keywords: list[str]) -> bool:
        return any(keyword in text for keyword in keywords)

    def to_number(value, default=0):
        try:
            if value in (None, ""):
                return default
            return float(value)
        except (TypeError, ValueError):
            return default

    budget_max = to_number(profile.get("budget_max"), 0)
    budget_min = to_number(profile.get("budget_min"), 0)
    family_size = int(to_number(profile.get("family_size"), 1) or 1)

    focus_points = as_list(profile.get("focus_points"))
    preferred_body = as_list(profile.get("preferred_body"))
    preferred_energy = as_list(profile.get("preferred_energy"))

    commute_distance = str(profile.get("commute_distance", "") or "")
    charging_available = str(profile.get("charging_available", "") or "")

    focus_text = text_of(focus_points)
    body_text = text_of(preferred_body)
    energy_text = text_of(preferred_energy)
    all_text = text_of(focus_points, preferred_body, preferred_energy, commute_distance, charging_available)

    social_keywords = ["品牌", "面子", "社交", "保值", "豪华", "高端", "商务", "行政", "接待", "形象"]
    family_keywords = ["空间", "安全", "舒适", "座椅", "儿童", "亲子", "后排", "后备箱", "老人"]
    tech_keywords = ["智驾", "自动驾驶", "科技", "智能", "OTA", "辅助驾驶", "智能驾驶", "智能座舱", "NOA"]
    budget_keywords = ["性价比", "省钱", "经济", "实惠", "便宜", "低成本", "预算"]
    long_trip_keywords = ["续航", "补能", "长途", "自驾", "高速", "里程焦虑", "快充"]
    city_keywords = ["代步", "通勤", "市区", "城市", "停车", "小车", "灵活"]

    has_social = has_any(all_text, social_keywords)
    has_family = has_any(all_text, family_keywords)
    has_tech = has_any(all_text, tech_keywords)
    has_budget = has_any(all_text, budget_keywords)
    has_long_trip = has_any(all_text, long_trip_keywords)
    has_city = has_any(all_text, city_keywords)

    is_large_family = family_size >= 4
    is_family = family_size >= 3
    wants_mpv = "MPV" in body_text or "六座" in body_text or "七座" in body_text
    wants_pure_ev = "纯电" in energy_text
    no_home_charging = charging_available == "无"
    long_commute = "100km以上" in commute_distance or "长途" in commute_distance

    # 1. 高预算家庭用户：比单纯豪华更优先
    if budget_max >= 35 and (is_large_family or wants_mpv or has_family):
        return "家庭旗舰"

    # 2. 商务/社交/品牌导向
    if budget_max >= 35 and has_social:
        return "商务豪华"

    # 3. 明确长途或补能焦虑
    if long_commute or has_long_trip:
        if is_family or has_family:
            return "家庭长途"
        return "长途补能"

    # 4. 家庭日常用车
    if is_family or wants_mpv or has_family:
        return "家庭通勤"

    # 5. 科技、智驾、纯电偏好
    if has_tech or wants_pure_ev:
        return "科技智驾"

    # 6. 低预算或强价格敏感
    if budget_max > 0 and budget_max <= 15:
        return "经济代步"

    if has_budget:
        return "经济代步"

    # 7. 无家充用户，优先推荐插混/增程类通勤方案
    if no_home_charging:
        return "无家充通勤"

    # 8. 城市短途代步
    if has_city or "50km以内" in commute_distance:
        return "城市代步"

    # 9. 中高预算但没有明确诉求
    if budget_max >= 25:
        return "品质通勤"

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
3. 生成一段AI解读总结

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
  "report_summary": "整体推荐总结（2-3句话）",
  "ai_summary": "2-3句话对比解读，说明各车型适合什么人，用口语化表达"
}
场景说明：
- 家庭旗舰：高预算大家庭，强调空间、豪华感、多座位
- 商务豪华：强调品牌、内饰质感、商务形象
- 家庭长途：家庭出行+长途，强调续航、空间、舒适
- 长途补能：强调续航里程、快充、补能网络
- 家庭通勤：强调空间、安全、性价比
- 科技智驾：强调智驾、OTA、科技配置
- 经济代步：强调价格、低成本、实用
- 无家充通勤：优先推荐插混/增程，不依赖家充
- 城市代步：紧凑灵活、停车方便
- 品质通勤：中高预算，综合体验
- 通用：无明确偏好，综合评分

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

        # 给每个 ranking 补充完整车型信息
        vehicle_map = {v["id"]: v for v in candidates}
        for r in result.get("rankings", []):
            vid = r.get("vehicle_id")
            if vid and vid in vehicle_map:
                r["vehicle"] = vehicle_map[vid]

        return result

    except Exception as e:
        print(f"[RecommenderAgent Error] {e}")
        return {"rankings": [], "report_summary": f"推荐生成失败：{str(e)}", "scene": scene}