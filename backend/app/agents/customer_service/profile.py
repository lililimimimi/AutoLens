

import json
from openai import OpenAI
from app.config import settings

client = OpenAI(
    api_key=settings.SILICONFLOW_API_KEY,
    base_url=settings.SILICONFLOW_BASE_URL,
)

PROFILE_PROMPT = """你是新能源汽车销售助手，负责从用户的自然语言中提取购车需求。

请从用户输入中提取以下信息（没有提到的字段填 null）：

返回 JSON：
{
  "budget_min": 最低预算（万元，数字或null）,
  "budget_max": 最高预算（万元，数字或null）,
  "family_size": 家庭人数（数字或null）,
  "commute_distance": "50km以内|50-100km|100km以上|null",
  "charging_available": "有|无|不确定|null",
  "preferred_body": ["SUV","轿车","MPV","跑车"] 或 [],
  "preferred_energy": ["纯电","插混","增程"] 或 [],
  "focus_points": ["续航","空间","智驾","安全","性价比","补能"] 的子集 或 [],
  "city": "城市名或null",
  "extra_notes": "其他补充信息或null"
}

不要返回任何其他内容。"""


async def extract_profile(user_message: str, history: list[dict] = None) -> dict:
    """
    从自然语言提取用户画像
    返回: UserProfile dict
    """
    # 把历史对话也纳入提取范围
    context = ""
    if history:
        context = "\n".join([
            f"{'用户' if m['role'] == 'user' else '助手'}：{m['content']}"
            for m in history[-4:]  # 最近4条
        ])
        context = f"对话历史：\n{context}\n\n"

    try:
        response = client.chat.completions.create(
            model=settings.LLM_MODEL,
            messages=[
                {"role": "system", "content": PROFILE_PROMPT},
                {"role": "user", "content": f"{context}当前用户输入：{user_message}"},
            ],
            max_tokens=500,
            temperature=0.1,
        )

        content = response.choices[0].message.content.strip()
        content = content.replace("```json", "").replace("```", "").strip()
        profile = json.loads(content)

        # 清理 null 值
        profile = {k: v for k, v in profile.items() if v is not None and v != []}

        print(f"  [ProfileAgent] 提取画像：{profile}")
        return profile

    except Exception as e:
        print(f"  [ProfileAgent Error] {e}")
        return {}
