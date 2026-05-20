// AutoLens — components/dashboard/ScatterPlot.tsx
import { useEffect, useMemo, useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { getVehicles } from "../../api/client";
import ChartInsight from "./ChartInsight";

const ENERGY_COLORS: Record<string, string> = {
  纯电: "#2f6fd6",
  插混: "#4f7f58",
  增程: "#d9822b",
};

const ENERGY_LABELS = ["纯电", "插混", "增程"];

function priceMid(vehicle: any) {
  const min = Number(vehicle.price_min) || 0;
  const max = Number(vehicle.price_max) || min;
  return Number(((min + max) / 2).toFixed(1));
}

function formatPrice(vehicle: any) {
  const min = Number(vehicle.price_min) || 0;
  const max = Number(vehicle.price_max) || min;
  return `${min}-${max}万`;
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e8e8e4",
        borderRadius: 8,
        padding: "10px 12px",
        boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
        fontSize: 12,
        color: "#555",
        minWidth: 180,
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 700, color: "#2d2d2d" }}>
        {item.brand} {item.model}
      </div>
      <div style={{ marginTop: 6, lineHeight: 1.7 }}>
        <div>价格区间：{item.priceLabel}</div>
        <div>CLTC续航：{item.range}km</div>
        <div>能源类型：{item.energy}</div>
        {item.fastCharge ? <div>快充时间：约{item.fastCharge}分钟</div> : null}
        {item.safety ? <div>安全评分：{item.safety}分</div> : null}
      </div>
    </div>
  );
}

export default function ScatterPlot() {
  const [vehicles, setVehicles] = useState<any[]>([]);

  useEffect(() => {
    getVehicles().then(setVehicles).catch(console.error);
  }, []);

  const chartData = useMemo(
    () =>
      vehicles
        .filter((v) => Number(v.price_min) > 0 && Number(v.range_km) > 0)
        .map((v) => ({
          ...v,
          price: priceMid(v),
          range: Number(v.range_km),
          energy: v.energy_type || "未知",
          priceLabel: formatPrice(v),
          fastCharge: Number(v.fast_charge_minutes) || 0,
          safety: Number(v.safety_score) || 0,
        })),
    [vehicles],
  );

  const grouped = useMemo(
    () =>
      ENERGY_LABELS.map((energy) => ({
        energy,
        data: chartData.filter((v) => v.energy === energy),
      })).filter((item) => item.data.length > 0),
    [chartData],
  );

  const insight = useMemo(() => {
    if (chartData.length === 0) return null;

    const valueLeader = [...chartData].sort(
      (a, b) => b.range / b.price - a.range / a.price,
    )[0];
    const denseBand = chartData.filter((v) => v.price >= 15 && v.price <= 30);

    return {
      count: denseBand.length,
      model: `${valueLeader.brand} ${valueLeader.model}`,
    };
  }, [chartData]);

  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "20px 16px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 12,
          marginBottom: 8,
        }}
      >
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>
            价格续航价值矩阵
          </div>
          <div style={{ fontSize: 12, color: "#999", marginTop: 3 }}>
            基于车型库价格区间中位数与 CLTC 续航
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {grouped.map((item) => (
            <span
              key={item.energy}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                fontSize: 11,
                color: "#777",
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: ENERGY_COLORS[item.energy] || "#999",
                }}
              />
              {item.energy}
            </span>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={210}>
        <ScatterChart margin={{ top: 12, right: 14, bottom: 4, left: -8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            type="number"
            dataKey="price"
            name="价格"
            tick={{ fontSize: 11 }}
            unit="万"
            domain={["dataMin - 5", "dataMax + 5"]}
          />
          <YAxis
            type="number"
            dataKey="range"
            name="续航"
            tick={{ fontSize: 11 }}
            unit="km"
            domain={["dataMin - 80", "dataMax + 80"]}
          />
          <ReferenceLine x={30} stroke="#ddd" strokeDasharray="4 4" />
          <ReferenceLine y={800} stroke="#ddd" strokeDasharray="4 4" />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} content={<CustomTooltip />} />
          {grouped.map((item) => (
            <Scatter
              key={item.energy}
              name={item.energy}
              data={item.data}
              fill={ENERGY_COLORS[item.energy] || "#999"}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>

      <ChartInsight accent="#d9822b" background="#fbf5ee">
        {insight ? (
          <>
            <strong style={{ color: "#2d3748" }}>{insight.count}</strong>{" "}
            款车型集中在15-30万，{" "}
            <strong style={{ color: "#d9822b" }}>{insight.model}</strong>{" "}
            的续航/价格表现较突出
          </>
        ) : (
          "暂无车型数据"
        )}
      </ChartInsight>
    </div>
  );
}
