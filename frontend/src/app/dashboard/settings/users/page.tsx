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
  Avatar,
  Tooltip,
  Alert,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Building2, Edit, Shield, ShieldOff } from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useSnackbar } from '@/components/providers/SnackbarProvider';
import { ApiError } from '@/lib/api';
import type { User, UserUpdate, UserRole } from '@/domain/entities/user';

const roleMeta: Record<
  UserRole,
  { label: string; color: 'default' | 'primary' | 'info'; icon: React.ReactElement }
> = {
  admin: { label: '管理者', color: 'primary', icon: <Shield size={14} /> },
  interviewer: { label: '面接官', color: 'default', icon: <ShieldOff size={14} /> },
  client: { label: 'クライアント', color: 'info', icon: <Building2 size={14} /> },
};

export default function UsersManagementPage() {
  const { users, isLoading, updateUser } = useUsers();
  const { user: currentUser, isAdmin, isLoading: userLoading } = useCurrentUser();
  const { showSuccess, showError } = useSnackbar();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserUpdate>({
    name: '',
    role: 'interviewer',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenEdit = (user: User) => {
    if (!isAdmin) {
      showError('管理者権限が必要です');
      return;
    }
    setEditingUser(user);
    setFormData({
      name: user.name,
      role: user.role,
    });
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = async () => {
    if (!editingUser) return;

    setIsSubmitting(true);
    try {
      await updateUser(editingUser.id, formData);
      showSuccess('ユーザー情報を更新しました');
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

  const handleQuickRoleChange = async (user: User, newRole: UserRole) => {
    if (!isAdmin) {
      showError('管理者権限が必要です');
      return;
    }

    if (user.role === 'client') {
      showError('クライアントユーザーのロールは変更できません');
      return;
    }

    if (user.id === currentUser?.id) {
      showError('自分自身のロールは変更できません');
      return;
    }

    try {
      await updateUser(user.id, { role: newRole });
      showSuccess(`${user.name}のロールを${roleMeta[newRole].label}に変更しました`);
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
  };

  const columns: GridColDef<User>[] = [
    {
      field: 'avatar',
      headerName: '',
      width: 60,
      sortable: false,
      renderCell: (params) => (
        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
          {params.row.name?.charAt(0) ?? '?'}
        </Avatar>
      ),
    },
    { field: 'name', headerName: '名前', flex: 1, minWidth: 150 },
    { field: 'email', headerName: 'メールアドレス', flex: 1, minWidth: 200 },
    {
      field: 'role',
      headerName: 'ロール',
      width: 140,
      renderCell: (params) => {
        const meta = roleMeta[params.value as UserRole] ?? roleMeta.interviewer;
        return (
          <Chip
            label={meta.label}
            color={meta.color}
            size="small"
            icon={meta.icon}
          />
        );
      },
    },
    {
      field: 'created_at',
      headerName: '登録日',
      width: 120,
      valueFormatter: (value: string) => new Date(value).toLocaleDateString('ja-JP'),
    },
    {
      field: 'actions',
      headerName: 'アクション',
      width: 200,
      sortable: false,
      renderCell: (params) => {
        const isCurrentUser = params.row.id === currentUser?.id;
        const isUserAdmin = params.row.role === 'admin';
        const isClientUser = params.row.role === 'client';

        return (
          <Box display="flex" alignItems="center" gap={1}>
            {!isCurrentUser && !isClientUser && (
              <Tooltip
                title={isUserAdmin ? '面接官に変更' : '管理者に変更'}
              >
                <Button
                  size="small"
                  variant={isUserAdmin ? 'outlined' : 'contained'}
                  color={isUserAdmin ? 'warning' : 'primary'}
                  onClick={() =>
                    handleQuickRoleChange(
                      params.row,
                      isUserAdmin ? 'interviewer' : 'admin'
                    )
                  }
                  disabled={!isAdmin}
                  sx={{ minWidth: 100 }}
                >
                  {isUserAdmin ? '降格' : '昇格'}
                </Button>
              </Tooltip>
            )}
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
            {isCurrentUser && (
              <Chip label="自分" size="small" variant="outlined" />
            )}
          </Box>
        );
      },
    },
  ];

  if (!userLoading && !isAdmin) {
    return (
      <Box>
        <Typography variant="h4" mb={3}>
          ユーザー管理
        </Typography>
        <Alert severity="error">
          このページにアクセスするには管理者権限が必要です
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4">ユーザー管理</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            登録ユーザーの権限を管理します
          </Typography>
        </Box>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        <strong>ロールについて:</strong>
        <ul style={{ margin: '8px 0 0', paddingLeft: 20 }}>
          <li><strong>管理者 (Admin):</strong> すべての機能へのフルアクセス（企業・エージェント・ポジション・定性要件の管理）</li>
          <li><strong>面接官 (Interviewer):</strong> 候補者・面談の閲覧・登録、自身が担当する候補者の編集</li>
          <li><strong>クライアント (Client):</strong> 企業ポータル（/client）で候補者・0.5次レポート（外向き）・評価軸の閲覧</li>
        </ul>
      </Alert>

      <Card>
        <DataGrid
          rows={users}
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
        <DialogTitle>ユーザー情報を編集</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box display="flex" alignItems="center" gap={2} mb={1}>
              <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.main' }}>
                {editingUser?.name?.charAt(0) ?? '?'}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  {editingUser?.email}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Clerk ID: {editingUser?.clerk_id}
                </Typography>
              </Box>
            </Box>
            <TextField
              label="名前"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              disabled={editingUser?.role === 'client'}
              helperText={
                editingUser?.role === 'client'
                  ? 'クライアントユーザーの名前は会社名に固定されます'
                  : ''
              }
            />
            <TextField
              select
              label="ロール"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
              fullWidth
              disabled={editingUser?.id === currentUser?.id || editingUser?.role === 'client'}
              helperText={
                editingUser?.id === currentUser?.id
                  ? '自分自身のロールは変更できません'
                  : editingUser?.role === 'client'
                    ? 'クライアントユーザーのロールは招待で管理されます'
                    : ''
              }
            >
              <MenuItem value="admin">
                <Box display="flex" alignItems="center" gap={1}>
                  <Shield size={16} />
                  管理者 (Admin)
                </Box>
              </MenuItem>
              <MenuItem value="interviewer">
                <Box display="flex" alignItems="center" gap={1}>
                  <ShieldOff size={16} />
                  面接官 (Interviewer)
                </Box>
              </MenuItem>
              <MenuItem value="client" disabled>
                <Box display="flex" alignItems="center" gap={1}>
                  <Building2 size={16} />
                  クライアント (Client)
                </Box>
              </MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting}>
            キャンセル
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting}
            disableElevation
          >
            {isSubmitting ? '処理中...' : '更新'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
