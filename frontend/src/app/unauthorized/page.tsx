'use client';

import { useClerk } from '@clerk/nextjs';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import { ShieldX, LogOut, Mail } from 'lucide-react';

export default function UnauthorizedPage() {
  const { signOut } = useClerk();

  const handleSignOut = () => {
    signOut({ redirectUrl: '/sign-in' });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f8fafc',
        p: 3,
      }}
    >
      <Card sx={{ maxWidth: 480, textAlign: 'center' }}>
        <CardContent sx={{ py: 6, px: 4 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: '#fee2e2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
            }}
          >
            <ShieldX size={40} color="#dc2626" />
          </Box>

          <Typography variant="h4" fontWeight="bold" gutterBottom>
            アクセス権限がありません
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            このアプリケーションは <strong>@bandq.jp</strong> ドメインの
            メールアドレスでログインしたユーザーのみ利用できます。
          </Typography>

          <Box
            sx={{
              bgcolor: '#f1f5f9',
              borderRadius: 2,
              p: 2,
              mb: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Mail size={20} color="#64748b" />
            <Typography variant="body2" color="text.secondary">
              @bandq.jp のメールアドレスでサインインしてください
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="large"
            startIcon={<LogOut size={18} />}
            onClick={handleSignOut}
            disableElevation
            fullWidth
          >
            サインアウトして別のアカウントでログイン
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

