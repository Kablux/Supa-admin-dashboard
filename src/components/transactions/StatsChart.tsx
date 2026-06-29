import { ResponsiveContainer, AreaChart, Area } from "recharts";

export function StatsChart({ data, color, positive }: { data: number[]; color: string; positive: boolean }) {
  const pts = data.map((v, i) => ({ x: i, v }));
  return (
    <ResponsiveContainer width="100%" height={40}>
      <AreaChart data={pts} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`spark-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#spark-${color.replace('#','')})`}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}