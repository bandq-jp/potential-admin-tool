'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  TextField,
  MenuItem,
  IconButton,
  Avatar,
  Tooltip,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Plus, Download, Eye, Edit, Trash2 } from 'lucide-react';
import { useCandidates, useFunnelStats } from '@/hooks/useCandidates';
import { useCompanies } from '@/hooks/useCompanies';
import { useAgents } from '@/hooks/useAgents';
import type { CandidateWithRelations, StageResult, FinalStageResult } from '@/domain/entities/candidate';

const stageResultLabels: Record<StageResult, { label: string; color: 'default' | 'success' | 'error' }> = {
  not_done: { label: '未実施', color: 'default' },
  passed: { label: '通過', color: 'success' },
  rejected: { label: '見送り', color: 'error' },
};

const finalResultLabels: Record<FinalStageResult, { label: string; color: 'default' | 'success' | 'error' | 'warning' }> = {
  not_done: { label: '未実施', color: 'default' },
  offer: { label: '内定', color: 'success' },
  rejected: { label: '見送り', color: 'error' },
  declined: { label: '辞退', color: 'warning' },
};

export default function CandidatesPage() {
  const [companyFilter, setCompanyFilter] = useState<string>('');
  const [agentFilter, setAgentFilter] = useState<string>('');

  const { candidates, isLoading, deleteCandidate } = useCandidates({
    company_id: companyFilter || undefined,
    agent_id: agentFilter || undefined,
  });
  const { stats } = useFunnelStats(companyFilter || undefined);
  const { companies } = useCompanies();
  const { agents } = useAgents();

  const handleDelete = async (id: string) => {
    if (confirm('この候補者を削除しますか？')) {
      await deleteCandidate(id);
    }
  };

  const columns: GridColDef<CandidateWithRelations>[] = [
    {
      field: 'name',
      headerName: '候補者名',
      width: 180,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem', bgcolor: 'primary.light' }}>
            {params.row.name.charAt(0)}
          </Avatar>
          <Typography variant="body2" fontWeight={600}>
            {params.row.name}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'company_name',
      headerName: '企業',
      width: 160,
    },
    {
      field: 'job_position_name',
      headerName: 'ポジション',
      width: 140,
      renderCell: (params) => (
        <Chip label={params.value} size="small" variant="outlined" />
      ),
    },
    {
      field: 'agent_company_name',
      headerName: 'エージェント',
      width: 140,
      renderCell: (params) => params.value || '-',
    },
    {
      field: 'stage_0_5_result',
      headerName: '0.5次',
      width: 100,
      renderCell: (params) => {
        const result = stageResultLabels[params.value as StageResult];
        return <Chip label={result.label} size="small" color={result.color} />;
      },
    },
    {
      field: 'stage_first_result',
      headerName: '一次',
      width: 100,
      renderCell: (params) => {
        const result = stageResultLabels[params.value as StageResult];
        return <Chip label={result.label} size="small" color={result.color} />;
      },
    },
    {
      field: 'stage_final_result',
      headerName: '最終',
      width: 100,
      renderCell: (params) => {
        const result = finalResultLabels[params.value as FinalStageResult];
        return <Chip label={result.label} size="small" color={result.color} />;
      },
    },
    {
      field: 'mismatch_flag',
      headerName: 'ミスマッチ',
      width: 100,
      renderCell: (params) =>
        params.value ? (
          <Chip label="あり" size="small" color="error" />
        ) : null,
    },
    {
      field: 'actions',
      headerName: 'アクション',
      width: 140,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="詳細">
            <IconButton
              component={Link}
              href={`/dashboard/candidates/${params.row.id}`}
              size="small"
            >
              <Eye size={16} />
            </IconButton>
          </Tooltip>
          <Tooltip title="編集">
            <IconButton
              component={Link}
              href={`/dashboard/candidates/${params.row.id}/edit`}
              size="small"
            >
              <Edit size={16} />
            </IconButton>
          </Tooltip>
          <Tooltip title="削除">
            <IconButton size="small" onClick={() => handleDelete(params.row.id)}>
              <Trash2 size={16} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">候補者管理</Typography>
        <Box display="flex" gap={2}>
          <Button variant="outlined" startIcon={<Download size={18} />}>
            CSVエクスポート
          </Button>
          <Button
            component={Link}
            href="/dashboard/candidates/new"
            variant="contained"
            startIcon={<Plus size={18} />}
            disableElevation
          >
            新規登録
          </Button>
        </Box>
      </Box>

      {stats && (
        <Box display="flex" gap={2} mb={3} flexWrap="wrap">
          <Chip label={`全体: ${stats.total}名`} />
          <Chip label={`0.5次通過: ${stats.stage_0_5_passed}名`} color="primary" />
          <Chip label={`一次通過: ${stats.stage_first_passed}名`} />
          <Chip label={`内定: ${stats.stage_final_offer}名`} color="success" />
          <Chip label={`入社: ${stats.hired}名`} color="success" variant="outlined" />
          {stats.mismatch > 0 && (
            <Chip label={`ミスマッチ: ${stats.mismatch}名`} color="error" />
          )}
        </Box>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            select
            label="企業"
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            size="small"
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">すべて</MenuItem>
            {companies.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="エージェント"
            value={agentFilter}
            onChange={(e) => setAgentFilter(e.target.value)}
            size="small"
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">すべて</MenuItem>
            {agents.map((a) => (
              <MenuItem key={a.id} value={a.id}>
                {a.company_name}
              </MenuItem>
            ))}
          </TextField>
        </CardContent>
      </Card>

      <Card>
        <DataGrid
          rows={candidates}
          columns={columns}
          loading={isLoading}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 25 } },
          }}
          disableRowSelectionOnClick
          autoHeight
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell': { py: 1 },
          }}
        />
      </Card>
    </Box>
  );
}

