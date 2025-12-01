'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Tooltip,
  Alert,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Plus, Edit, Settings, Shield } from 'lucide-react';
import Link from 'next/link';
import { useJobPositions } from '@/hooks/useJobPositions';
import { useCompanies } from '@/hooks/useCompanies';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useSnackbar } from '@/components/providers/SnackbarProvider';
import { ApiError } from '@/lib/api';
import type { JobPosition, JobPositionCreate } from '@/domain/entities/jobPosition';

export default function PositionsPage() {
  const { jobPositions, isLoading, createJobPosition, updateJobPosition } = useJobPositions();
  const { companies } = useCompanies();
  const { isAdmin, isLoading: userLoading } = useCurrentUser();
  const { showSuccess, showError } = useSnackbar();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState<JobPosition | null>(null);
  const [formData, setFormData] = useState<JobPositionCreate>({
    company_id: '',
    name: '',
    description: '',
    is_active: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenCreate = () => {
    if (!isAdmin) {
      showError('管理者権限が必要です');
      return;
    }
    setEditingPosition(null);
    setFormData({ company_id: '', name: '', description: '', is_active: true });
    setDialogOpen(true);
  };

  const handleOpenEdit = (position: JobPosition) => {
    if (!isAdmin) {
      showError('管理者権限が必要です');
      return;
    }
    setEditingPosition(position);
    setFormData({
      company_id: position.company_id,
      name: position.name,
      description: position.description ?? '',
      is_active: position.is_active,
    });
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditingPosition(null);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (editingPosition) {
        await updateJobPosition(editingPosition.id, {
          name: formData.name,
          description: formData.description,
          is_active: formData.is_active,
        });
        showSuccess('ポジションを更新しました');
      } else {
        await createJobPosition(formData);
        showSuccess('ポジションを登録しました');
      }
      handleClose();
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 403) {
          showError('管理者権限が必要です');
        } else {
          showError(error.message);
        }
      } else {
        showError('エラーが発生しました');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCompanyName = (companyId: string) => {
    const company = companies.find((c) => c.id === companyId);
    return company?.name ?? '-';
  };

  const columns: GridColDef<JobPosition>[] = [
    {
      field: 'company_id',
      headerName: '企業',
      width: 200,
      valueGetter: (value: string) => getCompanyName(value),
    },
    { field: 'name', headerName: 'ポジション名', flex: 1, minWidth: 200 },
    { field: 'description', headerName: '説明', flex: 1, minWidth: 200 },
    {
      field: 'is_active',
      headerName: 'ステータス',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value ? '有効' : '無効'}
          color={params.value ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'アクション',
      width: 140,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title={isAdmin ? '編集' : '管理者権限が必要'}>
            <span>
              <IconButton
                size="small"
                onClick={() => handleOpenEdit(params.row)}
                disabled={!isAdmin}
              >
                <Edit size={16} />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="定性要件設定">
            <IconButton
              component={Link}
              href={`/dashboard/criteria?position_id=${params.row.id}`}
              size="small"
            >
              <Settings size={16} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h4">求人ポジション</Typography>
          {!userLoading && !isAdmin && (
            <Chip
              icon={<Shield size={14} />}
              label="閲覧のみ"
              size="small"
              color="default"
            />
          )}
        </Box>
        <Tooltip title={isAdmin ? '' : '管理者権限が必要です'}>
          <span>
            <Button
              variant="contained"
              startIcon={<Plus size={18} />}
              onClick={handleOpenCreate}
              disableElevation
              disabled={!isAdmin}
            >
              新規登録
            </Button>
          </span>
        </Tooltip>
      </Box>

      {!userLoading && !isAdmin && (
        <Alert severity="info" sx={{ mb: 2 }}>
          ポジションの追加・編集には管理者権限が必要です
        </Alert>
      )}

      <Card>
        <DataGrid
          rows={jobPositions}
          columns={columns}
          loading={isLoading || userLoading}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 25 } },
          }}
          disableRowSelectionOnClick
          autoHeight
          sx={{ border: 'none' }}
        />
      </Card>

      <Dialog open={dialogOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingPosition ? 'ポジションを編集' : '新規ポジション登録'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {!editingPosition && (
              <TextField
                select
                label="企業"
                value={formData.company_id}
                onChange={(e) => setFormData({ ...formData, company_id: e.target.value })}
                fullWidth
                required
              >
                {companies.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
            <TextField
              label="ポジション名"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
              placeholder="例: CA（新卒）、両面コンサル"
            />
            <TextField
              label="説明"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />
            <TextField
              select
              label="ステータス"
              value={formData.is_active ? 'active' : 'inactive'}
              onChange={(e) =>
                setFormData({ ...formData, is_active: e.target.value === 'active' })
              }
              fullWidth
            >
              <MenuItem value="active">有効</MenuItem>
              <MenuItem value="inactive">無効</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting}>キャンセル</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!formData.name || (!editingPosition && !formData.company_id) || isSubmitting}
            disableElevation
          >
            {isSubmitting ? '処理中...' : (editingPosition ? '更新' : '登録')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
