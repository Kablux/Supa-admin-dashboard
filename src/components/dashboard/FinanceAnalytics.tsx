import React, { useState } from 'react';
import { Box, Typography, Select, MenuItem, FormControl } from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';

import type { TooltipProps } from "recharts";
// import type {
//   TooltipProps,
//   ValueType,
//   NameType,
// } from "recharts";

import { financeData } from '../../data/mockData.js';
import { useThemeMode } from '../../theme/ThemeContext.js';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value?: number;
    color?: string;
    dataKey?: string;
  }>;
  label?: string;
}
const CustomTooltip = ({
  active,
  payload,
  label,
}: CustomTooltipProps) => {  
  if (!active || !payload?.length) return null;

  return (
    <Box
      sx={{
        backgroundColor: "var(--bg-secondary)",
        border: "1px solid var(--border)",
        borderRadius: "10px",
        p: 1.5,
        minWidth: 130,
      }}
    >
      <Typography
        sx={{
          fontSize: 11,
          color: "var(--text-muted)",
          mb: 0.75,
        }}
      >
        {label}
      </Typography>

      {payload.map((entry) => (
        <Box
          key={String(entry.dataKey)}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 0.25,
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "2px",
              backgroundColor: entry.color,
            }}
          />

          <Typography
            sx={{
              fontSize: 12,
              color: "var(--text-primary)",
              fontWeight: 500,
            }}
          >
            ₦{Number(entry.value).toLocaleString()}
          </Typography>

          <Typography
            sx={{
              fontSize: 11,
              color: "var(--text-muted)",
              textTransform: "capitalize",
            }}
          >
            {entry.dataKey}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default function FinanceAnalytics() {
  const [period, setPeriod] = useState('month');
  const { mode } = useThemeMode();
  const gridColor = mode === 'dark' ? '#1e1e1e' : '#eaeaea';
  const tickColor  = mode === 'dark' ? '#555'    : '#aaa';

  return (
    <Box
      sx={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '14px',
        p: 2.25,
        transition: 'background-color 0.25s ease',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.75 }}>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: 14.5, color: 'var(--text-primary)' }}>
            Finance Analytics
          </Typography>
          <Typography sx={{ fontSize: 11, color: 'var(--text-muted)' }}>
            Track your finance
          </Typography>
        </Box>
        <FormControl size="small">
          <Select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            sx={{
              fontSize: 12, height: 28,
              color: 'var(--text-secondary)',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border)' },
              '& .MuiSelect-icon': { color: 'var(--text-muted)' },
              '& .MuiSelect-select': { py: 0.4 },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--accent-gold)' },
            }}
          >
            <MenuItem value="week"  sx={{ fontSize: 12 }}>This week</MenuItem>
            <MenuItem value="month" sx={{ fontSize: 12 }}>This month</MenuItem>
            <MenuItem value="year"  sx={{ fontSize: 12 }}>This year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Legend */}
      <Box sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
        {[{ color: '#EF5350', label: 'expenses' }, { color: '#4CAF50', label: 'income' }].map(({ color, label }) => (
          <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color }} />
            <Typography sx={{ fontSize: 11, color: 'var(--text-muted)' }}>{label}</Typography>
          </Box>
        ))}
      </Box>

      {/* Chart */}
      <Box sx={{ height: 190 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={financeData} barGap={2} barSize={9} margin={{ left: -20, right: 4, top: 4, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false} tickLine={false}
              tick={{ fill: tickColor, fontSize: 10 }}
            />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.025)' }} />
            <Bar dataKey="expenses" fill="#EF5350" radius={[3, 3, 0, 0]} opacity={0.85} />
            <Bar dataKey="income"   fill="#4CAF50" radius={[3, 3, 0, 0]} opacity={0.85} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
