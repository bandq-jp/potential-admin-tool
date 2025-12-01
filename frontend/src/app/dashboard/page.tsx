'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Box, Typography, Button, Grid } from '@mui/material';
import { Plus, Users, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import { KPICard } from '@/components/dashboard/KPICard';
import { FunnelChart } from '@/components/dashboard/FunnelChart';
import { AgentPerformanceChart } from '@/components/dashboard/AgentPerformanceChart';
import { PendingInterviewsTable } from '@/components/dashboard/PendingInterviewsTable';
import { useCandidates, useFunnelStats, useDashboardStats } from '@/hooks/useCandidates';
import { useAgentStats } from '@/hooks/useAgents';

export default function DashboardPage() {
  const { candidates } = useCandidates();
  const { stats: funnelStats } = useFunnelStats();
  const { stats: agentStats } = useAgentStats();
  const { stats: dashboardStats } = useDashboardStats();
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    setLastUpdated(new Date().toLocaleString('ja-JP'));
  }, []);

  const activeCandidatesCount = dashboardStats?.active_candidates ?? 0;
  const mismatchCount = dashboardStats?.mismatch_count ?? 0;
  const hiredThisMonth = dashboardStats?.hired_this_month ?? 0;
  const passRate = dashboardStats?.stage_0_5_pass_rate?.toFixed(1) ?? '-';
  const passRateDoneCount = dashboardStats?.stage_0_5_done_count ?? 0;

  const activeTrendText = (() => {
    const trend = dashboardStats?.active_trend_percent;
    if (trend === null || trend === undefined) return null;
    const sign = trend >= 0 ? '+' : '';
    return `${sign}${trend.toFixed(1)}% (前月比)`;
  })();

  const hiredTrendText = (() => {
    const trend = dashboardStats?.hired_trend_percent;
    if (trend === null || trend === undefined) return null;
    const sign = trend >= 0 ? '+' : '';
    return `${sign}${trend.toFixed(1)}% (前月比)`;
  })();

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" gutterBottom>
            採用状況サマリー
          </Typography>
          <Typography variant="body2" color="text.secondary">
            最終更新: {lastUpdated || '読み込み中...'}
          </Typography>
        </Box>
        <Button
          component={Link}
          href="/dashboard/candidates/new"
          variant="contained"
          startIcon={<Plus size={18} />}
          disableElevation
          size="large"
        >
          新規候補者登録
        </Button>
      </Box>

      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KPICard
            title="進行中候補者数"
            value={activeCandidatesCount}
            unit="名"
            trend={activeTrendText ?? undefined}
            trendColor={dashboardStats?.active_trend_percent !== null && dashboardStats?.active_trend_percent !== undefined
              ? (dashboardStats.active_trend_percent >= 0 ? 'success' : 'error')
              : undefined}
            icon={Users}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KPICard
            title="0.5次面談 通過率"
            value={passRate}
            unit="%"
            subtext={`実施数: ${passRateDoneCount}件`}
            icon={FileText}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KPICard
            title="今月の内定承諾"
            value={hiredThisMonth}
            unit="名"
            trend={hiredTrendText ?? undefined}
            trendColor={dashboardStats?.hired_trend_percent !== null && dashboardStats?.hired_trend_percent !== undefined
              ? (dashboardStats.hired_trend_percent >= 0 ? 'success' : 'error')
              : undefined}
            icon={CheckCircle2}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KPICard
            title="ミスマッチ報告"
            value={mismatchCount}
            unit="件"
            alert={mismatchCount > 0}
            icon={AlertTriangle}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <FunnelChart stats={funnelStats} />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <AgentPerformanceChart stats={agentStats} />
        </Grid>
      </Grid>

      <PendingInterviewsTable candidates={candidates} />
    </Box>
  );
}
