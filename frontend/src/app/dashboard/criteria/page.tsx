'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Plus, Edit, Trash2, GripVertical } from 'lucide-react';
import { useJobPositions } from '@/hooks/useJobPositions';
import { useCompanies } from '@/hooks/useCompanies';
import { useCriteria } from '@/hooks/useCriteria';
import type { CriteriaGroupCreate, CriteriaItemCreate } from '@/domain/entities/criteria';

function CriteriaContent() {
  const searchParams = useSearchParams();
  const positionIdParam = searchParams.get('position_id');

  const { companies } = useCompanies();
  const { jobPositions } = useJobPositions();

  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [selectedPositionId, setSelectedPositionId] = useState(positionIdParam ?? '');

  const { criteriaGroups, createGroup, updateGroup, deleteGroup, createItem, updateItem } =
    useCriteria(selectedPositionId);

  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [targetGroupId, setTargetGroupId] = useState<string | null>(null);

  const [groupFormData, setGroupFormData] = useState<Omit<CriteriaGroupCreate, 'job_position_id'>>({
    label: '',
    description: '',
    sort_order: 0,
  });

  const [itemFormData, setItemFormData] = useState<Omit<CriteriaItemCreate, 'criteria_group_id'>>({
    label: '',
    description: '',
    behavior_examples_text: '',
    sort_order: 0,
    is_active: true,
  });

  useEffect(() => {
    if (positionIdParam) {
      const position = jobPositions.find((p) => p.id === positionIdParam);
      if (position) {
        setSelectedCompanyId(position.company_id);
        setSelectedPositionId(positionIdParam);
      }
    }
  }, [positionIdParam, jobPositions]);

  const filteredPositions = jobPositions.filter((p) => p.company_id === selectedCompanyId);

  const handleOpenGroupCreate = () => {
    setEditingGroupId(null);
    setGroupFormData({ label: '', description: '', sort_order: criteriaGroups.length });
    setGroupDialogOpen(true);
  };

  const handleOpenGroupEdit = (groupId: string) => {
    const group = criteriaGroups.find((g) => g.id === groupId);
    if (group) {
      setEditingGroupId(groupId);
      setGroupFormData({
        label: group.label,
        description: group.description ?? '',
        sort_order: group.sort_order,
      });
      setGroupDialogOpen(true);
    }
  };

  const handleSubmitGroup = async () => {
    if (editingGroupId) {
      await updateGroup(editingGroupId, groupFormData);
    } else {
      await createGroup({
        ...groupFormData,
        job_position_id: selectedPositionId,
      });
    }
    setGroupDialogOpen(false);
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (confirm('この大項目と配下の中項目を削除しますか？')) {
      await deleteGroup(groupId);
    }
  };

  const handleOpenItemCreate = (groupId: string) => {
    setEditingItemId(null);
    setTargetGroupId(groupId);
    const group = criteriaGroups.find((g) => g.id === groupId);
    setItemFormData({
      label: '',
      description: '',
      behavior_examples_text: '',
      sort_order: group?.items.length ?? 0,
      is_active: true,
    });
    setItemDialogOpen(true);
  };

  const handleOpenItemEdit = (groupId: string, itemId: string) => {
    const group = criteriaGroups.find((g) => g.id === groupId);
    const item = group?.items.find((i) => i.id === itemId);
    if (item) {
      setEditingItemId(itemId);
      setTargetGroupId(groupId);
      setItemFormData({
        label: item.label,
        description: item.description ?? '',
        behavior_examples_text: item.behavior_examples_text ?? '',
        sort_order: item.sort_order,
        is_active: item.is_active,
      });
      setItemDialogOpen(true);
    }
  };

  const handleSubmitItem = async () => {
    if (!targetGroupId) return;

    if (editingItemId) {
      await updateItem(editingItemId, itemFormData);
    } else {
      await createItem({
        ...itemFormData,
        criteria_group_id: targetGroupId,
      });
    }
    setItemDialogOpen(false);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">定性要件マスタ</Typography>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            select
            label="企業"
            value={selectedCompanyId}
            onChange={(e) => {
              setSelectedCompanyId(e.target.value);
              setSelectedPositionId('');
            }}
            size="small"
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">選択してください</MenuItem>
            {companies.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="ポジション"
            value={selectedPositionId}
            onChange={(e) => setSelectedPositionId(e.target.value)}
            size="small"
            sx={{ minWidth: 200 }}
            disabled={!selectedCompanyId}
          >
            <MenuItem value="">選択してください</MenuItem>
            {filteredPositions.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </TextField>
          {selectedPositionId && (
            <Button
              variant="contained"
              startIcon={<Plus size={16} />}
              onClick={handleOpenGroupCreate}
              disableElevation
              size="small"
            >
              大項目追加
            </Button>
          )}
        </CardContent>
      </Card>

      {!selectedPositionId ? (
        <Alert severity="info">企業とポジションを選択してください</Alert>
      ) : criteriaGroups.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Typography color="text.secondary" gutterBottom>
              定性要件が設定されていません
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Plus size={16} />}
              onClick={handleOpenGroupCreate}
              sx={{ mt: 2 }}
            >
              最初の大項目を追加
            </Button>
          </CardContent>
        </Card>
      ) : (
        criteriaGroups.map((group) => (
          <Card key={group.id} sx={{ mb: 2 }}>
            <CardHeader
              avatar={<GripVertical size={16} color="#94a3b8" />}
              title={
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="h6">{group.label}</Typography>
                  <Chip label={`${group.items.length}項目`} size="small" />
                </Box>
              }
              subheader={group.description}
              action={
                <Box>
                  <IconButton size="small" onClick={() => handleOpenGroupEdit(group.id)}>
                    <Edit size={16} />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDeleteGroup(group.id)}>
                    <Trash2 size={16} />
                  </IconButton>
                </Box>
              }
            />
            <Divider />
            <CardContent>
              {group.items.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                    py: 1.5,
                    borderBottom: '1px solid #e2e8f0',
                    '&:last-child': { borderBottom: 'none' },
                  }}
                >
                  <GripVertical size={14} color="#94a3b8" style={{ marginTop: 4 }} />
                  <Box flex={1}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {item.label}
                      </Typography>
                      {!item.is_active && (
                        <Chip label="無効" size="small" color="default" />
                      )}
                    </Box>
                    {item.description && (
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                    )}
                    {item.behavior_examples_text && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block', mt: 0.5, whiteSpace: 'pre-wrap' }}
                      >
                        行動例: {item.behavior_examples_text}
                      </Typography>
                    )}
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenItemEdit(group.id, item.id)}
                  >
                    <Edit size={14} />
                  </IconButton>
                </Box>
              ))}
              <Button
                startIcon={<Plus size={14} />}
                size="small"
                onClick={() => handleOpenItemCreate(group.id)}
                sx={{ mt: 1 }}
              >
                中項目追加
              </Button>
            </CardContent>
          </Card>
        ))
      )}

      <Dialog open={groupDialogOpen} onClose={() => setGroupDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingGroupId ? '大項目を編集' : '大項目を追加'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="大項目名"
              value={groupFormData.label}
              onChange={(e) => setGroupFormData({ ...groupFormData, label: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="説明"
              value={groupFormData.description}
              onChange={(e) => setGroupFormData({ ...groupFormData, description: e.target.value })}
              fullWidth
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGroupDialogOpen(false)}>キャンセル</Button>
          <Button
            variant="contained"
            onClick={handleSubmitGroup}
            disabled={!groupFormData.label}
            disableElevation
          >
            {editingGroupId ? '更新' : '追加'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={itemDialogOpen} onClose={() => setItemDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingItemId ? '中項目を編集' : '中項目を追加'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="中項目名"
              value={itemFormData.label}
              onChange={(e) => setItemFormData({ ...itemFormData, label: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="説明・趣旨"
              value={itemFormData.description}
              onChange={(e) => setItemFormData({ ...itemFormData, description: e.target.value })}
              fullWidth
              multiline
              rows={2}
            />
            <TextField
              label="行動例（Good/Bad）"
              value={itemFormData.behavior_examples_text}
              onChange={(e) =>
                setItemFormData({ ...itemFormData, behavior_examples_text: e.target.value })
              }
              fullWidth
              multiline
              rows={4}
              placeholder="Good: ○○のような行動&#10;Bad: △△のような行動"
            />
            <TextField
              select
              label="ステータス"
              value={itemFormData.is_active ? 'active' : 'inactive'}
              onChange={(e) =>
                setItemFormData({ ...itemFormData, is_active: e.target.value === 'active' })
              }
              fullWidth
            >
              <MenuItem value="active">有効</MenuItem>
              <MenuItem value="inactive">無効</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setItemDialogOpen(false)}>キャンセル</Button>
          <Button
            variant="contained"
            onClick={handleSubmitItem}
            disabled={!itemFormData.label}
            disableElevation
          >
            {editingItemId ? '更新' : '追加'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default function CriteriaPage() {
  return (
    <Suspense
      fallback={
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
          <CircularProgress />
        </Box>
      }
    >
      <CriteriaContent />
    </Suspense>
  );
}
