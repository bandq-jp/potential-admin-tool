'use client';

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
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Plus, Edit, Trash2, TrendingUp } from 'lucide-react';
import { useAgents, useAgentStats } from '@/hooks/useAgents';
import type { Agent, AgentCreate } from '@/domain/entities/agent';

export default function AgentsPage() {
  const { agents, isLoading, createAgent, updateAgent, deleteAgent } = useAgents();
  const { stats } = useAgentStats();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [formData, setFormData] = useState<AgentCreate>({
    company_name: '',
    contact_name: '',
    contact_email: '',
    note: '',
  });

  const handleOpenCreate = () => {
    setEditingAgent(null);
    setFormData({ company_name: '', contact_name: '', contact_email: '', note: '' });
    setDialogOpen(true);
  };

  const handleOpenEdit = (agent: Agent) => {
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
    if (editingAgent) {
      await updateAgent(editingAgent.id, formData);
    } else {
      await createAgent(formData);
    }
    handleClose();
  };

  const handleDelete = async (id: string) => {
    if (confirm('このエージェントを削除しますか？')) {
      await deleteAgent(id);
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

  const topAgents = [...stats].sort((a, b) => b.stage_0_5_pass_rate - a.stage_0_5_pass_rate).slice(0, 3);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">エージェント</Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={handleOpenCreate}
          disableElevation
        >
          新規登録
        </Button>
      </Box>

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
          <Button onClick={handleClose}>キャンセル</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!formData.company_name || !formData.contact_name}
            disableElevation
          >
            {editingAgent ? '更新' : '登録'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

