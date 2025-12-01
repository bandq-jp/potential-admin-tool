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
  Tooltip,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useCompanies } from '@/hooks/useCompanies';
import type { Company, CompanyCreate, CompanyUpdate } from '@/domain/entities/company';

export default function CompaniesPage() {
  const { companies, isLoading, createCompany, updateCompany, deleteCompany } = useCompanies();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState<CompanyCreate>({ name: '', note: '' });

  const handleOpenCreate = () => {
    setEditingCompany(null);
    setFormData({ name: '', note: '' });
    setDialogOpen(true);
  };

  const handleOpenEdit = (company: Company) => {
    setEditingCompany(company);
    setFormData({ name: company.name, note: company.note ?? '' });
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditingCompany(null);
  };

  const handleSubmit = async () => {
    if (editingCompany) {
      await updateCompany(editingCompany.id, formData);
    } else {
      await createCompany(formData);
    }
    handleClose();
  };

  const handleDelete = async (id: string) => {
    if (confirm('この企業を削除しますか？')) {
      await deleteCompany(id);
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
          <Tooltip title="編集">
            <IconButton size="small" onClick={() => handleOpenEdit(params.row)}>
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
        <Typography variant="h4">クライアント企業</Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={handleOpenCreate}
          disableElevation
        >
          新規登録
        </Button>
      </Box>

      <Card>
        <DataGrid
          rows={companies}
          columns={columns}
          loading={isLoading}
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
          <Button onClick={handleClose}>キャンセル</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!formData.name}
            disableElevation
          >
            {editingCompany ? '更新' : '登録'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

