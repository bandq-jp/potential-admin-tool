'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useClerk, useAuth as useClerkAuth } from '@clerk/nextjs';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
  Button,
} from '@mui/material';
import { LogOut, ArrowRight } from 'lucide-react';
import { useCurrentUser } from '@/hooks/useCurrentUser';

function isAllowedReturnTo(path: string, isClient: boolean) {
  if (!path.startsWith('/')) return false;
  if (path.startsWith('//')) return false;
  if (isClient) return path.startsWith('/client');
  return path.startsWith('/dashboard');
}

function AuthRedirectInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoaded, isSignedIn } = useClerkAuth();
  const { signOut } = useClerk();
  const { user, isLoading, isClient, error } = useCurrentUser();

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.replace('/sign-in');
      return;
    }

    if (isLoading || !user) return;

    const returnTo = searchParams.get('returnTo');
    const target = isClient ? '/client' : '/dashboard';
    const resolvedTarget =
      returnTo && isAllowedReturnTo(returnTo, isClient) ? returnTo : target;

    router.replace(resolvedTarget);
  }, [isLoaded, isSignedIn, isLoading, user, isClient, router, searchParams]);

  if (error) {
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
        <Card sx={{ maxWidth: 520, width: '100%' }}>
          <CardContent sx={{ py: 5, px: 4 }}>
            <Typography variant="h5" fontWeight={800} gutterBottom>
              アカウントの権限を確認できませんでした
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              招待制のため、企業ユーザーは招待メールから登録したアカウントのみ利用できます。
              心当たりがない場合は、招待元にご連絡ください。
            </Typography>

            <Box display="flex" gap={2} flexWrap="wrap">
              <Button
                variant="contained"
                startIcon={<LogOut size={18} />}
                onClick={() => signOut({ redirectUrl: '/sign-in' })}
                disableElevation
              >
                サインアウト
              </Button>
              <Button
                variant="outlined"
                endIcon={<ArrowRight size={18} />}
                onClick={() => router.replace('/sign-in')}
              >
                ログイン画面へ
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

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
      <Box sx={{ textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          画面を準備しています...
        </Typography>
      </Box>
    </Box>
  );
}

export default function AuthRedirectPage() {
  return (
    <Suspense
      fallback={
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
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              画面を準備しています...
            </Typography>
          </Box>
        </Box>
      }
    >
      <AuthRedirectInner />
    </Suspense>
  );
}
