
import json
from openai import OpenAI
from app.config import settings
from app.database import get_all_vehicles

client = OpenAI(
    api_key=settings.SILICONFLOW_API_KEY,
    base_url=settings.SILICONFLOW_BASE_URL,
)


def as_list(value):
    """兼容 list / str / None，统一转成 list[str]"""
    if value is None:
        return []
    if isinstance(value, list):
        return [str(v).strip() for v in value if str(v).strip()]
    if isinstance(value, str):
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


# ─────────────────────────────────────────
# SceneAgent：规则判断场景（不调用 LLM）
# ─────────────────────────────────────────

def identify_scene_by_rule(profile: dict) -> str:
    """规则判断推荐场景，不调用 LLM"""

    budget_max = to_number(profile.get("budget_max"), 0)
    family_size = int(to_number(profile.get("family_size"), 1) or 1)

    focus_points = as_list(profile.get("focus_points"))
    preferred_body = as_list(profile.get("preferred_body"))
    preferred_energy = as_list(profile.get("preferred_energy"))

    commute_distance = str(profile.get("commute_distance", "") or "")
    charging_available = str(profile.get("charging_available", "") or "")

    body_text = text_of(preferred_body)
    energy_text = text_of(preferred_energy)
    all_text = text_of(focus_points, preferred_body, preferred_energy, commute_distance, charging_available)

    social_keywords = ["品牌", "面子", "社交", "豪华", "高端", "商务", "行政", "接待", "形象"]
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

    # 3. 无家充用户，优先推荐插混/增程类通勤方案
    if no_home_charging:
        return "无家充通勤"

    # 4. 明确长途或补能焦虑
    if long_commute or has_long_trip:
        if is_family or has_family:
            return "家庭长途"
        return "长途补能"

    # 5. 家庭日常用车
    if is_family or wants_mpv or has_family:
        return "家庭通勤"

    # 6. 低预算或强价格敏感
    if budget_max > 0 and budget_max <= 15:
        return "经济代步"

    if has_budget:
        return "经济代步"

    # 7. 科技、智驾、纯电偏好
    if has_tech or wants_pure_ev:
        return "科技智驾"

    # 8. 城市短途代步
    if has_city or "50km以内" in commute_distance:
        return "城市代步"

    # 9. 中高预算但没有明确诉求
    if budget_max >= 25:
        return "品质通勤"

    return "通用"


def get_scene_reason(scene: str, profile: dict) -> str:
    """解释为什么命中当前推荐场景。"""
    reasons = {
        "家庭旗舰": "用户预算较高，同时家庭人数较多或关注空间、安全、舒适，适合优先评估大空间和高配置车型。",
        "商务豪华": "用户预算较高且关注品牌、商务或形象表达，推荐时应突出品牌心智、质感和接待属性。",
        "家庭长途": "用户存在家庭出行和长途/续航需求，推荐时应同时关注空间、舒适性、续航和补能效率。",
        "长途补能": "用户通勤或出行距离较长，或明确关注续航、补能、快充，适合优先比较续航和补能便利性。",
        "家庭通勤": "用户家庭人数或关注点偏向空间、安全、舒适，适合以家庭日常用车体验作为核心判断。",
        "科技智驾": "用户关注智驾、智能座舱、科技配置或偏好纯电，适合突出辅助驾驶和智能化体验。",
        "经济代步": "用户预算较低或关注性价比、用车成本，适合优先推荐价格友好、口碑稳定的车型。",
        "无家充通勤": "用户没有家充条件，推荐时应优先考虑插混、增程或补能便利的车型，降低充电依赖。",
        "城市代步": "用户以城市短途和日常通勤为主，适合关注灵活性、成本、停车便利和基础舒适配置。",
        "品质通勤": "用户预算处于中高区间但偏好不强，适合从综合体验、配置和长期使用品质做平衡推荐。",
        "通用": "用户暂未表达强偏好，推荐时按预算、续航、空间、智能化和性价比做综合排序。",
    }
    return reasons.get(scene, reasons["通用"])


# ─────────────────────────────────────────
# 预过滤：规则筛选候选车型
# ─────────────────────────────────────────

