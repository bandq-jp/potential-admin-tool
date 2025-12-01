'use client';

import { Card, CardHeader, CardContent, Divider, IconButton } from '@mui/material';
import { MoreHorizontal } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { FunnelStats } from '@/domain/entities/candidate';

interface FunnelChartProps {
  stats?: FunnelStats;
}

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
    <Card sx={{ height: 400 }}>
      <CardHeader
        title="選考ファネル (今期累積)"
        action={
          <IconButton>
            <MoreHorizontal />
          </IconButton>
        }
      />
      <Divider />
      <CardContent sx={{ height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: 'none',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
            />
            <Bar dataKey="count" fill="#60a5fa" radius={[0, 4, 4, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

