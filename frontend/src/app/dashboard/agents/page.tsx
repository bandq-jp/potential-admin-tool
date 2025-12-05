'use client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  Grid,
  Chip,
  Alert,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Plus, Edit, Trash2, TrendingUp, Shield } from 'lucide-react';
import { useAgents, useAgentStats } from '@/hooks/useAgents';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useSnackbar } from '@/components/providers/SnackbarProvider';
import { ApiError } from '@/lib/api';
import type { Agent, AgentCreate } from '@/domain/entities/agent';

export default function AgentsPage() {
  const { agents, isLoading, createAgent, updateAgent, deleteAgent } = useAgents();
  const { stats } = useAgentStats();
  const { isAdmin, isLoading: userLoading } = useCurrentUser();
  const { showSuccess, showError } = useSnackbar();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [formData, setFormData] = useState<AgentCreate>({
    company_name: '',
    contact_name: '',
    contact_email: '',
    note: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenCreate = () => {
    if (!isAdmin) {
      showError('管理者権限が必要です');
      return;
    }
    setEditingAgent(null);
    setFormData({ company_name: '', contact_name: '', contact_email: '', note: '' });
    setDialogOpen(true);
  };

  const handleOpenEdit = (agent: Agent) => {
    if (!isAdmin) {
      showError('管理者権限が必要です');
      return;
    }
    setEditingAgent(agent);
    setFormData({
      company_name: agent.company_name,
      contact_name: agent.contact_name,
      contact_email: agent.contact_email ?? '',
      note: agent.note ?? '',
    });
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditingAgent(null);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (editingAgent) {
        await updateAgent(editingAgent.id, formData);
        showSuccess('エージェントを更新しました');
      } else {
        await createAgent(formData);
        showSuccess('エージェントを登録しました');
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
    if (confirm('このエージェントを削除しますか？')) {
      try {
        await deleteAgent(id);
        showSuccess('エージェントを削除しました');
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

  const getAgentStats = (agentId: string) => {
    return stats.find((s) => s.id === agentId);
  };

  const columns: GridColDef<Agent>[] = [
    { field: 'company_name', headerName: 'エージェント会社', flex: 1, minWidth: 180 },
    { field: 'contact_name', headerName: '担当者名', width: 140 },
    { field: 'contact_email', headerName: 'メール', width: 200 },
    {
      field: 'stats_referral',
      headerName: '紹介数',
      width: 90,
      valueGetter: (_, row) => getAgentStats(row.id)?.referral_count ?? 0,
    },
    {
      field: 'stats_pass_rate',
      headerName: '0.5通過率',
      width: 100,
      valueGetter: (_, row) => `${getAgentStats(row.id)?.stage_0_5_pass_rate ?? 0}%`,
    },
    {
      field: 'stats_offer_rate',
      headerName: '内定率',
      width: 90,
      valueGetter: (_, row) => `${getAgentStats(row.id)?.final_offer_rate ?? 0}%`,
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

  const topAgents = [...stats].sort((a, b) => b.stage_0_5_pass_rate - a.stage_0_5_pass_rate).slice(0, 3);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h4">エージェント</Typography>
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
          エージェントの追加・編集・削除には管理者権限が必要です
        </Alert>
      )}

      {topAgents.length > 0 && (
        <Grid container spacing={2} mb={3}>
          {topAgents.map((agent, index) => (
            <Grid size={{ xs: 12, sm: 4 }} key={agent.id}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <TrendingUp size={16} color={index === 0 ? '#22c55e' : '#64748b'} />
                    <Typography variant="caption" color="text.secondary">
                      通過率 #{index + 1}
                    </Typography>
                  </Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {agent.company_name}
                  </Typography>
                  <Box display="flex" gap={2} mt={1}>
                    <Typography variant="body2">
                      紹介: <strong>{agent.referral_count}名</strong>
                    </Typography>
                    <Typography variant="body2" color="success.main">
                      通過率: <strong>{agent.stage_0_5_pass_rate}%</strong>
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Card>
        <DataGrid
          rows={agents}
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
          {editingAgent ? 'エージェントを編集' : '新規エージェント登録'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="エージェント会社名"
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="担当者名"
              value={formData.contact_name}
              onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="メールアドレス"
              type="email"
              value={formData.contact_email}
              onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
              fullWidth
            />
            <TextField
              label="備考"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              fullWidth
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting}>キャンセル</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!formData.company_name || !formData.contact_name || isSubmitting}
            disableElevation
          >
            {isSubmitting ? '処理中...' : (editingAgent ? '更新' : '登録')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