def filter_candidates(vehicles: list, profile: dict) -> list:
    """规则预过滤 + 排序，不调用 LLM"""
    budget_max = to_number(profile.get("budget_max"), 0)
    preferred_energy = as_list(profile.get("preferred_energy"))
    preferred_body = as_list(profile.get("preferred_body"))
    charging_available = str(profile.get("charging_available", "") or "")
    no_home_charging = charging_available == "无"

    filtered = []
    for v in vehicles:
        if budget_max and v["price_min"] > budget_max * settings.BUDGET_TOLERANCE:
            continue
        if preferred_energy and "不限" not in preferred_energy and not no_home_charging:
            if v.get("energy_type") not in preferred_energy:
                continue
        if preferred_body and "不限" not in preferred_body:
            if v.get("body_type") not in preferred_body:
                continue
        filtered.append(v)

    candidates = filtered or vehicles
    scored = [(score_vehicle_by_rule(v, profile)[0], v) for v in candidates]
    scored.sort(key=lambda item: item[0], reverse=True)
    return [v for _, v in scored]


def score_vehicle_by_rule(vehicle: dict, profile: dict) -> tuple[float, dict]:
    """本地规则评分，供候选排序和 LLM 失败兜底使用。"""
    budget_max = to_number(profile.get("budget_max"), 0)
    family_size = int(to_number(profile.get("family_size"), 1) or 1)
    commute_distance = str(profile.get("commute_distance", "") or "")
    charging_available = str(profile.get("charging_available", "") or "")
    focus_text = text_of(profile.get("focus_points"))

    price_min = to_number(vehicle.get("price_min"), 0)
    range_km = to_number(vehicle.get("range_km"), 0)
    seats = int(to_number(vehicle.get("seats"), 5) or 5)
    safety_score_raw = to_number(vehicle.get("safety_score"), 0)
    fast_charge_minutes = to_number(vehicle.get("fast_charge_minutes"), 0)
    monthly_sales = to_number(vehicle.get("monthly_sales"), 0)
    wheelbase = to_number(vehicle.get("wheelbase"), 0)
    energy_type = str(vehicle.get("energy_type") or "")
    body_type = str(vehicle.get("body_type") or "")
    autopilot = str(vehicle.get("autopilot_level") or "")
    cockpit = str(vehicle.get("smart_cockpit") or "")

    if budget_max:
        if price_min <= budget_max:
            price_score = 25
        else:
            over_ratio = (price_min - budget_max) / max(budget_max, 1)
            price_score = max(0, 25 - over_ratio * 50)
    else:
        price_score = 18

    long_trip = "100km以上" in commute_distance or has_any(focus_text, ["续航", "补能", "长途", "高速", "快充"])
    range_target = 700 if long_trip else 550
    range_score = min(15, range_km / range_target * 15) if range_km else 7

    space_score = 8
    if seats >= family_size:
        space_score += 3
    if family_size >= 4 and seats >= 6:
        space_score += 2
    if body_type in ("SUV", "MPV"):
        space_score += 2
    if wheelbase >= 2900:
        space_score += 1
    space_score = min(15, space_score)

    autopilot_score = 8
    if "L2+" in autopilot or "NOA" in autopilot.upper():
        autopilot_score += 5
    elif "L2" in autopilot:
        autopilot_score += 3
    if cockpit:
        autopilot_score += 1
    if has_any(focus_text, ["智驾", "科技", "智能", "辅助驾驶"]):
        autopilot_score += 1
    autopilot_score = min(15, autopilot_score)

    safety_score = safety_score_raw / 10 if safety_score_raw else 6
    if has_any(focus_text, ["安全"]) and safety_score_raw >= 90:
        safety_score += 1
    safety_score = max(0, min(10, safety_score))

    charging_score = 5
    if energy_type in ("插混", "增程"):
        charging_score += 3
    if range_km >= 650:
        charging_score += 1
    if fast_charge_minutes and fast_charge_minutes <= 30:
        charging_score += 1
    if charging_available == "无" and energy_type == "纯电":
        charging_score -= 3
    if has_any(focus_text, ["补能", "长途", "快充"]):
        charging_score += 1
    charging_score = max(0, min(10, charging_score))

    value_score = 4
    if budget_max and price_min <= budget_max:
        value_score += 2
    if monthly_sales >= 10000:
        value_score += 2
    elif monthly_sales >= 5000:
        value_score += 1
    if has_any(focus_text, ["性价比", "省钱", "经济", "实惠"]):
        value_score += 2
    value_score = min(10, value_score)

    total_score = round(
        price_score
        + range_score
        + space_score
        + autopilot_score
        + safety_score
        + charging_score
        + value_score,
        1,
    )
    price_gap = round(price_min - budget_max, 2) if budget_max and price_min > budget_max else None

    return total_score, {
        "vehicle_id": vehicle.get("id"),
        "total_score": total_score,
        "price_score": round(price_score, 1),
        "range_score": round(range_score, 1),
        "space_score": round(space_score, 1),
        "autopilot_score": round(autopilot_score, 1),
        "safety_score": round(safety_score, 1),
        "charging_score": round(charging_score, 1),
        "value_score": round(value_score, 1),
        "within_budget": price_gap is None,
        "price_gap": price_gap,
        "rank_reason": build_rule_rank_reason(vehicle, profile),
        "sales_pitch": build_rule_sales_pitch(vehicle, profile),
    }


