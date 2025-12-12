'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, AppBar, Toolbar, Typography, Button, Avatar, IconButton } from '@mui/material';
import { LogOut } from 'lucide-react';
import { useClerk } from '@clerk/nextjs';
import { useClientMe } from '@/hooks/useClientMe';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const { signOut } = useClerk();
  const { clientMe } = useClientMe();
  const router = useRouter();
  const { user, isLoading, isClient } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && user && !isClient) {
      router.replace('/dashboard');
    }
  }, [isLoading, user, isClient, router]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'background.paper', color: 'text.primary', borderBottom: '1px solid #e2e8f0' }}>
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h6" fontWeight={800} color="primary">
            RecruitLog
          </Typography>
          {clientMe?.company_name && (
            <Typography variant="body2" color="text.secondary">
              {clientMe.company_name}
            </Typography>
          )}

          <Box sx={{ flexGrow: 1 }} />

          <Button component={Link} href="/client/candidates" color="inherit">
            候補者
          </Button>
          <Button component={Link} href="/client/criteria" color="inherit">
            評価軸
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light' }}>
              {(clientMe?.user_name || 'U').charAt(0)}
            </Avatar>
            <Typography variant="body2" fontWeight={600}>
              {clientMe?.user_name ?? 'ユーザー'}
            </Typography>
            <IconButton size="small" onClick={() => signOut()}>
              <LogOut size={18} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ p: 3 }}>
        {children}
      </Box>
    </Box>
  );
}
