'use client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

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
  Tooltip,
  Chip,
  Alert,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Plus, Edit, Trash2, Shield } from 'lucide-react';
import { useCompanies } from '@/hooks/useCompanies';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useSnackbar } from '@/components/providers/SnackbarProvider';
import { ApiError } from '@/lib/api';
import type { Company, CompanyCreate } from '@/domain/entities/company';

export default function CompaniesPage() {
  const { companies, isLoading, createCompany, updateCompany, deleteCompany } = useCompanies();
  const { isAdmin, isLoading: userLoading } = useCurrentUser();
  const { showSuccess, showError } = useSnackbar();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState<CompanyCreate>({ name: '', note: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenCreate = () => {
    if (!isAdmin) {
      showError('管理者権限が必要です');
      return;
    }
    setEditingCompany(null);
    setFormData({ name: '', note: '' });
    setDialogOpen(true);
  };

  const handleOpenEdit = (company: Company) => {
    if (!isAdmin) {
      showError('管理者権限が必要です');
      return;
    }
    setEditingCompany(company);
    setFormData({ name: company.name, note: company.note ?? '' });
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditingCompany(null);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (editingCompany) {
        await updateCompany(editingCompany.id, formData);
        showSuccess('企業を更新しました');
      } else {
        await createCompany(formData);
        showSuccess('企業を登録しました');
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

  const handleDelete = async (id: string) => {
    if (!isAdmin) {
      showError('管理者権限が必要です');
      return;
    }
    if (confirm('この企業を削除しますか？')) {
      try {
        await deleteCompany(id);
        showSuccess('企業を削除しました');
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
      }
    }
  };

  const columns: GridColDef<Company>[] = [
    { field: 'name', headerName: '企業名', flex: 1, minWidth: 200 },
    { field: 'note', headerName: '備考', flex: 2, minWidth: 300 },
    {
      field: 'created_at',
      headerName: '登録日',
      width: 120,
      valueFormatter: (value: string) => new Date(value).toLocaleDateString('ja-JP'),
    },
    {
      field: 'actions',
      headerName: 'アクション',
      width: 120,
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
          <Tooltip title={isAdmin ? '削除' : '管理者権限が必要'}>
            <span>
              <IconButton
                size="small"
                onClick={() => handleDelete(params.row.id)}
                disabled={!isAdmin}
              >
                <Trash2 size={16} />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h4">クライアント企業</Typography>
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
          企業の追加・編集・削除には管理者権限が必要です
        </Alert>
      )}

      <Card>
        <DataGrid
          rows={companies}
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
          {editingCompany ? '企業を編集' : '新規企業登録'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="企業名"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="備考（事業内容・採用方針等）"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              fullWidth
              multiline
              rows={4}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting}>キャンセル</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!formData.name || isSubmitting}
            disableElevation
          >
            {isSubmitting ? '処理中...' : (editingCompany ? '更新' : '登録')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
