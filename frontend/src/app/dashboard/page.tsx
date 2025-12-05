'use client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Box, Typography, Button, Grid, Skeleton, alpha } from '@mui/material';
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
  const { stats: dashboardStats, isLoading } = useDashboardStats();
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
      {/* Page Header */}
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        flexDirection={{ xs: 'column', sm: 'row' }}
        gap={2}
        mb={4}
      >
        <Box>
          <Typography 
            variant="h4" 
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              letterSpacing: '-0.02em',
              mb: 0.5,
            }}
          >
            採用状況サマリー
          </Typography>
          <Typography 
            variant="body2" 
            sx={{
              color: 'text.secondary',
              fontSize: '0.8125rem',
            }}
          >
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
          sx={{
            px: 3,
            py: 1.25,
            fontWeight: 600,
            boxShadow: (theme) => `0 4px 14px ${alpha(theme.palette.primary.main, 0.25)}`,
            '&:hover': {
              boxShadow: (theme) => `0 6px 20px ${alpha(theme.palette.primary.main, 0.35)}`,
            },
          }}
        >
          新規候補者登録
        </Button>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          {isLoading ? (
            <Skeleton variant="rounded" height={160} sx={{ borderRadius: 3 }} />
          ) : (
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
          )}
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          {isLoading ? (
            <Skeleton variant="rounded" height={160} sx={{ borderRadius: 3 }} />
          ) : (
            <KPICard
              title="0.5次面談 通過率"
              value={passRate}
              unit="%"
              subtext={`実施数: ${passRateDoneCount}件`}
              icon={FileText}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          {isLoading ? (
            <Skeleton variant="rounded" height={160} sx={{ borderRadius: 3 }} />
          ) : (
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
          )}
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          {isLoading ? (
            <Skeleton variant="rounded" height={160} sx={{ borderRadius: 3 }} />
          ) : (
            <KPICard
              title="ミスマッチ報告"
              value={mismatchCount}
              unit="件"
              alert={mismatchCount > 0}
              icon={AlertTriangle}
            />
          )}
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <FunnelChart stats={funnelStats} />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <AgentPerformanceChart stats={agentStats} />
        </Grid>
      </Grid>

      {/* Pending Interviews Table */}
      <PendingInterviewsTable candidates={candidates} />
    </Box>
  );
}
