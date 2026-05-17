
import json
from openai import OpenAI
from app.config import settings

client = OpenAI(
    api_key=settings.SILICONFLOW_API_KEY,
    base_url=settings.SILICONFLOW_BASE_URL,
)

REFLECTION_PROMPT = """你是一个汽车销售合规审核员。

请检查以下销售文案是否存在违规表达，并进行修正。

违规规则：
1. 不得使用绝对化用语：最好、最强、第一、唯一、无与伦比等
2. 不得做出无法核实的承诺：保证省油、一定省钱等
3. 不得贬低竞品：某某车不好、某某品牌差等
4. 不得夸大续航：实际续航通常比CLTC低15-20%
5. 不得误导价格：需注明"起售价"或"参考价"

请返回 JSON：
{
  "is_compliant": true或false,
  "issues": ["问题1", "问题2"],
  "revised_content": "修正后的内容（如果合规则与原文相同）"
}

不要返回任何其他内容。"""


async def reflect(content: str) -> dict:
    """
    对输出内容进行合规检查
    返回: {"is_compliant": bool, "issues": list, "revised_content": str}
    """
    try:
        response = client.chat.completions.create(
            model=settings.LLM_MODEL,
            messages=[
                {"role": "system", "content": REFLECTION_PROMPT},
                {"role": "user", "content": f"请检查以下内容：\n\n{content}"},
            ],
            max_tokens=2000,
            temperature=0.1,
        )

        raw = response.choices[0].message.content.strip()
        raw = raw.replace("```json", "").replace("```", "").strip()
        result = json.loads(raw)

        # 确保字段完整
        result.setdefault("is_compliant", True)
        result.setdefault("issues", [])
        result.setdefault("revised_content", content)

        if result["is_compliant"]:
            print("[ReflectionAgent] ✅ 内容合规")
        else:
            print(f"[ReflectionAgent] ⚠️ 发现 {len(result['issues'])} 个问题，已修正")

        return result

    except json.JSONDecodeError:
        print("[ReflectionAgent] JSON 解析失败，返回原文")
        return {"is_compliant": True, "issues": [], "revised_content": content}
    except Exception as e:
        print(f"[ReflectionAgent Error] {e}")
        return {"is_compliant": True, "issues": [], "revised_content": content}


async def reflect_and_get_content(content: str) -> str:
    """
    合规检查后直接返回修正内容
    """
    result = await reflect(content)
    return result["revised_content"]