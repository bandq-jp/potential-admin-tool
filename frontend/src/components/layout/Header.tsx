'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Badge,
  InputBase,
  Tooltip,
  alpha,
} from '@mui/material';
import { Search, Bell, HelpCircle, Menu as MenuIcon, ChevronRight, PanelLeftClose, PanelLeft } from 'lucide-react';
import { useDashboardStats } from '@/hooks/useCandidates';
import { colors } from '@/config/theme';

interface HeaderProps {
  onMenuClick?: () => void;
  onSidebarToggle?: () => void;
  sidebarOpen?: boolean;
  sidebarWidth?: number;
}

const pathTitles: Record<string, string> = {
  '/dashboard': 'ダッシュボード',
  '/dashboard/candidates': '候補者管理',
  '/dashboard/interviews': '0.5次面談ログ',
  '/dashboard/companies': 'クライアント企業',
  '/dashboard/positions': '求人ポジション',
  '/dashboard/criteria': '定性要件マスタ',
  '/dashboard/agents': 'エージェント',
  '/dashboard/settings': '設定',
  '/dashboard/settings/users': 'ユーザー管理',
};

export function Header({ onMenuClick, onSidebarToggle, sidebarOpen = true, sidebarWidth = 260 }: HeaderProps) {
  const pathname = usePathname();
  const [searchValue, setSearchValue] = useState('');
  const { stats } = useDashboardStats();

  const pendingCount = stats?.pending_interviews ?? 0;

  // パス名から最も適切なタイトルを取得
  const currentTitle = (() => {
    if (pathTitles[pathname]) return pathTitles[pathname];
    // 部分一致でタイトルを検索
    const matchedPath = Object.keys(pathTitles)
      .filter(path => pathname.startsWith(path))
      .sort((a, b) => b.length - a.length)[0];
    return matchedPath ? pathTitles[matchedPath] : 'ページ';
  })();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { xs: '100%', md: `calc(100% - ${sidebarWidth}px)` },
        ml: { xs: 0, md: `${sidebarWidth}px` },
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'text.primary',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1), margin-left 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <Toolbar sx={{ gap: 1 }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{ display: { md: 'none' } }}
        >
          <MenuIcon size={20} />
        </IconButton>

        <IconButton
          color="inherit"
          aria-label="toggle sidebar"
          edge="start"
          onClick={onSidebarToggle}
          sx={{ 
            display: { xs: 'none', md: 'flex' },
            color: 'text.secondary',
            '&:hover': {
              color: 'text.primary',
            },
          }}
        >
          {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeft size={20} />}
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'text.secondary',
              display: { xs: 'none', sm: 'block' },
            }}
          >
            ホーム
          </Typography>
          <ChevronRight size={16} style={{ color: colors.neutral[400] }} />
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: 'text.primary',
              fontWeight: 600,
            }}
          >
            {currentTitle}
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Box
          sx={{
            position: 'relative',
            borderRadius: 2,
            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.04),
            border: '1px solid',
            borderColor: 'divider',
            transition: 'all 0.2s ease-in-out',
            '&:hover': { 
              backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
              borderColor: 'primary.light',
            },
            '&:focus-within': {
              borderColor: 'primary.main',
              backgroundColor: 'background.paper',
              boxShadow: (theme) => `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
            },
            mr: 1,
            width: '100%',
            maxWidth: 320,
            display: { xs: 'none', md: 'block' },
          }}
        >
          <Box
            sx={{
              px: 1.5,
              height: '100%',
              position: 'absolute',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'text.secondary',
            }}
          >
            <Search size={18} />
          </Box>
          <InputBase
            placeholder="候補者、企業を検索..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            sx={{ 
              color: 'inherit', 
              width: '100%', 
              py: 1,
              px: 1.5,
              pl: 5,
              fontSize: '0.875rem',
              '& input::placeholder': {
                color: 'text.secondary',
                opacity: 1,
              },
            }}
          />
        </Box>

        <Tooltip title={pendingCount > 0 ? `未入力面談ログ ${pendingCount}件` : '通知なし'}>
          <IconButton
            component={Link}
            href="/dashboard/interviews"
            sx={{
              color: 'text.secondary',
              '&:hover': {
                color: 'text.primary',
              },
            }}
          >
            <Badge 
              badgeContent={pendingCount} 
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: '0.625rem',
                  minWidth: 18,
                  height: 18,
                },
              }}
            >
              <Bell size={20} />
            </Badge>
          </IconButton>
        </Tooltip>
        <Tooltip title="ヘルプ">
          <IconButton 
            sx={{
              color: 'text.secondary',
              '&:hover': {
                color: 'text.primary',
              },
            }}
          >
            <HelpCircle size={20} />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
