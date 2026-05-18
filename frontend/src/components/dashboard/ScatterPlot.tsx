// AutoLens — components/dashboard/ScatterPlot.tsx
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const GREEN = "#5a7a5a";

const scatterData = [
  { price: 15, range: 500 },
  { price: 18, range: 600 },
  { price: 22, range: 700 },
  { price: 25, range: 650 },
  { price: 28, range: 800 },
  { price: 32, range: 750 },
  { price: 35, range: 900 },
  { price: 40, range: 1000 },
  { price: 45, range: 950 },
  { price: 20, range: 550 },
  { price: 55, range: 1100 },
  { price: 12, range: 400 },
];

export default function ScatterPlot() {
  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "20px 16px" }}>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
        价格 - 续航散点
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <ScatterChart margin={{ left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="price"
            name="价格(万)"
            tick={{ fontSize: 11 }}
            unit="万"
          />
          <YAxis
            dataKey="range"
            name="续航(km)"
            tick={{ fontSize: 11 }}
            unit="km"
          />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Scatter data={scatterData} fill={GREEN} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
