
import uuid
from datetime import datetime
from openai import OpenAI
from app.config import settings
from app.agents.shared.router import route
from app.agents.shared.research import research
from app.agents.shared.reflection import reflect_and_get_content
from app.agents.customer_service.memory import get_history, save_message
from app.agents.customer_service.profile import extract_profile

client = OpenAI(
    api_key=settings.SILICONFLOW_API_KEY,
    base_url=settings.SILICONFLOW_BASE_URL,
)

CHAT_SYSTEM_PROMPT = """你是 AutoLens 智能客服，专注于新能源汽车咨询服务。

回答要求：
1. 专业、准确、简洁
2. 使用 Markdown 格式，层次清晰
3. 引用知识库证据时注明来源
4. 不确定的内容不要编造
5. 语气亲切自然
6. 推荐车型时必须包含价格区间（万元）

历史对话：
{history}

参考知识：
{evidence}
"""


async def run_chat_pipeline(
    message: str,
    session_id: str = None,
    customer_id: int = None,
    enable_web_search: bool = True,
) -> dict:
    if not session_id:
        session_id = str(uuid.uuid4())

    print(f"\n💬 客服链启动 session={session_id}")

    # Step 1: RouterAgent
    print("  [1/4] RouterAgent 识别意图...")
    route_result = await route(message)
    intent = route_result.get("intent", "知识")
    print(f"       意图：{intent}")

    # Step 2: MemoryAgent
    print("  [2/4] MemoryAgent 读取历史...")
    history = get_history(session_id, n=settings.MEMORY_WINDOW)
    save_message(session_id, "user", message, customer_id)

    # 推荐意图 → 走推荐链
    if intent == "推荐":
        print("  [3/4] ProfileAgent 提取画像...")
        profile = await extract_profile(message, history)
        

        # 检查画像是否足够完整
        has_enough = (
    profile.get("budget_max") or
    profile.get("budget_min") or
    profile.get("family_size")
)

        if not profile or not has_enough:
            # 提取用户提到的品牌或关键词
            keywords = []
            for word in ["小米", "特斯拉", "比亚迪", "理想", "问界", "华为", "小鹏", "蔚来"]:
                if word in message:
                    keywords.append(word)
            
            brand_hint = f"您提到了{'、'.join(keywords)}，" if keywords else ""
            
            answer = f"""您好！{brand_hint}为了给您推荐最合适的车型，还需要了解：

        - 预算范围是多少万？
        - 家庭人数是几口人？
        - 通勤距离大概多远？
        - 是否有家充条件？

        也可以前往智能推荐页填写表单，推荐会更精准。"""
            answer = await reflect_and_get_content(answer)
            save_message(session_id, "assistant", answer, customer_id)
            return {
                "session_id": session_id, "intent": intent,
                "answer": answer, "evidence": [], "history": history,
                "created_at": datetime.now().isoformat(),
            }

        print("  [4/4] 启动推荐链...")
        from app.agents.recommend.orchestrator import run_recommend_pipeline
        result = await run_recommend_pipeline(
            profile=profile, top_n=3,
            enable_deep_search=enable_web_search,
            customer_id=customer_id,
        )
        answer = result.get("report_md", "推荐生成失败")
        evidence = result.get("evidence", [])
        save_message(session_id, "assistant", answer, customer_id)
        return {
            "session_id": session_id, "intent": intent,
            "answer": answer, "evidence": evidence, "history": history,
            "created_at": datetime.now().isoformat(),
        }

    # 普通问答
    print("  [3/4] ResearchAgent RAG检索...")
    evidence = await research(query=message, enable_deep_search=enable_web_search)

    history_text = "\n".join([
        f"{'用户' if m['role'] == 'user' else '助手'}：{m['content']}"
        for m in history
    ]) or "（无历史对话）"

    evidence_text = "\n".join([
        f"[{e['source']}] {e['content']}" for e in evidence
    ]) or "（无相关知识）"

    try:
        response = client.chat.completions.create(
            model=settings.LLM_MODEL,
            messages=[
                {"role": "system", "content": CHAT_SYSTEM_PROMPT.format(
                    history=history_text, evidence=evidence_text)},
                {"role": "user", "content": message},
            ],
            max_tokens=2000, temperature=0.5,
        )
        answer = response.choices[0].message.content.strip()
    except Exception as e:
        answer = "抱歉，服务暂时出现问题，请稍后重试。"

    print("  [4/4] ReflectionAgent 合规检查...")
    answer = await reflect_and_get_content(answer)
    save_message(session_id, "assistant", answer, customer_id)

    print(f"✅ 客服链完成 session={session_id}\n")
    return {
        "session_id": session_id, "intent": intent,
        "answer": answer, "evidence": evidence, "history": history,
        "created_at": datetime.now().isoformat(),
    }
