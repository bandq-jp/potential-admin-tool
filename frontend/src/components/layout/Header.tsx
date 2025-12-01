'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Badge,
  InputBase,
} from '@mui/material';
import { Search, Bell, HelpCircle, Menu as MenuIcon, ChevronRight } from 'lucide-react';
import { SIDEBAR_WIDTH } from './Sidebar';

interface HeaderProps {
  onMenuClick?: () => void;
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
};

export function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const [searchValue, setSearchValue] = useState('');

  const currentTitle = pathTitles[pathname] ?? 'ページ';

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${SIDEBAR_WIDTH}px)` },
        ml: { md: `${SIDEBAR_WIDTH}px` },
        bgcolor: 'background.paper',
        borderBottom: '1px solid #e2e8f0',
        color: 'text.primary',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
          <Typography variant="body2" sx={{ mr: 1 }}>
            ホーム
          </Typography>
          <ChevronRight size={16} />
          <Typography variant="subtitle1" sx={{ ml: 1, color: 'text.primary' }}>
            {currentTitle}
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Box
          sx={{
            position: 'relative',
            borderRadius: 2,
            backgroundColor: '#f1f5f9',
            '&:hover': { backgroundColor: '#e2e8f0' },
            mr: 2,
            ml: 0,
            width: '100%',
            maxWidth: 400,
            display: { xs: 'none', sm: 'block' },
          }}
        >
          <Box
            sx={{
              px: 2,
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
            sx={{ color: 'inherit', width: '100%', p: 1, pl: 6 }}
          />
        </Box>

        <IconButton size="large" color="inherit">
          <Badge badgeContent={4} color="error">
            <Bell size={20} />
          </Badge>
        </IconButton>
        <IconButton size="large" color="inherit">
          <HelpCircle size={20} />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

