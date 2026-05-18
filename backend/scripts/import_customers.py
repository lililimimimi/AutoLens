"""
AutoLens — scripts/import_customers.py
批量导入20个测试客户数据
运行方式：cd backend && python scripts/import_customers.py
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import get_connection, now_str
import json

CUSTOMERS = [
    {
        "name": "张伟", "phone": "138****8888", "city": "上海",
        "stage": "有意向", "notes": "对理想L7很感兴趣，下周来店试驾",
        "profile": {"budget_min": 25, "budget_max": 35, "family_size": 4, "commute_distance": "50-100km", "charging_available": "有", "focus_points": ["续航", "空间", "智驾"]}
    },
    {
        "name": "李娜", "phone": "139****6666", "city": "北京",
        "stage": "谈判中", "notes": "预算卡在30万，考虑问界M7和理想L6",
        "profile": {"budget_min": 28, "budget_max": 32, "family_size": 2, "commute_distance": "100km以上", "charging_available": "无", "focus_points": ["智驾", "安全"]}
    },
    {
        "name": "王芳", "phone": "137****5555", "city": "深圳",
        "stage": "已成交", "notes": "已购比亚迪宋PLUS DM-i，满意度高",
        "profile": {"budget_min": 15, "budget_max": 20, "family_size": 3, "commute_distance": "50km以内", "charging_available": "有", "focus_points": ["性价比", "续航"]}
    },
    {
        "name": "刘洋", "phone": "136****4444", "city": "广州",
        "stage": "新线索", "notes": "",
        "profile": {"budget_min": 20, "budget_max": 30, "family_size": 2, "commute_distance": "50-100km", "charging_available": "不确定", "focus_points": ["空间", "补能"]}
    },
    {
        "name": "陈静", "phone": "135****3333", "city": "杭州",
        "stage": "已联系", "notes": "家庭用车，4口人，关注空间和安全",
        "profile": {"budget_min": 18, "budget_max": 25, "family_size": 4, "commute_distance": "50km以内", "charging_available": "有", "focus_points": ["空间", "安全", "性价比"]}
    },
    {
        "name": "赵磊", "phone": "134****2222", "city": "成都",
        "stage": "已流失", "notes": "选择了燃油车，暂时不考虑新能源",
        "profile": {"budget_min": 15, "budget_max": 20, "family_size": 2, "commute_distance": "50km以内", "charging_available": "无", "focus_points": ["性价比"]}
    },
    {
        "name": "孙敏", "phone": "133****1111", "city": "南京",
        "stage": "有意向", "notes": "关注小米SU7，年轻用户，科技感强",
        "profile": {"budget_min": 20, "budget_max": 30, "family_size": 1, "commute_distance": "50km以内", "charging_available": "有", "focus_points": ["智驾", "性价比", "保值"]}
    },
    {
        "name": "周强", "phone": "132****9999", "city": "武汉",
        "stage": "已联系", "notes": "两孩家庭，需要7座或大空间SUV",
        "profile": {"budget_min": 30, "budget_max": 45, "family_size": 5, "commute_distance": "50-100km", "charging_available": "有", "focus_points": ["空间", "安全", "续航"]}
    },
    {
        "name": "吴霞", "phone": "131****8888", "city": "西安",
        "stage": "新线索", "notes": "首次购车，预算有限，关注性价比",
        "profile": {"budget_min": 10, "budget_max": 15, "family_size": 2, "commute_distance": "50km以内", "charging_available": "不确定", "focus_points": ["性价比", "补能"]}
    },
    {
        "name": "郑浩", "phone": "130****7777", "city": "重庆",
        "stage": "谈判中", "notes": "对问界M9很感兴趣，高端商务需求",
        "profile": {"budget_min": 45, "budget_max": 60, "family_size": 3, "commute_distance": "50-100km", "charging_available": "有", "focus_points": ["品牌", "智驾", "空间"]}
    },
    {
        "name": "钱丽", "phone": "189****6666", "city": "苏州",
        "stage": "有意向", "notes": "考虑极氪007，关注续航和快充",
        "profile": {"budget_min": 20, "budget_max": 28, "family_size": 2, "commute_distance": "100km以上", "charging_available": "有", "focus_points": ["续航", "补能", "智驾"]}
    },
    {
        "name": "冯建国", "phone": "188****5555", "city": "天津",
        "stage": "已联系", "notes": "退休老师，家用为主，关注舒适性",
        "profile": {"budget_min": 15, "budget_max": 22, "family_size": 2, "commute_distance": "50km以内", "charging_available": "有", "focus_points": ["安全", "空间", "性价比"]}
    },
    {
        "name": "蒋雪", "phone": "187****4444", "city": "长沙",
        "stage": "新线索", "notes": "女性用户，关注外观和智能座舱",
        "profile": {"budget_min": 18, "budget_max": 25, "family_size": 1, "commute_distance": "50km以内", "charging_available": "不确定", "focus_points": ["智驾", "性价比"]}
    },
    {
        "name": "韩鹏", "phone": "186****3333", "city": "郑州",
        "stage": "已成交", "notes": "已购理想L6，家庭增程首选",
        "profile": {"budget_min": 22, "budget_max": 30, "family_size": 4, "commute_distance": "50-100km", "charging_available": "无", "focus_points": ["续航", "空间", "安全"]}
    },
    {
        "name": "杨明", "phone": "185****2222", "city": "青岛",
        "stage": "有意向", "notes": "生意人，需要商务轿车，关注品牌形象",
        "profile": {"budget_min": 40, "budget_max": 60, "family_size": 3, "commute_distance": "50-100km", "charging_available": "有", "focus_points": ["品牌", "空间", "智驾"]}
    },
    {
        "name": "朱晓燕", "phone": "184****1111", "city": "宁波",
        "stage": "已联系", "notes": "关注蔚来换电，长途出差多",
        "profile": {"budget_min": 30, "budget_max": 40, "family_size": 2, "commute_distance": "100km以上", "charging_available": "无", "focus_points": ["续航", "补能", "保值"]}
    },
    {
        "name": "秦浩然", "phone": "183****0000", "city": "合肥",
        "stage": "新线索", "notes": "工程师，关注智驾技术，偏好华为系",
        "profile": {"budget_min": 25, "budget_max": 35, "family_size": 3, "commute_distance": "50-100km", "charging_available": "有", "focus_points": ["智驾", "安全", "续航"]}
    },
    {
        "name": "许婷", "phone": "182****9999", "city": "厦门",
        "stage": "谈判中", "notes": "考虑腾势N7，对比Model Y中",
        "profile": {"budget_min": 25, "budget_max": 35, "family_size": 2, "commute_distance": "50km以内", "charging_available": "有", "focus_points": ["智驾", "保值", "性价比"]}
    },
    {
        "name": "邓超", "phone": "181****8888", "city": "福州",
        "stage": "已流失", "notes": "等待新款上市，暂缓购车",
        "profile": {"budget_min": 20, "budget_max": 30, "family_size": 3, "commute_distance": "50-100km", "charging_available": "有", "focus_points": ["性价比", "续航"]}
    },
    {
        "name": "曹雨", "phone": "180****7777", "city": "济南",
        "stage": "有意向", "notes": "第二台车，家庭代步，预算不高",
        "profile": {"budget_min": 10, "budget_max": 18, "family_size": 4, "commute_distance": "50km以内", "charging_available": "有", "focus_points": ["性价比", "空间", "安全"]}
    },
]


def import_customers():
    conn = get_connection()
    now = now_str()
    success = 0
    skip = 0

    for c in CUSTOMERS:
        existing = conn.execute(
            "SELECT id FROM customers WHERE name = ? AND phone = ?",
            (c["name"], c["phone"])
        ).fetchone()

        if existing:
            skip += 1
            continue

        conn.execute("""
            INSERT INTO customers (name, phone, city, stage, profile, notes, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            c["name"], c["phone"], c["city"], c["stage"],
            json.dumps(c["profile"], ensure_ascii=False),
            c["notes"], now, now
        ))
        success += 1

    conn.commit()
    conn.close()
    print(f"✅ 导入完成！成功 {success} 个，跳过（已存在）{skip} 个")


if __name__ == "__main__":
    import_customers()