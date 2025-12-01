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

    const content = (
      <ListItemButton
        component={Link}
        href={item.href}
        selected={isActive(item.href)}
        sx={{
          mx: 1,
          borderRadius: 2,
          minHeight: 44,
          justifyContent: open ? 'initial' : 'center',
          px: open ? 2 : 2.5,
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: open ? 2 : 'auto',
            justifyContent: 'center',
            color: isActive(item.href) ? 'primary.main' : undefined,
          }}
        >
          <item.icon size={20} />
        </ListItemIcon>
        {open && (
          <>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{ fontWeight: isActive(item.href) ? 600 : 400 }}
            />
            {item.badge && activeCandidatesCount > 0 && (
              <Chip
                label={activeCandidatesCount}
                size="small"
                color="primary"
                sx={{ height: 20, fontSize: '0.7rem' }}
              />
            )}
          </>
        )}
      </ListItemButton>
    );

    if (!open) {
      return (
        <Tooltip title={item.label} placement="right" key={item.href}>
          <ListItem disablePadding>{content}</ListItem>
        </Tooltip>
      );
    }

    return <ListItem key={item.href} disablePadding>{content}</ListItem>;
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: open ? 'flex-start' : 'center', px: open ? 3 : 1 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <Box
            sx={{
              width: 32,
              height: 32,
              bgcolor: 'primary.main',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              flexShrink: 0,
            }}
          >
            <Briefcase size={20} />
          </Box>
          {open && (
            <Typography variant="h6" color="primary" fontWeight={800} noWrap>
              RecruitLog
            </Typography>
          )}
        </Box>
      </Toolbar>
      <Divider />

      <Box sx={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', py: 2 }}>
        {open && (
          <Typography
            variant="caption"
            sx={{ px: 3, mb: 1, display: 'block', color: 'text.secondary', fontWeight: 'bold' }}
          >
            MAIN
          </Typography>
        )}
        <List>
          {mainMenuItems.map(renderMenuItem)}
        </List>

        <Box my={2} />

        {open && (
          <Typography
            variant="caption"
            sx={{ px: 3, mb: 1, display: 'block', color: 'text.secondary', fontWeight: 'bold' }}
          >
            MASTER DATA
          </Typography>
        )}
        <List>
          {masterMenuItems.map(renderMenuItem)}
        </List>

        <Box my={2} />

        {open && (
          <Typography
            variant="caption"
            sx={{ px: 3, mb: 1, display: 'block', color: 'text.secondary', fontWeight: 'bold' }}
          >
            SYSTEM
          </Typography>
        )}
        <List>
          {systemMenuItems.map(renderMenuItem)}
          {isAdmin && adminMenuItems.map((item) => renderMenuItem({ ...item, adminOnly: true }))}
        </List>
      </Box>

      {variant === 'permanent' && (
        <>
          <Divider />
          <Box sx={{ p: 1, display: 'flex', justifyContent: open ? 'flex-end' : 'center' }}>
            <IconButton onClick={onToggle} size="small">
              {open ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </IconButton>
          </Box>
        </>
      )}

      <Divider />
      <Box p={open ? 2 : 1}>
        {open ? (
          <Card variant="outlined" sx={{ border: 'none', bgcolor: 'background.default' }}>
            <CardContent
              sx={{ p: '12px !important', display: 'flex', alignItems: 'center', gap: 2 }}
            >
              <Avatar src={user?.imageUrl} alt={user?.fullName ?? ''} sx={{ width: 36, height: 36 }} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="subtitle2" fontWeight="bold" noWrap>
                  {user?.fullName ?? 'ユーザー'}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {user?.primaryEmailAddress?.emailAddress}
                </Typography>
              </Box>
              <IconButton size="small" onClick={() => signOut()}>
                <LogOut size={16} />
              </IconButton>
            </CardContent>
          </Card>
        ) : (
          <Tooltip title="ログアウト" placement="right">
            <IconButton onClick={() => signOut()} sx={{ mx: 'auto', display: 'block' }}>
              <Avatar src={user?.imageUrl} alt={user?.fullName ?? ''} sx={{ width: 36, height: 36 }} />
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
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: SIDEBAR_WIDTH },
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
          borderRight: '1px solid #e2e8f0',
          transition: 'width 0.2s ease-in-out',
          overflowX: 'hidden',
        },
      }}
      open
    >
      {drawerContent}
    </Drawer>
  );
}
