'use client';

import { Card, CardHeader, CardContent, Divider, IconButton, Box, Typography } from '@mui/material';
import { MoreHorizontal } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { FunnelStats } from '@/domain/entities/candidate';

interface FunnelChartProps {
  stats?: FunnelStats;
}

// グラデーション風のカラーパレット
const barColors = [
  '#3b82f6',
  '#60a5fa',
  '#6366f1',
  '#818cf8',
  '#8b5cf6',
  '#10b981',
  '#14b8a6',
];

export function FunnelChart({ stats }: FunnelChartProps) {
  const data = stats
    ? [
        { name: '0.5次面談', count: stats.stage_0_5_done },
        { name: '0.5次通過', count: stats.stage_0_5_passed },
        { name: '一次面談', count: stats.stage_first_done },
        { name: '一次通過', count: stats.stage_first_passed },
        { name: '最終面談', count: stats.stage_final_done },
        { name: '内定', count: stats.stage_final_offer },
        { name: '入社', count: stats.hired },
      ]
    : [];

  return (
    <Card sx={{ height: 420 }}>
      <CardHeader
        title="選考ファネル (今期累積)"
        titleTypographyProps={{
          variant: 'h6',
          fontWeight: 600,
          fontSize: '1rem',
        }}
        action={
          <IconButton 
            size="small"
            sx={{ 
              color: 'text.secondary',
              '&:hover': { color: 'text.primary' },
            }}
          >
            <MoreHorizontal size={18} />
          </IconButton>
        }
        sx={{ px: 3, py: 2.5 }}
      />
      <Divider />
      <CardContent sx={{ height: 340, px: 3, py: 2 }}>
        {data.length === 0 ? (
          <Box 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
            }}
          >
            <Typography color="text.secondary">データがありません</Typography>
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={data}
              margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                horizontal={false} 
                stroke="#e2e8f0"
              />
              <XAxis 
                type="number" 
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={85} 
                tick={{ fontSize: 12, fill: '#334155' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: 'none',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                  padding: '10px 14px',
                }}
                labelStyle={{ fontWeight: 600, marginBottom: 4 }}
                formatter={(value: number) => [`${value}名`, '人数']}
              />
              <Bar 
                dataKey="count" 
                radius={[0, 6, 6, 0]} 
                barSize={24}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
