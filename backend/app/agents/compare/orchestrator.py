
import uuid
from datetime import datetime
from app.agents.compare.comparator import compare, generate_report


async def run_compare_pipeline(vehicle_ids: list) -> dict:
    session_id = str(uuid.uuid4())
    print(f"\n🚀 对比链启动 session={session_id}")
    print(f"  [1/1] CompareAgent 分析中...")
    result = await compare(vehicle_ids)
    print(f"✅ 对比链完成 session={session_id}\n")

    return {
        "session_id": session_id,
        "vehicle_ids": vehicle_ids,
        "analyses": result.get("analyses", []),
        "buying_advice": result.get("buying_advice", []),
        "created_at": datetime.now().isoformat(),
    }


async def run_report_pipeline(vehicle_ids: list) -> dict:
    print(f"\n📝 报告生成启动")
    result = await generate_report(vehicle_ids)
    print(f"✅ 报告生成完成\n")
    return {
        "params_table": result.get("params_table", []),
        "analyses": result.get("analyses", []),
        "suggestions": result.get("suggestions", []),
    }