def build_rule_rank_reason(vehicle: dict, profile: dict) -> str:
    reasons = []
    charging_available = str(profile.get("charging_available", "") or "")
    focus_text = text_of(profile.get("focus_points"))
    budget_max = to_number(profile.get("budget_max"), 0)
    price_min = to_number(vehicle.get("price_min"), 0)

    if price_min and budget_max and price_min <= budget_max:
        reasons.append("价格在预算内")
    if charging_available == "无" and vehicle.get("energy_type") in ("插混", "增程"):
        reasons.append("不依赖家充")
    if has_any(focus_text, ["续航", "补能", "长途"]) and vehicle.get("range_km"):
        reasons.append("续航和补能适配度较高")
    if has_any(focus_text, ["空间", "安全", "舒适"]) and vehicle.get("body_type") in ("SUV", "MPV"):
        reasons.append("空间和家庭实用性较好")
    if has_any(focus_text, ["智驾", "科技", "智能"]) and vehicle.get("autopilot_level"):
        reasons.append("智能化配置匹配")
    if not reasons:
        reasons.append("综合参数与用户画像匹配度较高")
    return "；".join(reasons)


def build_rule_sales_pitch(vehicle: dict, profile: dict) -> str:
    name = f"{vehicle.get('brand', '')} {vehicle.get('model', '')}".strip() or f"车型ID {vehicle.get('id', '')}"
    reason = build_rule_rank_reason(vehicle, profile)
    return f"## {name}\n\n**直接结论：** 这款车与当前用户画像匹配度较高。\n\n**推荐理由：** {reason}。"


def build_fallback_recommendation(candidates: list, profile: dict, scene: str, top_n: int) -> dict:
    """LLM 失败时的本地规则兜底推荐。"""
    heuristic_rankings = [
        score_vehicle_by_rule(vehicle, profile)[1]
        for vehicle in candidates
    ]
    rankings = normalize_rankings(heuristic_rankings, candidates, top_n, profile)
    return {
        "rankings": rankings,
        "report_summary": "模型生成暂时不可用，已使用本地规则按预算、续航、空间、智驾、安全、补能和性价比生成兜底推荐。",
        "ai_summary": [
            f"{r['vehicle']['brand']} {r['vehicle']['model']}：{r.get('rank_reason') or '综合匹配度较高'}。"
            for r in rankings
        ],
        "scene": scene,
        "scene_reason": get_scene_reason(scene, profile),
    }


