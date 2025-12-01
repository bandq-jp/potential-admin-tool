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
} from 'lucide-react';
import { useClerk, useUser } from '@clerk/nextjs';

const DRAWER_WIDTH = 260;

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

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
  variant?: 'permanent' | 'temporary';
}

export function Sidebar({ open = true, onClose, variant = 'permanent' }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', px: 3 }}>
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
            }}
          >
            <Briefcase size={20} />
          </Box>
          <Typography variant="h6" color="primary" fontWeight={800}>
            RecruitLog
          </Typography>
        </Box>
      </Toolbar>
      <Divider />

      <Box sx={{ flexGrow: 1, overflowY: 'auto', py: 2 }}>
        <List
          subheader={
            <Typography
              variant="caption"
              sx={{ px: 3, mb: 1, display: 'block', color: 'text.secondary', fontWeight: 'bold' }}
            >
              MAIN
            </Typography>
          }
        >
          {mainMenuItems.map((item) => (
            <ListItem key={item.href} disablePadding>
              <ListItemButton
                component={Link}
                href={item.href}
                selected={isActive(item.href)}
                sx={{ mx: 1, borderRadius: 2 }}
              >
                <ListItemIcon
                  sx={{ minWidth: 40, color: isActive(item.href) ? 'primary.main' : undefined }}
                >
                  <item.icon size={20} />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontWeight: isActive(item.href) ? 600 : 400 }}
                />
                {item.badge && (
                  <Chip
                    label="12"
                    size="small"
                    color="primary"
                    sx={{ height: 20, fontSize: '0.7rem' }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Box my={2} />

        <List
          subheader={
            <Typography
              variant="caption"
              sx={{ px: 3, mb: 1, display: 'block', color: 'text.secondary', fontWeight: 'bold' }}
            >
              MASTER DATA
            </Typography>
          }
        >
          {masterMenuItems.map((item) => (
            <ListItem key={item.href} disablePadding>
              <ListItemButton
                component={Link}
                href={item.href}
                selected={isActive(item.href)}
                sx={{ mx: 1, borderRadius: 2 }}
              >
                <ListItemIcon
                  sx={{ minWidth: 40, color: isActive(item.href) ? 'primary.main' : undefined }}
                >
                  <item.icon size={20} />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontWeight: isActive(item.href) ? 600 : 400 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Box my={2} />

        <List
          subheader={
            <Typography
              variant="caption"
              sx={{ px: 3, mb: 1, display: 'block', color: 'text.secondary', fontWeight: 'bold' }}
            >
              SYSTEM
            </Typography>
          }
        >
          {systemMenuItems.map((item) => (
            <ListItem key={item.href} disablePadding>
              <ListItemButton
                component={Link}
                href={item.href}
                selected={isActive(item.href)}
                sx={{ mx: 1, borderRadius: 2 }}
              >
                <ListItemIcon
                  sx={{ minWidth: 40, color: isActive(item.href) ? 'primary.main' : undefined }}
                >
                  <item.icon size={20} />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontWeight: isActive(item.href) ? 600 : 400 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Divider />
      <Box p={2}>
        <Card variant="outlined" sx={{ border: 'none', bgcolor: 'background.default' }}>
          <CardContent
            sx={{ p: '12px !important', display: 'flex', alignItems: 'center', gap: 2 }}
          >
            <Avatar src={user?.imageUrl} alt={user?.fullName ?? ''} />
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
      </Box>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
      {variant === 'temporary' ? (
        <Drawer
          variant="temporary"
          open={open}
          onClose={onClose}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              borderRight: '1px solid #e2e8f0',
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      )}
    </Box>
  );
}

export const SIDEBAR_WIDTH = DRAWER_WIDTH;

