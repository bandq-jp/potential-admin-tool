'use client';

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
} from '@mui/material';
import { useAuth } from '@/hooks/useAuth';

export default function SettingsPage() {
  const { user, clerkUser, isAdmin } = useAuth();

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        設定
      </Typography>

      <Card sx={{ maxWidth: 600 }}>
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
    </Box>
  );
}