def normalize_rankings(rankings: list, candidates: list, top_n: int = 3, profile: dict = None) -> list:
    """清洗 LLM 返回的推荐结果，保证前端拿到稳定结构。"""
    vehicle_map = {int(v["id"]): v for v in candidates if v.get("id") is not None}
    normalized = []
    score_max = {
        "price_score": 25,
        "range_score": 15,
        "space_score": 15,
        "autopilot_score": 15,
        "safety_score": 10,
        "charging_score": 10,
        "value_score": 10,
    }

    def number(value, default=0):
        try:
            if value in (None, ""):
                return default
            return float(value)
        except (TypeError, ValueError):
            return default

    def nullable_number(value):
        if value in (None, ""):
            return None
        return number(value, None)

    def boolean(value, default=True):
        if isinstance(value, bool):
            return value
        if isinstance(value, str):
            return value.strip().lower() in ("true", "1", "yes", "是", "预算内")
        if value in (0, 1):
            return bool(value)
        return default

    for item in rankings or []:
        try:
            vehicle_id = int(item.get("vehicle_id"))
        except (TypeError, ValueError):
            continue

        vehicle = vehicle_map.get(vehicle_id)
        if not vehicle:
            continue
        _, rule_scores = score_vehicle_by_rule(vehicle, profile or {})

        def score_value(key):
            value = number(item.get(key), None)
            if value is None or value <= 0:
                value = rule_scores.get(key, 0)
            if key in score_max:
                value = max(0, min(score_max[key], value))
            return round(value, 1)

        score_fields = {
            "price_score": score_value("price_score"),
            "range_score": score_value("range_score"),
            "space_score": score_value("space_score"),
            "autopilot_score": score_value("autopilot_score"),
            "safety_score": score_value("safety_score"),
            "charging_score": score_value("charging_score"),
            "value_score": score_value("value_score"),
        }
        total_score = round(sum(score_fields.values()), 1)

        normalized.append({
            "vehicle_id": vehicle_id,
            "vehicle": vehicle,
            "total_score": total_score,
            **score_fields,
            "within_budget": boolean(item.get("within_budget")),
            "price_gap": nullable_number(item.get("price_gap")),
            "sales_pitch": str(item.get("sales_pitch") or ""),
            "rank_reason": str(item.get("rank_reason") or ""),
        })

    normalized.sort(key=lambda x: x["total_score"], reverse=True)
    return normalized[:top_n]


# ─────────────────────────────────────────
# RecommenderAgent：1次 LLM 完成评分+话术
# ─────────────────────────────────────────

RECOMMENDER_PROMPT = """你是新能源汽车推荐专家。

根据用户画像、推荐场景和候选车型，完成：
1. 对每辆车多维度评分（0-100分）
2. 为每辆车生成销售话术（Markdown格式）
3. 生成 AI 解读条目

评分维度：
- 价格匹配（25分）
- 续航匹配（15分）
- 空间匹配（15分）
- 智驾匹配（15分）
- 安全匹配（10分）
- 补能便利（10分）
- 性价比（10分）

只返回 JSON：
{
  "rankings": [
    {
      "vehicle_id": 1,
      "total_score": 92.5,
      "price_score": 23,
      "range_score": 14,
      "space_score": 14,
      "autopilot_score": 13,
      "safety_score": 9,
      "charging_score": 9,
      "value_score": 9,
      "within_budget": true,
      "price_gap": null,
      "sales_pitch": "## 车型名\\n\\n**直接结论：**...",
      "rank_reason": "推荐理由"
    }
  ],
  "report_summary": "整体推荐总结（2-3句话）",
  "ai_summary": [
    "车型A：适合什么人，核心理由。",
    "车型B：适合什么人，核心理由。"
  ]
}
ai_summary 必须是字符串数组，每辆推荐车型 1 条，不要用一整段逗号分隔文本。
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
            "scene_reason": get_scene_reason("通用", profile),
        }

    # 规则识别场景（不调用 LLM）
    scene = identify_scene_by_rule(profile)
    scene_reason = get_scene_reason(scene, profile)
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
        result["scene_reason"] = scene_reason
        result["rankings"] = normalize_rankings(
            result.get("rankings", []),
            candidates,
            top_n,
            profile,
        )

        if not result["rankings"]:
            return build_fallback_recommendation(candidates, profile, scene, top_n)

        return result

    except Exception as e:
        print(f"[RecommenderAgent Error] {e}")
        return build_fallback_recommendation(candidates, profile, scene, top_n)
