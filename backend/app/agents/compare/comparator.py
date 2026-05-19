
import json
from openai import OpenAI
from app.config import settings
from app.database import get_all_vehicles

client = OpenAI(
    api_key=settings.SILICONFLOW_API_KEY,
    base_url=settings.SILICONFLOW_BASE_URL,
)

COMPARE_PROMPT = """你是新能源汽车竞品分析专家。根据车型数据生成对比分析。

只返回 JSON，格式如下：
{
  "analyses": [
    {
      "vehicle_id": 1,
      "tagline": "一句话核心定位，如：综合实力均衡，家用首选",
      "description": "2-3句话描述该车型的核心优势和适用场景",
      "suitable_for": "适合人群，10字以内"
    }
  ],
  "buying_advice": [
    {
      "scenario": "场景名称，如：城市通勤首选",
      "recommendation": "推荐的品牌+车型名",
      "reason": "一句话推荐理由"
    }
  ]
}
buying_advice 必须生成4条，覆盖不同使用场景。
不要返回任何其他内容。"""

REPORT_PROMPT = """你是新能源汽车竞品分析专家。根据车型数据生成结构化对比报告。

只返回 JSON，格式如下：
{
  "params_table": [
    {
      "label": "参数名称",
      "values": ["车型1的值", "车型2的值", "车型3的值"],
      "best_index": 0
    }
  ],
  "analyses": [
    {
      "vehicle_id": 1,
      "strengths": ["优势1", "优势2", "优势3"],
      "weaknesses": ["不足1", "不足2"]
    }
  ],
  "suggestions": [
    {
      "condition": "适合人群描述，如：日常通勤、预算有限",
      "vehicle_name": "推荐车型名",
      "reason": "推荐理由"
    }
  ]
}

params_table 包含8-10个核心参数。
best_index 表示该参数哪辆车最优（0/1/2），无法比较的填 null。
不要返回任何其他内容。"""


async def compare(vehicle_ids: list) -> dict:
    all_vehicles = get_all_vehicles()
    vehicles = [v for v in all_vehicles if v["id"] in vehicle_ids]

    if not vehicles:
        return {"analyses": [], "buying_advice": []}

    facts = {
        "best_range": max((v.get("range_km") or 0) for v in vehicles),
        "best_price": min(v["price_min"] for v in vehicles),
        "best_charge": min((v.get("fast_charge_minutes") or 999) for v in vehicles),
        "best_range_vehicle": max(vehicles, key=lambda v: v.get("range_km") or 0)["brand"] + max(vehicles, key=lambda v: v.get("range_km") or 0)["model"],
        "best_price_vehicle": min(vehicles, key=lambda v: v["price_min"])["brand"] + min(vehicles, key=lambda v: v["price_min"])["model"],
        "best_charge_vehicle": min(vehicles, key=lambda v: v.get("fast_charge_minutes") or 999)["brand"] + min(vehicles, key=lambda v: v.get("fast_charge_minutes") or 999)["model"],
    }

    facts_text = f"""
客观数据事实（你的分析必须与以下事实一致，不得编造数据）：
- 续航最长：{facts['best_range']}km（{facts['best_range_vehicle']}）
- 价格最低：{facts['best_price']}万（{facts['best_price_vehicle']}）
- 快充最快：{facts['best_charge']}分钟（{facts['best_charge_vehicle']}）
"""

    user_content = f"""
{facts_text}
待对比车型（共{len(vehicles)}辆）：
{json.dumps(vehicles, ensure_ascii=False, indent=2)}
"""

    try:
        response = client.chat.completions.create(
            model=settings.LLM_MODEL,
            messages=[
                {"role": "system", "content": COMPARE_PROMPT},
                {"role": "user", "content": user_content},
            ],
            max_tokens=1500,
            temperature=0.3,
        )
        content = response.choices[0].message.content.strip()
        content = content.replace("```json", "").replace("```", "").strip()
        return json.loads(content)

    except Exception as e:
        print(f"[CompareAgent Error] {type(e).__name__}: {e}")
        return {"analyses": [], "buying_advice": []}
    


async def generate_report(vehicle_ids: list) -> dict:
    all_vehicles = get_all_vehicles()
    vehicles = [v for v in all_vehicles if v["id"] in vehicle_ids]

    if not vehicles:
        return {"params_table": [], "analyses": [], "suggestions": []}

    user_content = f"待对比车型（共{len(vehicles)}辆）：\n{json.dumps(vehicles, ensure_ascii=False, indent=2)}"

    try:
        response = client.chat.completions.create(
            model=settings.LLM_MODEL,
            messages=[
                {"role": "system", "content": REPORT_PROMPT},
                {"role": "user", "content": user_content},
            ],
            max_tokens=2000,
            temperature=0.3,
        )
        content = response.choices[0].message.content.strip()
        content = content.replace("```json", "").replace("```", "").strip()
        return json.loads(content)

    except Exception as e:
        print(f"[ReportAgent Error] {e}")
        return {"params_table": [], "analyses": [], "suggestions": []}