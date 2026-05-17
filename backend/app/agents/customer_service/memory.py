

from app.config import settings
from app.database import get_recent_messages, create_or_get_session, append_message
from datetime import datetime


def get_history(session_id: str, n: int = None) -> list[dict]:
    """
    读取最近 N 条对话历史
    返回: [{"role": "user"|"assistant", "content": str}]
    """
    if n is None:
        n = settings.MEMORY_WINDOW

    messages = get_recent_messages(session_id, n=n)

    # 格式化为 LLM messages 格式
    return [
        {"role": msg["role"], "content": msg["content"]}
        for msg in messages
    ]


def save_message(session_id: str, role: str, content: str, customer_id: int = None):
    """保存一条消息到对话历史"""
    # 确保 session 存在
    create_or_get_session(session_id, customer_id)

    # 追加消息
    append_message(session_id, {
        "role": role,
        "content": content,
        "created_at": datetime.now().isoformat(),
    })


def format_history_for_llm(history: list[dict]) -> str:
    """
    将对话历史格式化为文本，用于 prompt 中
    """
    if not history:
        return "（无历史对话）"

    lines = []
    for msg in history:
        role = "用户" if msg["role"] == "user" else "助手"
        lines.append(f"{role}：{msg['content']}")

    return "\n".join(lines)