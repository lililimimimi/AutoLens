
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import get_connection, now_str
import json

VEHICLES = [
    {"brand":"比亚迪","model":"宋PLUS DM-i","energy_type":"插混","body_type":"SUV","price_min":12.98,"price_max":16.98,"range_km":1100,"autopilot_level":"L2","seats":5,"cargo_liters":574,"highlights":["插混油耗低","空间实用","保有量大","售后网点多"]},
    {"brand":"比亚迪","model":"宋L EV","energy_type":"纯电","body_type":"SUV","price_min":18.98,"price_max":24.98,"range_km":662,"autopilot_level":"L2","seats":5,"cargo_liters":410,"highlights":["纯电平台","外观运动","空间表现好"]},
    {"brand":"特斯拉","model":"Model Y","energy_type":"纯电","body_type":"SUV","price_min":26.39,"price_max":36.39,"range_km":688,"autopilot_level":"L2+","seats":5,"cargo_liters":854,"highlights":["能耗控制优秀","补能网络成熟","保值率高"]},
    {"brand":"小鹏","model":"G6","energy_type":"纯电","body_type":"SUV","price_min":19.99,"price_max":27.69,"range_km":755,"autopilot_level":"L2+","seats":5,"cargo_liters":571,"highlights":["800V快充","智驾能力强","性价比高"]},
    {"brand":"理想","model":"L6","energy_type":"增程","body_type":"SUV","price_min":24.98,"price_max":27.98,"range_km":1390,"autopilot_level":"L2+","seats":5,"cargo_liters":491,"highlights":["空间舒适","增程适合长途","座舱体验强"]},
    {"brand":"理想","model":"L7","energy_type":"增程","body_type":"SUV","price_min":31.98,"price_max":37.98,"range_km":1315,"autopilot_level":"L2+","seats":5,"cargo_liters":801,"highlights":["舒适性强","空间大","配置丰富"]},
    {"brand":"问界","model":"M7","energy_type":"增程","body_type":"SUV","price_min":24.98,"price_max":32.98,"range_km":1300,"autopilot_level":"L2+","seats":5,"cargo_liters":686,"highlights":["鸿蒙生态","舒适配置强","主动安全丰富"]},
    {"brand":"问界","model":"M9","energy_type":"增程","body_type":"SUV","price_min":46.98,"price_max":56.98,"range_km":1402,"autopilot_level":"L2+","seats":6,"cargo_liters":716,"highlights":["高端配置","空间豪华","科技感强"]},
    {"brand":"蔚来","model":"ES6","energy_type":"纯电","body_type":"SUV","price_min":33.80,"price_max":39.60,"range_km":625,"autopilot_level":"L2+","seats":5,"cargo_liters":579,"highlights":["换电体系","服务体验好","底盘质感强"]},
    {"brand":"蔚来","model":"ET5T","energy_type":"纯电","body_type":"SUV","price_min":29.80,"price_max":35.60,"range_km":680,"autopilot_level":"L2+","seats":5,"cargo_liters":450,"highlights":["旅行车造型","驾驶质感好","换电便利"]},
    {"brand":"极氪","model":"007","energy_type":"纯电","body_type":"轿车","price_min":20.99,"price_max":29.99,"range_km":870,"autopilot_level":"L2+","seats":5,"cargo_liters":462,"highlights":["续航强","快充快","底盘质感好"]},
    {"brand":"极氪","model":"001","energy_type":"纯电","body_type":"SUV","price_min":26.90,"price_max":32.90,"range_km":750,"autopilot_level":"L2+","seats":5,"cargo_liters":2144,"highlights":["空间大","性能强","底盘高级"]},
    {"brand":"吉利","model":"银河L7","energy_type":"插混","body_type":"SUV","price_min":12.57,"price_max":16.97,"range_km":1370,"autopilot_level":"L2","seats":5,"cargo_liters":650,"highlights":["价格亲民","插混省油","配置丰富"]},
    {"brand":"长安","model":"深蓝S7","energy_type":"增程","body_type":"SUV","price_min":14.99,"price_max":21.79,"range_km":1120,"autopilot_level":"L2","seats":5,"cargo_liters":570,"highlights":["设计年轻","价格友好","增程实用"]},
    {"brand":"零跑","model":"C11","energy_type":"增程","body_type":"SUV","price_min":14.88,"price_max":20.58,"range_km":1210,"autopilot_level":"L2","seats":5,"cargo_liters":375,"highlights":["价格优势大","空间宽敞","配置高"]},
    {"brand":"埃安","model":"AION Y","energy_type":"纯电","body_type":"SUV","price_min":11.98,"price_max":18.98,"range_km":610,"autopilot_level":"L2","seats":5,"cargo_liters":405,"highlights":["空间大","价格亲民","城市代步好"]},
    {"brand":"大众","model":"ID.4 CROZZ","energy_type":"纯电","body_type":"SUV","price_min":19.39,"price_max":29.39,"range_km":600,"autopilot_level":"L2","seats":5,"cargo_liters":512,"highlights":["底盘稳","品牌认知高","安全配置扎实"]},
    {"brand":"宝马","model":"iX3","energy_type":"纯电","body_type":"SUV","price_min":40.50,"price_max":44.50,"range_km":550,"autopilot_level":"L2","seats":5,"cargo_liters":510,"highlights":["品牌豪华","操控好","做工稳定"]},
    {"brand":"腾势","model":"N7","energy_type":"纯电","body_type":"SUV","price_min":23.98,"price_max":32.98,"range_km":702,"autopilot_level":"L2+","seats":5,"cargo_liters":480,"highlights":["舒适配置强","底盘高级","品牌背书"]},
    {"brand":"岚图","model":"FREE","energy_type":"增程","body_type":"SUV","price_min":26.69,"price_max":26.69,"range_km":1201,"autopilot_level":"L2+","seats":5,"cargo_liters":560,"highlights":["底盘质感强","配置高","长途友好"]},
    {"brand":"哪吒","model":"L","energy_type":"增程","body_type":"SUV","price_min":12.99,"price_max":17.99,"range_km":1300,"autopilot_level":"L2","seats":5,"cargo_liters":583,"highlights":["价格低","配置丰富","续航焦虑低"]},
    {"brand":"小米","model":"SU7","energy_type":"纯电","body_type":"轿车","price_min":21.59,"price_max":29.99,"range_km":830,"autopilot_level":"L2+","seats":5,"cargo_liters":517,"highlights":["智能生态强","性能突出","设计吸引力强"]},
    {"brand":"特斯拉","model":"Model 3","energy_type":"纯电","body_type":"轿车","price_min":23.55,"price_max":33.95,"range_km":830,"autopilot_level":"L2","seats":5,"cargo_liters":682,"highlights":["品牌识别度高","能耗优秀","补能网络成熟"]},
    {"brand":"奔驰","model":"E300L","energy_type":"燃油","body_type":"轿车","price_min":46.50,"price_max":52.98,"range_km":0,"autopilot_level":"L2","seats":5,"cargo_liters":540,"highlights":["豪华品牌认知强","内饰氛围好","商务属性强"]},
    {"brand":"宝马","model":"530Li","energy_type":"燃油","body_type":"轿车","price_min":43.99,"price_max":52.59,"range_km":0,"autopilot_level":"L2","seats":5,"cargo_liters":520,"highlights":["驾驶质感好","品牌运动属性强","底盘扎实"]},
    {"brand":"奥迪","model":"A6L","energy_type":"燃油","body_type":"轿车","price_min":42.79,"price_max":65.68,"range_km":0,"autopilot_level":"L2","seats":5,"cargo_liters":430,"highlights":["商务形象稳重","优惠空间大","乘坐舒适"]},
    {"brand":"奔驰","model":"EQE","energy_type":"纯电","body_type":"轿车","price_min":47.80,"price_max":62.70,"range_km":752,"autopilot_level":"L2","seats":5,"cargo_liters":430,"highlights":["奔驰豪华氛围","纯电静谧","乘坐舒适"]},
    {"brand":"宝马","model":"i5","energy_type":"纯电","body_type":"轿车","price_min":43.99,"price_max":63.99,"range_km":567,"autopilot_level":"L2","seats":5,"cargo_liters":490,"highlights":["宝马操控","豪华品牌","纯电体验"]},
    {"brand":"享界","model":"S9","energy_type":"纯电","body_type":"轿车","price_min":39.98,"price_max":44.98,"range_km":816,"autopilot_level":"L2+","seats":5,"cargo_liters":378,"highlights":["鸿蒙座舱","华为智驾","行政级舒适"]},
    {"brand":"享界","model":"S9增程","energy_type":"增程","body_type":"轿车","price_min":30.98,"price_max":36.98,"range_km":1355,"autopilot_level":"L2+","seats":5,"cargo_liters":378,"highlights":["增程补能灵活","鸿蒙座舱","华为智驾"]},
    {"brand":"尊界","model":"S800","energy_type":"增程","body_type":"轿车","price_min":100.00,"price_max":150.00,"range_km":1200,"autopilot_level":"L2+","seats":5,"cargo_liters":500,"highlights":["鸿蒙智行旗舰","超豪华定位","科技配置高"]},
    {"brand":"问界","model":"M5","energy_type":"增程","body_type":"SUV","price_min":24.98,"price_max":30.98,"range_km":1440,"autopilot_level":"L2+","seats":5,"cargo_liters":369,"highlights":["鸿蒙座舱","华为智驾","增程续航长"]},
    {"brand":"问界","model":"M8","energy_type":"增程","body_type":"SUV","price_min":35.98,"price_max":44.98,"range_km":1400,"autopilot_level":"L2+","seats":6,"cargo_liters":660,"highlights":["六座布局","鸿蒙座舱","智能化强"]},
    {"brand":"阿维塔","model":"12","energy_type":"纯电","body_type":"轿车","price_min":26.58,"price_max":40.08,"range_km":700,"autopilot_level":"L2+","seats":5,"cargo_liters":490,"highlights":["造型个性","华为智驾","座舱科技感强"]},
    {"brand":"智界","model":"S7","energy_type":"纯电","body_type":"轿车","price_min":24.98,"price_max":34.98,"range_km":855,"autopilot_level":"L2+","seats":5,"cargo_liters":420,"highlights":["华为智驾","长续航","座舱智能化强"]},
    {"brand":"智界","model":"R7","energy_type":"纯电","body_type":"SUV","price_min":25.98,"price_max":37.98,"range_km":802,"autopilot_level":"L2+","seats":5,"cargo_liters":837,"highlights":["轿跑SUV","鸿蒙座舱","空间和智驾兼顾"]},
    {"brand":"蔚来","model":"ET7","energy_type":"纯电","body_type":"轿车","price_min":42.80,"price_max":51.60,"range_km":705,"autopilot_level":"L2+","seats":5,"cargo_liters":503,"highlights":["换电体系","行政舒适","服务体验强"]},
    {"brand":"极氪","model":"009","energy_type":"纯电","body_type":"MPV","price_min":43.90,"price_max":78.90,"range_km":822,"autopilot_level":"L2+","seats":6,"cargo_liters":376,"highlights":["空间豪华","安全配置强","纯电MPV标杆"]},
]


def import_vehicles():
    conn = get_connection()
    now = now_str()
    success = 0
    skip = 0

    for v in VEHICLES:
        # 检查是否已存在
        existing = conn.execute(
            "SELECT id FROM vehicles WHERE brand = ? AND model = ?",
            (v["brand"], v["model"])
        ).fetchone()

        if existing:
            skip += 1
            continue

        conn.execute("""
            INSERT INTO vehicles
            (brand, model, energy_type, body_type, price_min, price_max,
             range_km, autopilot_level, seats, cargo_liters, highlights,
             created_at, updated_at)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
        """, (
            v["brand"], v["model"], v["energy_type"], v["body_type"],
            v["price_min"], v["price_max"], v["range_km"],
            v["autopilot_level"], v["seats"], v.get("cargo_liters"),
            json.dumps(v["highlights"], ensure_ascii=False),
            now, now
        ))
        success += 1

    conn.commit()
    conn.close()
    print(f"✅ 导入完成！成功 {success} 辆，跳过（已存在）{skip} 辆")


if __name__ == "__main__":
    import_vehicles()