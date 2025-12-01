'use client';

import Link from 'next/link';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Chip,
  Avatar,
  Button,
} from '@mui/material';
import { UserCog, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function SettingsPage() {
  const { user, clerkUser, isAdmin } = useAuth();

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        設定
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 600 }}>
        <Card>
          <CardHeader
            avatar={
              <Avatar src={clerkUser?.imageUrl} sx={{ width: 64, height: 64 }}>
                {user?.name?.charAt(0)}
              </Avatar>
            }
            title={
              <Typography variant="h6" fontWeight={700}>
                {user?.name ?? clerkUser?.fullName ?? 'ユーザー'}
              </Typography>
            }
            subheader={
              <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                <Chip
                  label={isAdmin ? 'Admin' : 'Interviewer'}
                  size="small"
                  color={isAdmin ? 'primary' : 'default'}
                />
              </Box>
            }
          />
          <Divider />
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, width: 140 }}>メールアドレス</TableCell>
                  <TableCell>{user?.email ?? clerkUser?.primaryEmailAddress?.emailAddress}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>ロール</TableCell>
                  <TableCell>
                    {isAdmin ? 'システム管理者 (Admin)' : '面接官 (Interviewer)'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Clerk ID</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                      {user?.clerk_id ?? clerkUser?.id}
                    </Typography>
                  </TableCell>
                </TableRow>
                {user?.created_at && (
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>登録日</TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString('ja-JP')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {isAdmin && (
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: 'primary.50',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <UserCog size={24} color="#1976d2" />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      ユーザー管理
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      登録ユーザーの権限を変更
                    </Typography>
                  </Box>
                </Box>
                <Button
                  component={Link}
                  href="/dashboard/settings/users"
                  endIcon={<ChevronRight size={18} />}
                  variant="outlined"
                >
                  管理画面へ
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
}
