'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Eye } from 'lucide-react';
import { useClientCandidates } from '@/hooks/useClientCandidates';
import { useClientJobPositions } from '@/hooks/useClientJobPositions';
import type { ClientCandidateWithRelations } from '@/domain/entities/clientCandidate';
import type { StageResult, FinalStageResult } from '@/domain/entities/candidate';

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

export default function ClientCandidatesPage() {
  const [positionFilter, setPositionFilter] = useState<string>('');
  const { candidates, isLoading } = useClientCandidates({
    job_position_id: positionFilter || undefined,
  });
  const { jobPositions } = useClientJobPositions();

  const columns: GridColDef<ClientCandidateWithRelations>[] = [
    {
      field: 'name',
      headerName: '候補者名',
      flex: 1,
      minWidth: 160,
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
      field: 'job_position_name',
      headerName: 'ポジション',
      width: 180,
      renderCell: (params) => <Chip label={params.value} size="small" variant="outlined" />,
    },
    {
      field: 'stage_0_5_result',
      headerName: '0.5次',
      width: 110,
      renderCell: (params) => {
        const result = stageResultLabels[params.value as StageResult];
        return <Chip label={result.label} size="small" color={result.color} />;
      },
    },
    {
      field: 'stage_first_result',
      headerName: '一次',
      width: 110,
      renderCell: (params) => {
        const result = stageResultLabels[params.value as StageResult];
        return <Chip label={result.label} size="small" color={result.color} />;
      },
    },
    {
      field: 'stage_final_result',
      headerName: '最終',
      width: 110,
      renderCell: (params) => {
        const result = finalResultLabels[params.value as FinalStageResult];
        return <Chip label={result.label} size="small" color={result.color} />;
      },
    },
    {
      field: 'stage_0_5_date',
      headerName: '0.5実施日',
      width: 140,
      renderCell: (params) => params.value || '-',
    },
    {
      field: 'actions',
      headerName: '',
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <Tooltip title="詳細">
          <IconButton component={Link} href={`/client/candidates/${params.row.id}`} size="small">
            <Eye size={16} />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        候補者一覧
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            select
            label="ポジション"
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
            size="small"
            sx={{ minWidth: 240 }}
          >
            <MenuItem value="">すべて</MenuItem>
            {jobPositions.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </TextField>
        </CardContent>
      </Card>

      <DataGrid
        rows={candidates}
        columns={columns}
        loading={isLoading}
        getRowId={(row) => row.id}
        autoHeight
        pageSizeOptions={[10, 25, 50]}
        initialState={{ pagination: { paginationModel: { pageSize: 25, page: 0 } } }}
        sx={{
          bgcolor: 'background.paper',
          '& .MuiDataGrid-columnHeaders': { bgcolor: '#f8fafc' },
        }}
      />
    </Box>
  );
}

