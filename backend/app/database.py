
import sqlite3
import json
from datetime import datetime
from pathlib import Path
from typing import Optional
from app.config import settings

# 数据库文件路径
DB_PATH = Path(settings.DATABASE_URL.replace("sqlite:///", ""))


def get_connection() -> sqlite3.Connection:
    """获取数据库连接，返回 dict-like Row"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")  
    return conn


# ─────────────────────────────────────────
# 初始化建表
# ─────────────────────────────────────────

def init_db():
    """首次启动时建表"""
    conn = get_connection()
    cursor = conn.cursor()

    # 车型表
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS vehicles (
        id              INTEGER PRIMARY KEY AUTOINCREMENT,
        brand           TEXT NOT NULL,
        model           TEXT NOT NULL,
        vehicle_type    TEXT,
        energy_type     TEXT NOT NULL,
        body_type       TEXT,
        price_min       REAL NOT NULL,
        price_max       REAL NOT NULL,
        range_km        INTEGER,
        battery_kwh     REAL,
        fast_charge_minutes INTEGER,
        seats           INTEGER DEFAULT 5,
        drive_type      TEXT,
        autopilot_level TEXT,
        smart_cockpit   TEXT,
        wheelbase       INTEGER,
        cargo_liters    INTEGER,
        safety_score    REAL,
        monthly_sales   INTEGER,
        suitable_scenarios TEXT DEFAULT '[]',
        highlights      TEXT DEFAULT '[]',
        weaknesses      TEXT DEFAULT '[]',
        image_url       TEXT,
        created_at      TEXT NOT NULL,
        updated_at      TEXT NOT NULL
    )
""")

    # 客户表
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS customers (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            name       TEXT NOT NULL,
            phone      TEXT,
            city       TEXT,
            stage      TEXT DEFAULT '新线索',
            profile    TEXT DEFAULT '{}',   -- JSON UserProfile
            notes      TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
    """)

    # 推荐记录表
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS recommendations (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id  TEXT NOT NULL UNIQUE,
            customer_id INTEGER,
            profile     TEXT NOT NULL,   -- JSON UserProfile
            scene       TEXT NOT NULL,
            results     TEXT NOT NULL,   -- JSON List[RecommendResult]
            report_md   TEXT NOT NULL,
            created_at  TEXT NOT NULL,
            FOREIGN KEY (customer_id) REFERENCES customers(id)
        )
    """)

    # 对话表
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS chat_sessions (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id  TEXT NOT NULL UNIQUE,
            customer_id INTEGER,
            messages    TEXT DEFAULT '[]',  -- JSON List[ChatMessage]
            created_at  TEXT NOT NULL,
            updated_at  TEXT NOT NULL,
            FOREIGN KEY (customer_id) REFERENCES customers(id)
        )
    """)

    conn.commit()
    conn.close()
    print(f"✅ 数据库初始化完成：{DB_PATH}")


# ─────────────────────────────────────────
# 工具函数
# ─────────────────────────────────────────

def now_str() -> str:
    return datetime.now().isoformat()


def row_to_dict(row: sqlite3.Row) -> dict:
    return dict(row)


# ─────────────────────────────────────────
# 车型 CRUD
# ─────────────────────────────────────────

def create_vehicle(data: dict) -> dict:
    conn = get_connection()
    now = now_str()
    data["highlights"] = json.dumps(data.get("highlights", []), ensure_ascii=False)
    data["created_at"] = now
    data["updated_at"] = now

    cols = ", ".join(data.keys())
    placeholders = ", ".join(["?"] * len(data))
    conn.execute(
        f"INSERT INTO vehicles ({cols}) VALUES ({placeholders})",
        list(data.values())
    )
    conn.commit()
    row = conn.execute("SELECT * FROM vehicles ORDER BY id DESC LIMIT 1").fetchone()
    conn.close()
    return _parse_vehicle(row_to_dict(row))


def get_vehicle(vehicle_id: int) -> Optional[dict]:
    conn = get_connection()
    row = conn.execute("SELECT * FROM vehicles WHERE id = ?", (vehicle_id,)).fetchone()
    conn.close()
    return _parse_vehicle(row_to_dict(row)) if row else None


def get_all_vehicles() -> list[dict]:
    conn = get_connection()
    rows = conn.execute("SELECT * FROM vehicles ORDER BY id").fetchall()
    conn.close()
    return [_parse_vehicle(row_to_dict(r)) for r in rows]


def update_vehicle(vehicle_id: int, data: dict) -> Optional[dict]:
    if not data:
        return get_vehicle(vehicle_id)
    if "highlights" in data:
        data["highlights"] = json.dumps(data["highlights"], ensure_ascii=False)
    data["updated_at"] = now_str()
    set_clause = ", ".join([f"{k} = ?" for k in data.keys()])
    conn = get_connection()
    conn.execute(
        f"UPDATE vehicles SET {set_clause} WHERE id = ?",
        list(data.values()) + [vehicle_id]
    )
    conn.commit()
    conn.close()
    return get_vehicle(vehicle_id)


def delete_vehicle(vehicle_id: int) -> bool:
    conn = get_connection()
    cursor = conn.execute("DELETE FROM vehicles WHERE id = ?", (vehicle_id,))
    conn.commit()
    conn.close()
    return cursor.rowcount > 0


def _parse_vehicle(d: dict) -> dict:
    """解析车型的 JSON 字段"""
    if "highlights" in d and isinstance(d["highlights"], str):
        d["highlights"] = json.loads(d["highlights"])
    return d


# ─────────────────────────────────────────
# 客户 CRUD
# ─────────────────────────────────────────

def create_customer(data: dict) -> dict:
    conn = get_connection()
    now = now_str()
    data["profile"] = json.dumps(data.get("profile") or {}, ensure_ascii=False)
    data["created_at"] = now
    data["updated_at"] = now

    cols = ", ".join(data.keys())
    placeholders = ", ".join(["?"] * len(data))
    conn.execute(
        f"INSERT INTO customers ({cols}) VALUES ({placeholders})",
        list(data.values())
    )
    conn.commit()
    row = conn.execute("SELECT * FROM customers ORDER BY id DESC LIMIT 1").fetchone()
    conn.close()
    return _parse_customer(row_to_dict(row))


def get_customer(customer_id: int) -> Optional[dict]:
    conn = get_connection()
    row = conn.execute("SELECT * FROM customers WHERE id = ?", (customer_id,)).fetchone()
    conn.close()
    return _parse_customer(row_to_dict(row)) if row else None


def get_all_customers() -> list[dict]:
    conn = get_connection()
    rows = conn.execute("SELECT * FROM customers ORDER BY updated_at DESC").fetchall()
    conn.close()
    return [_parse_customer(row_to_dict(r)) for r in rows]


def update_customer(customer_id: int, data: dict) -> Optional[dict]:
    if not data:
        return get_customer(customer_id)
    if "profile" in data and isinstance(data["profile"], dict):
        data["profile"] = json.dumps(data["profile"], ensure_ascii=False)
    data["updated_at"] = now_str()
    set_clause = ", ".join([f"{k} = ?" for k in data.keys()])
    conn = get_connection()
    conn.execute(
        f"UPDATE customers SET {set_clause} WHERE id = ?",
        list(data.values()) + [customer_id]
    )
    conn.commit()
    conn.close()
    return get_customer(customer_id)


def update_customer_notes(customer_id: int, notes: str) -> Optional[dict]:
    return update_customer(customer_id, {"notes": notes})


def _parse_customer(d: dict) -> dict:
    if "profile" in d and isinstance(d["profile"], str):
        d["profile"] = json.loads(d["profile"])
    return d


# ─────────────────────────────────────────
# 推荐记录 CRUD
# ─────────────────────────────────────────

def save_recommendation(data: dict) -> dict:
    conn = get_connection()
    now = now_str()
    data["profile"]  = json.dumps(data.get("profile") or {}, ensure_ascii=False)
    data["results"]  = json.dumps(data.get("results") or [], ensure_ascii=False)
    data["created_at"] = now

    cols = ", ".join(data.keys())
    placeholders = ", ".join(["?"] * len(data))
    conn.execute(
        f"INSERT INTO recommendations ({cols}) VALUES ({placeholders})",
        list(data.values())
    )
    conn.commit()
    conn.close()
    return data


def get_recommendations_by_customer(customer_id: int) -> list[dict]:
    conn = get_connection()
    rows = conn.execute(
        "SELECT * FROM recommendations WHERE customer_id = ? ORDER BY created_at DESC",
        (customer_id,)
    ).fetchall()
    conn.close()
    return [_parse_recommendation(row_to_dict(r)) for r in rows]


def _parse_recommendation(d: dict) -> dict:
    for key in ("profile", "results"):
        if key in d and isinstance(d[key], str):
            d[key] = json.loads(d[key])
    return d


# ─────────────────────────────────────────
# 对话 CRUD
# ─────────────────────────────────────────

def create_or_get_session(session_id: str, customer_id: Optional[int] = None) -> dict:
    conn = get_connection()
    row = conn.execute(
        "SELECT * FROM chat_sessions WHERE session_id = ?", (session_id,)
    ).fetchone()

    if row:
        conn.close()
        return _parse_session(row_to_dict(row))

    now = now_str()
    conn.execute(
        "INSERT INTO chat_sessions (session_id, customer_id, messages, created_at, updated_at) VALUES (?,?,?,?,?)",
        (session_id, customer_id, "[]", now, now)
    )
    conn.commit()
    row = conn.execute("SELECT * FROM chat_sessions WHERE session_id = ?", (session_id,)).fetchone()
    conn.close()
    return _parse_session(row_to_dict(row))


def append_message(session_id: str, message: dict) -> dict:
    session = create_or_get_session(session_id)
    messages = session.get("messages", [])
    messages.append(message)
    conn = get_connection()
    conn.execute(
        "UPDATE chat_sessions SET messages = ?, updated_at = ? WHERE session_id = ?",
        (json.dumps(messages, ensure_ascii=False), now_str(), session_id)
    )
    conn.commit()
    conn.close()
    return create_or_get_session(session_id)


def get_recent_messages(session_id: str, n: int = 8) -> list[dict]:
    session = create_or_get_session(session_id)
    messages = session.get("messages", [])
    return messages[-n:]


def _parse_session(d: dict) -> dict:
    if "messages" in d and isinstance(d["messages"], str):
        d["messages"] = json.loads(d["messages"])
    return d


# ─────────────────────────────────────────
# 数据统计（Dashboard）
# ─────────────────────────────────────────

def get_dashboard_stats() -> dict:
    conn = get_connection()

    total_customers = conn.execute("SELECT COUNT(*) FROM customers").fetchone()[0]
    new_customers_7d = conn.execute(
        "SELECT COUNT(*) FROM customers WHERE created_at >= datetime('now', '-7 days')"
    ).fetchone()[0]

    total_recs = conn.execute("SELECT COUNT(*) FROM recommendations").fetchone()[0]
    recs_7d = conn.execute(
        "SELECT COUNT(*) FROM recommendations WHERE created_at >= datetime('now', '-7 days')"
    ).fetchone()[0]

    total_chats = conn.execute("SELECT COUNT(*) FROM chat_sessions").fetchone()[0]
    total_vehicles = conn.execute("SELECT COUNT(*) FROM vehicles").fetchone()[0]
    chats_7d = conn.execute(
        "SELECT COUNT(*) FROM chat_sessions WHERE created_at >= datetime('now', '-7 days')"
    ).fetchone()[0]

    stage_rows = conn.execute(
        "SELECT stage, COUNT(*) as cnt FROM customers GROUP BY stage"
    ).fetchall()
    stage_dist = {r["stage"]: r["cnt"] for r in stage_rows}
    

    # 热门推荐车型 Top5
    rec_rows = conn.execute(
        "SELECT results FROM recommendations ORDER BY created_at DESC LIMIT 50"
    ).fetchall()

    model_counts = {}
    for row in rec_rows:
        try:
            results = json.loads(row["results"]) if isinstance(row["results"], str) else row["results"]
            for r in (results or []):
                v = r.get("vehicle") or {}
                name = f"{v.get('brand', '')} {v.get('model', '')}".strip()
                if name:
                    model_counts[name] = model_counts.get(name, 0) + 1
        except Exception:
            continue

    top_models = sorted(
        [{"name": k, "count": v} for k, v in model_counts.items()],
        key=lambda x: x["count"], reverse=True
    )[:5]

    # 近14天活跃趋势
    daily_rows = conn.execute("""
        SELECT date(created_at) as date, COUNT(*) as cnt
        FROM recommendations
        WHERE created_at >= datetime('now', '-14 days')
        GROUP BY date(created_at)
    """).fetchall()
    rec_by_date = {r["date"]: r["cnt"] for r in daily_rows}

    chat_rows = conn.execute("""
        SELECT date(created_at) as date, COUNT(*) as cnt
        FROM chat_sessions
        WHERE created_at >= datetime('now', '-14 days')
        GROUP BY date(created_at)
    """).fetchall()
    chat_by_date = {r["date"]: r["cnt"] for r in chat_rows}

    from datetime import date, timedelta
    daily_activity = []
    for i in range(14):
        d = (date.today() - timedelta(days=13 - i)).isoformat()
        daily_activity.append({
            "date": d[5:],  # 只显示月/日
            "recommend": rec_by_date.get(d, 0),
            "chat": chat_by_date.get(d, 0),
        })

    conn.close()

    return {
        "total_customers": total_customers,
        "new_customers_7d": new_customers_7d,
        "total_recommendations": total_recs,
        "recommendations_7d": recs_7d,
        "total_chats": total_chats,
        "chats_7d": chats_7d,
        "top_recommended_models": top_models,
        "customer_stage_dist": stage_dist,
        "daily_activity_14d": daily_activity,
        "total_vehicles": total_vehicles,
    }