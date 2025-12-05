'use client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import Link from 'next/link';
import {
  Box,
  Typography,
  Card,
  Chip,
  Button,
  Avatar,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Eye, Edit } from 'lucide-react';
import { useCandidates } from '@/hooks/useCandidates';
import type { CandidateWithRelations } from '@/domain/entities/candidate';

export default function InterviewsPage() {
  const { candidates, isLoading } = useCandidates();

  const candidatesWithInterviews = candidates.filter(
    (c) => c.stage_0_5_date || c.stage_0_5_result !== 'not_done'
  );

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
    { field: 'company_name', headerName: '企業', width: 160 },
    {
      field: 'job_position_name',
      headerName: 'ポジション',
      width: 140,
      renderCell: (params) => (
        <Chip label={params.value} size="small" variant="outlined" />
      ),
    },
    {
      field: 'stage_0_5_date',
      headerName: '面談日',
      width: 120,
    },
    {
      field: 'stage_0_5_result',
      headerName: '結果',
      width: 100,
      renderCell: (params) => {
        const labels: Record<string, { label: string; color: 'default' | 'success' | 'error' }> = {
          not_done: { label: '未入力', color: 'default' },
          passed: { label: '通過', color: 'success' },
          rejected: { label: '見送り', color: 'error' },
        };
        const result = labels[params.value] || labels.not_done;
        return <Chip label={result.label} size="small" color={result.color} />;
      },
    },
    { field: 'agent_company_name', headerName: 'エージェント', width: 140 },
    { field: 'owner_user_name', headerName: '担当者', width: 120 },
    {
      field: 'actions',
      headerName: 'アクション',
      width: 140,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Button
            component={Link}
            href={`/dashboard/candidates/${params.row.id}`}
            size="small"
            startIcon={<Eye size={14} />}
          >
            詳細
          </Button>
          <Button
            component={Link}
            href={`/dashboard/candidates/${params.row.id}/interview`}
            size="small"
            startIcon={<Edit size={14} />}
          >
            評価
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">0.5次面談ログ</Typography>
      </Box>

      <Box display="flex" gap={2} mb={3}>
        <Chip
          label={`全体: ${candidatesWithInterviews.length}件`}
        />
        <Chip
          label={`未入力: ${candidatesWithInterviews.filter((c) => c.stage_0_5_result === 'not_done').length}件`}
          color="warning"
        />
        <Chip
          label={`通過: ${candidatesWithInterviews.filter((c) => c.stage_0_5_result === 'passed').length}件`}
          color="success"
        />
        <Chip
          label={`見送り: ${candidatesWithInterviews.filter((c) => c.stage_0_5_result === 'rejected').length}件`}
          color="error"
        />
      </Box>

      <Card>
        <DataGrid
          rows={candidatesWithInterviews}
          columns={columns}
          loading={isLoading}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 25 } },
            sorting: { sortModel: [{ field: 'stage_0_5_date', sort: 'desc' }] },
          }}
          disableRowSelectionOnClick
          autoHeight
          sx={{ border: 'none' }}
        />
      </Card>
    </Box>
  );
}

