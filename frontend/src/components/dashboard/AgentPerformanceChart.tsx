'use client';

import { Card, CardHeader, CardContent, Divider, IconButton, Box, Typography } from '@mui/material';
import { Settings } from 'lucide-react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { AgentStats } from '@/domain/entities/agent';

interface AgentPerformanceChartProps {
  stats: AgentStats[];
}

export function AgentPerformanceChart({ stats }: AgentPerformanceChartProps) {
  const data = stats.map((s) => ({
    name: s.company_name.length > 6 ? s.company_name.slice(0, 6) + '...' : s.company_name,
    fullName: s.company_name,
    count: s.referral_count,
    rate: s.stage_0_5_pass_rate,
  }));

  return (
    <Card sx={{ height: 420 }}>
      <CardHeader
        title="エージェント別 0.5通過率"
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
            <Settings size={18} />
          </IconButton>
        }
        sx={{ px: 3, py: 2.5 }}
      />
      <Divider />
      <CardContent sx={{ height: 340, px: 2, py: 2 }}>
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
            <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 40, left: -10 }}>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                scale="band"
                tick={{ fontSize: 11, fill: '#334155' }}
                interval={0}
                angle={-35}
                textAnchor="end"
                height={50}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis 
                yAxisId="left" 
                orientation="left" 
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                unit="%" 
                tick={{ fontSize: 11, fill: '#64748b' }}
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
                formatter={(value: number, name: string) => {
                  if (name === '紹介人数') return [`${value}名`, name];
                  return [`${value}%`, name];
                }}
                labelFormatter={(_, payload) => {
                  if (payload && payload.length > 0) {
                    return payload[0].payload.fullName;
                  }
                  return '';
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                wrapperStyle={{ paddingTop: 10 }}
                formatter={(value) => (
                  <span style={{ color: '#334155', fontSize: 12, fontWeight: 500 }}>{value}</span>
                )}
              />
              <Bar
                yAxisId="left"
                dataKey="count"
                name="紹介人数"
                fill="#60a5fa"
                barSize={28}
                radius={[4, 4, 0, 0]}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="rate"
                name="0.5通過率(%)"
                stroke="#8b5cf6"
                strokeWidth={2.5}
                dot={{ r: 5, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 7, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
