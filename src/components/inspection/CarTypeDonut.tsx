import { Box, Typography, IconButton } from "@mui/material";
import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip as ReTooltip } from 'recharts';
import { useAppSelector } from "../../redux/hooks";

export function CarTypeDonut() {
  const { carTypeStats, totalInspectedValue } = useAppSelector(s => s.inspection);
  const TIME_TABS = ['Today', 'Weekly', 'Monthly'];
  const [activeTime, setActiveTime] = useState('Today');

  return (
    <Box sx={{
      backgroundColor: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: '16px',
      p: 2.5,
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      transition: 'background-color 0.25s',
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={{ fontWeight: 700,color: 'var(--text-primary)' }}>
          Top 5 Car Inspected
        </Typography>
        <IconButton size="small" sx={{ color: 'var(--text-muted)' }}>
          <Typography sx={{ fontSize: 18, lineHeight: 1 }}>⋯</Typography>
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Donut */}
        <Box sx={{ position: 'relative', width: 160, height: 160, flexShrink: 0 }}>
          <PieChart width={160} height={160}>
            <Pie
              data={carTypeStats}
              cx={75} cy={75}
              innerRadius={48} outerRadius={72}
              paddingAngle={2}
              dataKey="percentage"
              startAngle={90} endAngle={-270}
            >
              {carTypeStats.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <ReTooltip
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => [`${value}%`]}
              contentStyle={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: 8, fontSize: 12,
              }}
            />
          </PieChart>
          <Box sx={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none',
          }}>
            <Typography sx={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.2 }}>
              Total income
            </Typography>
            <Typography sx={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>
              N{totalInspectedValue.toLocaleString()}.00
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.1 }}>
          {carTypeStats.map((stat, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: stat.color, flexShrink: 0 }} />
                <Typography sx={{ fontSize: 14, color: 'var(--text-secondary)' }}>{stat.label}</Typography>
              </Box>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                {stat.count.toLocaleString()}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Time tabs */}
      {/* <Box sx={{ display: 'flex', gap: 1.5, pt: 0.5 }}>
        {TIME_TABS.map(t => (
          <Typography
            key={t}
            onClick={() => setActiveTime(t)}
            sx={{
              fontSize: 12, cursor: 'pointer',
              color: activeTime === t ? 'var(--accent-gold)' : 'var(--text-muted)',
              fontWeight: activeTime === t ? 600 : 400,
              borderBottom: activeTime === t ? '1.5px solid var(--accent-gold)' : '1.5px solid transparent',
              pb: 0.25, transition: 'all 0.15s',
            }}
          >
            {t}
          </Typography>
        ))}
      </Box> */}
    </Box>
  );
}