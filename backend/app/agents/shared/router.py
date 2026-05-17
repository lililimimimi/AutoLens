
import json
from openai import OpenAI
from app.config import settings

# 硅基流动客户端
client = OpenAI(
    api_key=settings.SILICONFLOW_API_KEY,
    base_url=settings.SILICONFLOW_BASE_URL,
)

ROUTER_PROMPT = """你是一个新能源汽车销售助手的意图识别模块。

请分析用户输入，判断其意图属于以下哪一类：
- 推荐：用户想买车、选车、想知道买什么车
- 对比：用户想对比几款具体车型
- 销售：用户询问价格、优惠、购车流程、贷款、上牌
- 知识：用户询问技术原理、政策法规、使用问题、充电、续航

只返回 JSON，格式如下：
{
  "intent": "推荐|对比|销售|知识",
  "confidence": 0.95,
  "reason": "一句话说明判断理由"
}

不要返回任何其他内容。"""


async def route(user_message: str) -> dict:
    """
    识别用户意图
    返回: {"intent": "推荐|对比|销售|知识", "confidence": float, "reason": str}
    """
    try:
        response = client.chat.completions.create(
            model=settings.LLM_MODEL,
            messages=[
                {"role": "system", "content": ROUTER_PROMPT},
                {"role": "user", "content": user_message},
            ],
            max_tokens=200,
            temperature=0.1,  # 意图识别要稳定，低温度
        )

        content = response.choices[0].message.content.strip()

        # 清理可能的 markdown 代码块
        content = content.replace("```json", "").replace("```", "").strip()

        result = json.loads(content)

        # 校验字段
        if result.get("intent") not in ["推荐", "对比", "销售", "知识"]:
            result["intent"] = "知识"  # 默认fallback

        return result

    except json.JSONDecodeError:
        return {"intent": "知识", "confidence": 0.5, "reason": "解析失败，默认知识类"}
    except Exception as e:
        print(f"[RouterAgent Error] {e}")
        return {"intent": "知识", "confidence": 0.5, "reason": f"错误：{str(e)}"}


def route_sync(user_message: str) -> dict:
    """同步版本，供非async环境调用"""
    import asyncio
    return asyncio.run(route(user_message))