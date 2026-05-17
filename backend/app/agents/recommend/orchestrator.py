"""
AutoLens — agents/recommend/orchestrator.py
推荐 Agent 链（优化版）：

表单入口：Research(RAG) → Recommender(评分+话术) → 保存
客服入口：直接从 run_recommend_pipeline 开始，跳过 RouterAgent

LLM 调用次数：1次（RecommenderAgent）
"""

import uuid
from datetime import datetime
from app.agents.shared.research import research_for_recommend
from app.agents.recommend.recommender import recommend
from app.database import save_recommendation


async def run_recommend_pipeline(
    profile: dict,
    top_n: int = 3,
    enable_deep_search: bool = False,
    customer_id: int = None,
) -> dict:
    """
    运行推荐 Agent 链（优化版）
    RouterAgent 已在上游处理，这里直接从 Research 开始
    """
    session_id = str(uuid.uuid4())
    print(f"\n🚀 推荐链启动 session={session_id}")

    # ── Step 1: ResearchAgent (RAG) ───────
    print("  [1/3] ResearchAgent RAG检索...")
    evidence = await research_for_recommend(
        profile=profile,
        enable_deep_search=enable_deep_search,
    )
    print(f"       检索到 {len(evidence)} 条证据")

    # ── Step 2: Recommender（1次LLM：评分+场景+话术）
    print("  [2/3] RecommenderAgent 评分排序...")
    recommend_result = await recommend(
        profile=profile,
        top_n=top_n,
        evidence=evidence,
    )
    scene = recommend_result.get("scene", "通用")
    rankings = recommend_result.get("rankings", [])
    summary = recommend_result.get("report_summary", "")
    print(f"       场景：{scene}，推荐 {len(rankings)} 辆车")

    # ── Step 3: 拼接报告（不调用 LLM）────
    print("  [3/3] 拼接推荐报告...")
    report_md = _build_report(summary, rankings)

    # ── 保存结果 ──────────────────────────
    save_recommendation({
        "session_id": session_id,
        "customer_id": customer_id,
        "profile": profile,
        "scene": scene,
        "results": rankings,
        "report_md": report_md,
    })

    print(f"✅ 推荐链完成 session={session_id}\n")

    return {
        "session_id": session_id,
        "profile": profile,
        "scene": scene,
        "results": rankings,
        "report_md": report_md,
        "evidence": evidence,
        "created_at": datetime.now().isoformat(),
    }


def _build_report(summary: str, rankings: list) -> str:
    """拼接完整推荐报告（纯字符串拼接，不调用 LLM）"""
    lines = ["# 新能源汽车推荐报告\n"]

    if summary:
        lines.append(f"## 整体推荐\n\n{summary}\n")

    for i, r in enumerate(rankings):
        rank_emoji = ["🥇", "🥈", "🥉"][i] if i < 3 else f"#{i+1}"
        vehicle_name = f"车型ID {r.get('vehicle_id', '')}"

        pitch = r.get("sales_pitch", "")
        if pitch and pitch.startswith("##"):
            first_line = pitch.split("\n")[0]
            vehicle_name = first_line.replace("##", "").strip()

        lines.append(f"---\n\n## {rank_emoji} {vehicle_name} — {r.get('total_score', 0)}分\n")

        if pitch:
            pitch_body = "\n".join(pitch.split("\n")[1:]).strip()
            if pitch_body:
                lines.append(pitch_body + "\n")

        if r.get("rank_reason"):
            lines.append(f"\n> **推荐理由：** {r['rank_reason']}\n")

    return "\n".join(lines)