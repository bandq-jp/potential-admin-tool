'use client';

import Link from 'next/link';
import { Box, Typography, Button, Grid } from '@mui/material';
import { Plus, Users, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import { KPICard } from '@/components/dashboard/KPICard';
import { FunnelChart } from '@/components/dashboard/FunnelChart';
import { AgentPerformanceChart } from '@/components/dashboard/AgentPerformanceChart';
import { PendingInterviewsTable } from '@/components/dashboard/PendingInterviewsTable';
import { useCandidates, useFunnelStats } from '@/hooks/useCandidates';
import { useAgentStats } from '@/hooks/useAgents';

export default function DashboardPage() {
  const { candidates } = useCandidates();
  const { stats: funnelStats } = useFunnelStats();
  const { stats: agentStats } = useAgentStats();

  const activeCandidates = candidates.filter(
    (c) => c.hire_status === 'undecided' && c.stage_final_result !== 'rejected'
  );
  const mismatchCount = candidates.filter((c) => c.mismatch_flag).length;
  const hiredThisMonth = candidates.filter((c) => c.hire_status === 'hired').length;

  const passRate = funnelStats
    ? funnelStats.stage_0_5_done > 0
      ? ((funnelStats.stage_0_5_passed / funnelStats.stage_0_5_done) * 100).toFixed(1)
      : '0'
    : '-';

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" gutterBottom>
            採用状況サマリー
          </Typography>
          <Typography variant="body2" color="text.secondary">
            最終更新: {new Date().toLocaleString('ja-JP')}
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
            value={activeCandidates.length}
            unit="名"
            trend="+12% (前月比)"
            trendColor="success"
            icon={Users}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KPICard
            title="0.5次面談 通過率"
            value={passRate}
            unit="%"
            subtext={`実施数: ${funnelStats?.stage_0_5_done ?? 0}件`}
            icon={FileText}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KPICard
            title="今月の内定承諾"
            value={hiredThisMonth}
            unit="名"
            trend="目標達成まであと2名"
            trendColor="warning"
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

