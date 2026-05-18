"""
AutoLens — scripts/import_vehicles_csv.py
从 CSV 文件导入车型数据
运行方式：cd backend && python scripts/import_vehicles_csv.py
"""

import sys
import os
import csv
import json

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import get_connection, now_str

CSV_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "vehicles.csv")


def parse_list(s):
    if not s:
        return []
    return [x.strip() for x in s.split(';') if x.strip()]


def safe_float(s):
    try:
        v = float(s)
        return round(v / 10000, 2) if v > 1000 else v
    except:
        return None


def safe_int(s):
    try:
        return int(float(s))
    except:
        return None


def import_vehicles():
    if not os.path.exists(CSV_PATH):
        print(f"❌ 找不到文件：{CSV_PATH}")
        return

    conn = get_connection()
    now = now_str()
    success = 0
    skip = 0
    error = 0

    with open(CSV_PATH, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            brand = row['brand'].strip()
            model = row['model'].strip()

            if not brand or not model:
                continue

            existing = conn.execute(
                "SELECT id FROM vehicles WHERE brand = ? AND model = ?",
                (brand, model)
            ).fetchone()

            if existing:
                skip += 1
                continue

            try:
                conn.execute("""
                    INSERT INTO vehicles
                    (brand, model, vehicle_type, energy_type, body_type,
                     price_min, price_max, range_km, battery_kwh, fast_charge_minutes,
                     seats, drive_type, autopilot_level, smart_cockpit,
                     wheelbase, cargo_liters, safety_score, monthly_sales,
                     suitable_scenarios, highlights, weaknesses,
                     created_at, updated_at)
                    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
                """, (
                    brand, model,
                    row.get('vehicle_type', '').strip() or None,
                    row.get('energy_type', '').strip(),
                    row.get('vehicle_type', '').strip() or None,
                    safe_float(row.get('price_min')),
                    safe_float(row.get('price_max')),
                    safe_int(row.get('cltc_range')),
                    safe_float(row.get('battery_kwh')),
                    safe_int(row.get('fast_charge_minutes')),
                    safe_int(row.get('seats')) or 5,
                    row.get('drive_type', '').strip() or None,
                    row.get('adas_level', '').strip() or None,
                    row.get('smart_cockpit', '').strip() or None,
                    safe_int(row.get('wheelbase')),
                    safe_int(row.get('trunk_volume')),
                    safe_float(row.get('safety_score')),
                    safe_int(row.get('monthly_sales')),
                    json.dumps(parse_list(row.get('suitable_scenarios', '')), ensure_ascii=False),
                    json.dumps(parse_list(row.get('highlights', '')), ensure_ascii=False),
                    json.dumps(parse_list(row.get('weaknesses', '')), ensure_ascii=False),
                    now, now
                ))
                success += 1
            except Exception as e:
                print(f"  ⚠️ 导入失败 {brand} {model}: {e}")
                error += 1

    conn.commit()
    conn.close()
    print(f"✅ 导入完成！成功 {success} 辆，跳过 {skip} 辆，失败 {error} 辆")


if __name__ == "__main__":
    import_vehicles()