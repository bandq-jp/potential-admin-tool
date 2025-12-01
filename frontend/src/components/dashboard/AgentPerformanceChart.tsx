'use client';

import { Card, CardHeader, CardContent, Divider, IconButton } from '@mui/material';
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
    count: s.referral_count,
    rate: s.stage_0_5_pass_rate,
  }));

  return (
    <Card sx={{ height: 400 }}>
      <CardHeader
        title="エージェント別 0.5通過率"
        action={
          <IconButton>
            <Settings size={16} />
          </IconButton>
        }
      />
      <Divider />
      <CardContent sx={{ height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis
              dataKey="name"
              scale="band"
              tick={{ fontSize: 10 }}
              interval={0}
              angle={-30}
              textAnchor="end"
            />
            <YAxis yAxisId="left" orientation="left" tick={{ fontSize: 10 }} />
            <YAxis yAxisId="right" orientation="right" unit="%" tick={{ fontSize: 10 }} />
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
            <Bar
              yAxisId="left"
              dataKey="count"
              name="紹介人数"
              fill="#93c5fd"
              barSize={20}
              radius={[4, 4, 0, 0]}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="rate"
              name="0.5通過率(%)"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

