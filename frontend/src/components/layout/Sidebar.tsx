'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  Avatar,
  Card,
  CardContent,
  IconButton,
  Chip,
  Tooltip,
  alpha,
} from '@mui/material';
import {
  LayoutDashboard,
  Users,
  FileText,
  Building2,
  Briefcase,
  Settings,
  Database,
  LogOut,
  ChevronLeft,
  ChevronRight,
  UserCog,
} from 'lucide-react';
import { useClerk, useUser } from '@clerk/nextjs';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useDashboardStats } from '@/hooks/useCandidates';

export const SIDEBAR_WIDTH = 260;
export const SIDEBAR_COLLAPSED_WIDTH = 72;

const mainMenuItems = [
  { label: 'ダッシュボード', href: '/dashboard', icon: LayoutDashboard },
  { label: '候補者管理', href: '/dashboard/candidates', icon: Users, badge: true },
  { label: '0.5次面談ログ', href: '/dashboard/interviews', icon: FileText },
];

const masterMenuItems = [
  { label: 'クライアント企業', href: '/dashboard/companies', icon: Building2 },
  { label: '求人ポジション', href: '/dashboard/positions', icon: Briefcase },
  { label: '定性要件マスタ', href: '/dashboard/criteria', icon: Database },
  { label: 'エージェント', href: '/dashboard/agents', icon: Users },
];

const systemMenuItems = [
  { label: '設定', href: '/dashboard/settings', icon: Settings },
];

const adminMenuItems = [
  { label: 'ユーザー管理', href: '/dashboard/settings/users', icon: UserCog },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
  onToggle?: () => void;
  variant?: 'permanent' | 'temporary';
}

