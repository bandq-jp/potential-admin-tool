'use client';

import { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import { Sidebar, SIDEBAR_WIDTH, SIDEBAR_COLLAPSED_WIDTH } from './Sidebar';
import { Header } from './Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleMobileToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const currentWidth = sidebarOpen ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_WIDTH;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Header
        onMenuClick={handleMobileToggle}
        onSidebarToggle={handleSidebarToggle}
        sidebarOpen={sidebarOpen}
        sidebarWidth={currentWidth}
      />
      <Sidebar open={sidebarOpen} onToggle={handleSidebarToggle} />
      <Sidebar
        variant="temporary"
        open={mobileOpen}
        onClose={handleMobileToggle}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: { xs: 0, md: `${currentWidth}px` },
          width: { xs: '100%', md: `calc(100% - ${currentWidth}px)` },
          bgcolor: 'background.default',
          minHeight: '100vh',
          transition: 'margin-left 0.2s ease-in-out, width 0.2s ease-in-out',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
