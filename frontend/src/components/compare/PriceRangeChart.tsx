// AutoLens — components/compare/PriceRangeChart.tsx
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";
import type { CompareVehicle } from "./VehicleSelector";

const COLORS = ["#3d5a3d", "#e67e00", "#1a73e8"];

interface PriceRangeChartProps {
  vehicles: CompareVehicle[];
}

const CustomDot = (props: any) => {
  const { cx, cy, fill, payload } = props;
  const r = Math.max(8, Math.min(20, payload.price_min / 3));
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={fill} fillOpacity={0.85} />
      <text
        x={cx}
        y={cy - r - 4}
        textAnchor="middle"
        fontSize={11}
        fill="#2d2d2d"
        fontWeight={600}
      >
        {payload.brand} {payload.model}
      </text>
    </g>
  );
};

export default function PriceRangeChart({ vehicles }: PriceRangeChartProps) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 600 }}>价格 - 续航对比</div>
        <div style={{ fontSize: 12, color: "#999" }}>
          气泡大小·电池容量（kWh）
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <ScatterChart margin={{ top: 20, right: 20, left: -10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0ec" />
          <XAxis
            dataKey="price_min"
            type="number"
            name="起售价"
            unit="万"
            tick={{ fontSize: 12 }}
            domain={[5, "auto"]}
          >
            <Label
              value="起售价（万元）"
              offset={-10}
              position="insideBottom"
              style={{ fontSize: 12, fill: "#999" }}
            />
          </XAxis>
          <YAxis
            dataKey="range_km"
            type="number"
            name="续航"
            unit="km"
            tick={{ fontSize: 12 }}
            domain={[300, "auto"]}
          />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            content={({ payload }) => {
              if (!payload?.length) return null;
              const d = payload[0].payload;
              return (
                <div
                  style={{
                    background: "#fff",
                    border: "1px solid #e0e0d8",
                    borderRadius: 8,
                    padding: "10px 14px",
                    fontSize: 13,
                  }}
                >
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>
                    {d.brand} {d.model}
                  </div>
                  <div>起售价：{d.price_min} 万</div>
                  <div>续航：{d.range_km} km</div>
                  <div>综合评分：{d.score} 分</div>
                </div>
              );
            }}
          />
          {vehicles.map((v, i) => (
            <Scatter
              key={v.id}
              data={[v]}
              fill={COLORS[i % COLORS.length]}
              shape={<CustomDot />}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 20,
          marginTop: 8,
        }}
      >
        {vehicles.map((v, i) => (
          <div
            key={v.id}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: COLORS[i % COLORS.length],
              }}
            />
            <span style={{ fontSize: 14, color: "#666" }}>
              {v.brand} {v.model}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