export function Sidebar({ open = true, onClose, onToggle, variant = 'permanent' }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();
  const { isAdmin } = useCurrentUser();
  const { stats } = useDashboardStats();

  const activeCandidatesCount = stats?.active_candidates ?? 0;

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  const currentWidth = open ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_WIDTH;

  const renderMenuItem = (item: { label: string; href: string; icon: React.ElementType; badge?: boolean; adminOnly?: boolean }) => {
    if (item.adminOnly && !isAdmin) return null;

    const active = isActive(item.href);

    const content = (
      <ListItemButton
        component={Link}
        href={item.href}
        selected={active}
        sx={{
          borderRadius: 2,
          minHeight: 44,
          justifyContent: open ? 'initial' : 'center',
          px: open ? 1.5 : 1.5,
          mx: 1,
          my: 0.5,
          transition: 'all 0.2s ease-in-out',
          '&.Mui-selected': {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
            color: 'primary.main',
            '& .MuiListItemIcon-root': {
              color: 'primary.main',
            },
            '&:hover': {
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
            },
          },
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: open ? 1.5 : 'auto',
            justifyContent: 'center',
            color: active ? 'primary.main' : 'text.secondary',
            transition: 'color 0.2s ease-in-out',
          }}
        >
          <item.icon size={20} strokeWidth={active ? 2.5 : 2} />
        </ListItemIcon>
        {open && (
          <>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{ 
                fontSize: '0.875rem',
                fontWeight: active ? 600 : 500,
              }}
            />
            {item.badge && activeCandidatesCount > 0 && (
              <Chip
                label={activeCandidatesCount}
                size="small"
                color="primary"
                sx={{ 
                  height: 22, 
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  minWidth: 28,
                  '& .MuiChip-label': {
                    px: 1,
                  },
                }}
              />
            )}
          </>
        )}
      </ListItemButton>
    );

    if (!open) {
      return (
        <Tooltip title={item.label} placement="right" arrow key={item.href}>
          <ListItem disablePadding sx={{ display: 'block' }}>{content}</ListItem>
        </Tooltip>
      );
    }

    return <ListItem key={item.href} disablePadding sx={{ display: 'block' }}>{content}</ListItem>;
  };

  const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    open ? (
      <Typography
        variant="caption"
        sx={{ 
          px: 2.5, 
          py: 1.5,
          display: 'block', 
          color: 'text.secondary', 
          fontWeight: 600,
          fontSize: '0.6875rem',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
      >
        {children}
      </Typography>
    ) : (
      <Divider sx={{ my: 1, mx: 2 }} />
    )
  );

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: open ? 'flex-start' : 'center', 
          px: open ? 2.5 : 1,
          minHeight: '64px !important',
        }}
      >
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box
            sx={{
              width: 36,
              height: 36,
              bgcolor: 'primary.main',
              borderRadius: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              flexShrink: 0,
              boxShadow: (theme) => `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`,
            }}
          >
            <Briefcase size={20} />
          </Box>
          {open && (
            <Typography 
              variant="h6" 
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                letterSpacing: '-0.02em',
              }}
            >
              RecruitLog
            </Typography>
          )}
        </Box>
      </Toolbar>
      <Divider />

      <Box sx={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', py: 1.5 }}>
        <SectionLabel>MAIN</SectionLabel>
        <List disablePadding>
          {mainMenuItems.map(renderMenuItem)}
        </List>

        <Box mt={2} />

        <SectionLabel>MASTER DATA</SectionLabel>
        <List disablePadding>
          {masterMenuItems.map(renderMenuItem)}
        </List>

        <Box mt={2} />

        <SectionLabel>SYSTEM</SectionLabel>
        <List disablePadding>
          {systemMenuItems.map(renderMenuItem)}
          {isAdmin && adminMenuItems.map((item) => renderMenuItem({ ...item, adminOnly: true }))}
        </List>
      </Box>

      {variant === 'permanent' && (
        <>
          <Divider />
          <Box sx={{ p: 1, display: 'flex', justifyContent: open ? 'flex-end' : 'center' }}>
            <Tooltip title={open ? 'サイドバーを閉じる' : 'サイドバーを開く'} placement="right">
              <IconButton 
                onClick={onToggle} 
                size="small"
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'text.primary',
                    bgcolor: 'action.hover',
                  },
                }}
              >
                {open ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
              </IconButton>
            </Tooltip>
          </Box>
        </>
      )}

      <Divider />
      <Box p={open ? 2 : 1}>
        {open ? (
          <Card 
            variant="outlined" 
            sx={{ 
              border: 'none', 
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
              borderRadius: 2,
            }}
          >
            <CardContent
              sx={{ 
                p: '12px !important', 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
              }}
            >
              <Avatar 
                src={user?.imageUrl} 
                alt={user?.fullName ?? ''} 
                sx={{ 
                  width: 40, 
                  height: 40,
                  border: '2px solid',
                  borderColor: 'background.paper',
                  boxShadow: 1,
                }} 
              />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography 
                  variant="subtitle2" 
                  sx={{
                    fontWeight: 600,
                    color: 'text.primary',
                    lineHeight: 1.3,
                  }}
                  noWrap
                >
                  {user?.fullName ?? 'ユーザー'}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{
                    color: 'text.secondary',
                    display: 'block',
                    lineHeight: 1.3,
                  }}
                  noWrap
                >
                  {user?.primaryEmailAddress?.emailAddress}
                </Typography>
              </Box>
              <Tooltip title="ログアウト">
                <IconButton 
                  size="small" 
                  onClick={() => signOut()}
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'error.main',
                      bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
                    },
                  }}
                >
                  <LogOut size={16} />
                </IconButton>
              </Tooltip>
            </CardContent>
          </Card>
        ) : (
          <Tooltip title="ログアウト" placement="right">
            <IconButton 
              onClick={() => signOut()} 
              sx={{ 
                mx: 'auto', 
                display: 'block',
                '&:hover': {
                  bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
                },
              }}
            >
              <Avatar 
                src={user?.imageUrl} 
                alt={user?.fullName ?? ''} 
                sx={{ 
                  width: 36, 
                  height: 36,
                  border: '2px solid',
                  borderColor: 'divider',
                }} 
              />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );

  if (variant === 'temporary') {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: SIDEBAR_WIDTH,
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: currentWidth,
          borderRight: '1px solid',
          borderColor: 'divider',
          transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          overflowX: 'hidden',
        },
      }}
      open
    >
      {drawerContent}
    </Drawer>
  );
}
