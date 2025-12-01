import React, { useState } from 'react';
import { 
  createTheme, 
  ThemeProvider, 
  CssBaseline, 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  List, 
  Typography, 
  Divider, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  InputBase,
  Badge,
  IconButton,
  Avatar,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  Chip,
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Building2, 
  Briefcase, 
  Settings, 
  Search, 
  Bell, 
  HelpCircle,
  Plus,
  ChevronRight,
  Menu as MenuIcon,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  MoreHorizontal,
  LogOut,
  Database
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ComposedChart,
  Line
} from 'recharts';

// --- Theme Configuration ---
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb', // Royal Blue
      light: '#60a5fa',
      dark: '#1e40af',
    },
    secondary: {
      main: '#64748b', // Slate
    },
    background: {
      default: '#f8fafc', // Light gray background
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
    error: {
      main: '#ef4444',
    },
    success: {
      main: '#22c55e',
    },
    warning: {
      main: '#f59e0b',
    },
  },
  typography: {
    fontFamily: '"Noto Sans JP", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      fontSize: '1.5rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
    },
    subtitle1: {
      fontWeight: 600,
    },
    body2: {
      color: '#64748b',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          border: '1px solid #e2e8f0',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
  },
});

// --- Mock Data ---
const funnelData = [
  { name: '0.5次面談', count: 124 },
  { name: '一次面談', count: 48 },
  { name: '二次面談', count: 24 },
  { name: '最終面談', count: 12 },
  { name: '内定', count: 5 },
  { name: '入社', count: 3 },
];

const agentData = [
  { name: 'リクルート', count: 50, rate: 35 },
  { name: 'パーソル', count: 40, rate: 25 },
  { name: 'JAC', count: 15, rate: 45 },
  { name: 'ビズリーチ', count: 30, rate: 28 },
  { name: 'Green', count: 20, rate: 18 },
];

const pendingLogs = [
  { 
    id: 1, 
    name: '田中 雄太', 
    age: 28, 
    position: 'CA (中途)', 
    company: '株式会社サイバーエージェント',
    agent: 'リクルート AG', 
    agentRep: '佐藤 担当',
    date: '本日 10:00', 
    owner: 'Admin User',
    avatar: 'https://i.pravatar.cc/150?u=1'
  },
  { 
    id: 2, 
    name: '佐藤 香織', 
    age: 25, 
    position: '両面コンサル', 
    company: '株式会社XYZ',
    agent: 'パーソルキャリア', 
    agentRep: '鈴木 担当',
    date: '昨日 15:30', 
    owner: 'Admin User',
    avatar: 'https://i.pravatar.cc/150?u=2'
  },
  { 
    id: 3, 
    name: '三浦 健太', 
    age: 30, 
    position: 'CA (新卒)', 
    company: '株式会社サイバーエージェント',
    agent: 'ビズリーチ', 
    agentRep: 'ダイレクト',
    date: '11/29 11:00', 
    owner: '鈴木 面接官',
    avatar: 'https://i.pravatar.cc/150?u=3'
  },
];

const drawerWidth = 260;

// --- Components ---

const KPICard = ({ title, value, unit, subtext, trend, trendColor, icon: Icon, alert }) => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'visible' }}>
    {alert && (
      <Box sx={{ position: 'absolute', top: -10, right: -10, zIndex: 10 }}>
        <Chip 
          label="要確認" 
          color="error" 
          size="small" 
          icon={<AlertTriangle size={14} />} 
          sx={{ fontWeight: 'bold' }}
        />
      </Box>
    )}
    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
        <Box>
          <Typography variant="body2" color="text.secondary" fontWeight="bold" gutterBottom>
            {title}
          </Typography>
          <Box display="flex" alignItems="baseline">
            <Typography variant="h4" color="text.primary">
              {value}
            </Typography>
            {unit && <Typography variant="body2" color="text.secondary" ml={0.5}>{unit}</Typography>}
          </Box>
        </Box>
        <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'primary.50', color: 'primary.main' }}>
          <Icon size={24} />
        </Box>
      </Box>
      
      <Box>
        {trend && (
          <Chip 
            label={trend} 
            size="small" 
            sx={{ 
              bgcolor: trendColor === 'success' ? '#dcfce7' : '#fee2e2', 
              color: trendColor === 'success' ? '#166534' : '#991b1b',
              fontWeight: 'bold',
              height: 24
            }} 
          />
        )}
        {subtext && (
          <Typography variant="caption" color="text.secondary" display="block" mt={1}>
            {subtext}
          </Typography>
        )}
        {alert && (
          <Typography variant="caption" color="error" fontWeight="bold" display="flex" alignItems="center" mt={1} sx={{ cursor: 'pointer' }}>
            詳細を確認 <ChevronRight size={14} />
          </Typography>
        )}
      </Box>
    </CardContent>
  </Card>
);

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', px: 3 }}>
        <Box display="flex" alignItems="center" gap={1}>
           {/* Logo Placeholder */}
           <Box sx={{ width: 32, height: 32, bgcolor: 'primary.main', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
             <Briefcase size={20} />
           </Box>
           <Typography variant="h6" color="primary" fontWeight="800">
             RecruitLog
           </Typography>
        </Box>
      </Toolbar>
      <Divider />
      
      <Box sx={{ flexGrow: 1, overflowY: 'auto', py: 2 }}>
        <List subheader={<Typography variant="caption" sx={{ px: 3, mb: 1, display: 'block', color: 'text.secondary', fontWeight: 'bold' }}>MAIN</Typography>}>
          <ListItem disablePadding>
            <ListItemButton selected sx={{ mx: 1, borderRadius: 2 }}>
              <ListItemIcon sx={{ minWidth: 40, color: 'primary.main' }}><LayoutDashboard size={20} /></ListItemIcon>
              <ListItemText primary="ダッシュボード" primaryTypographyProps={{ fontWeight: 600 }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton sx={{ mx: 1, borderRadius: 2 }}>
              <ListItemIcon sx={{ minWidth: 40 }}><Users size={20} /></ListItemIcon>
              <ListItemText primary="候補者管理" secondary={<Chip label="12" size="small" color="primary" sx={{ height: 20, fontSize: '0.7rem' }} />} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton sx={{ mx: 1, borderRadius: 2 }}>
              <ListItemIcon sx={{ minWidth: 40 }}><FileText size={20} /></ListItemIcon>
              <ListItemText primary="0.5次面談ログ" />
            </ListItemButton>
          </ListItem>
        </List>

        <Box my={2} />

        <List subheader={<Typography variant="caption" sx={{ px: 3, mb: 1, display: 'block', color: 'text.secondary', fontWeight: 'bold' }}>MASTER DATA</Typography>}>
          <ListItem disablePadding>
            <ListItemButton sx={{ mx: 1, borderRadius: 2 }}>
              <ListItemIcon sx={{ minWidth: 40 }}><Building2 size={20} /></ListItemIcon>
              <ListItemText primary="クライアント企業" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton sx={{ mx: 1, borderRadius: 2 }}>
              <ListItemIcon sx={{ minWidth: 40 }}><Briefcase size={20} /></ListItemIcon>
              <ListItemText primary="求人ポジション" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton sx={{ mx: 1, borderRadius: 2 }}>
              <ListItemIcon sx={{ minWidth: 40 }}><Database size={20} /></ListItemIcon>
              <ListItemText primary="定性要件マスタ" />
            </ListItemButton>
          </ListItem>
           <ListItem disablePadding>
            <ListItemButton sx={{ mx: 1, borderRadius: 2 }}>
              <ListItemIcon sx={{ minWidth: 40 }}><Users size={20} /></ListItemIcon>
              <ListItemText primary="エージェント" />
            </ListItemButton>
          </ListItem>
        </List>
        
         <Box my={2} />

        <List subheader={<Typography variant="caption" sx={{ px: 3, mb: 1, display: 'block', color: 'text.secondary', fontWeight: 'bold' }}>SYSTEM</Typography>}>
          <ListItem disablePadding>
            <ListItemButton sx={{ mx: 1, borderRadius: 2 }}>
              <ListItemIcon sx={{ minWidth: 40 }}><Settings size={20} /></ListItemIcon>
              <ListItemText primary="設定" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      <Divider />
      <Box p={2}>
        <Card variant="outlined" sx={{ border: 'none', bgcolor: 'background.default' }}>
          <CardContent sx={{ p: '12px !important', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar src="https://i.pravatar.cc/150?u=admin" alt="Admin" />
            <Box>
              <Typography variant="subtitle2" fontWeight="bold">Admin User</Typography>
              <Typography variant="caption" color="text.secondary">System Administrator</Typography>
            </Box>
            <IconButton size="small" sx={{ ml: 'auto' }}>
              <LogOut size={16} />
            </IconButton>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        
        {/* Header */}
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            width: { md: `calc(100% - ${drawerWidth}px)` },
            ml: { md: `${drawerWidth}px` },
            bgcolor: 'background.paper',
            borderBottom: '1px solid #e2e8f0',
            color: 'text.primary',
            zIndex: (theme) => theme.zIndex.drawer + 1
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            
            {/* Breadcrumb / Page Title */}
            <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
              <Typography variant="body2" sx={{ mr: 1 }}>ホーム</Typography>
              <ChevronRight size={16} />
              <Typography variant="subtitle1" sx={{ ml: 1, color: 'text.primary' }}>ダッシュボード</Typography>
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            {/* Global Search */}
            <Box
              sx={{
                position: 'relative',
                borderRadius: 2,
                backgroundColor: '#f1f5f9',
                '&:hover': {
                  backgroundColor: '#e2e8f0',
                },
                mr: 2,
                ml: 0,
                width: '100%',
                maxWidth: 400,
                display: { xs: 'none', sm: 'block' },
              }}
            >
              <Box sx={{ px: 2, height: '100%', position: 'absolute', pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
                <Search size={18} />
              </Box>
              <InputBase
                placeholder="候補者、企業を検索..."
                sx={{ color: 'inherit', width: '100%', p: 1, pl: 6 }}
              />
            </Box>

            {/* Actions */}
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

        {/* Sidebar */}
        <Box
          component="nav"
          sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawerContent}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid #e2e8f0' },
            }}
            open
          >
            {drawerContent}
          </Drawer>
        </Box>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { md: `calc(100% - ${drawerWidth}px)` },
            mt: 8,
          }}
        >
          {/* Page Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Box>
              <Typography variant="h4" gutterBottom>採用状況サマリー</Typography>
              <Typography variant="body2" color="text.secondary">
                最終更新: 2025年12月1日 14:30
              </Typography>
            </Box>
            <Button variant="contained" startIcon={<Plus size={18} />} disableElevation size="large">
              新規候補者登録
            </Button>
          </Box>

          {/* KPI Cards */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} md={3}>
              <KPICard 
                title="進行中候補者数" 
                value="48" 
                unit="名" 
                trend="+12% (前月比)" 
                trendColor="success" 
                icon={Users} 
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <KPICard 
                title="0.5次面談 通過率" 
                value="32.5" 
                unit="%" 
                subtext="実施数: 124件"
                icon={FileText} 
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <KPICard 
                title="今月の内定承諾" 
                value="3" 
                unit="名" 
                trend="目標達成まであと2名" 
                trendColor="warning"
                icon={CheckCircle2} 
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <KPICard 
                title="ミスマッチ報告" 
                value="1" 
                unit="件" 
                alert={true}
                icon={AlertTriangle} 
              />
            </Grid>
          </Grid>

          {/* Charts Row */}
          <Grid container spacing={3} mb={4}>
            {/* Funnel Chart */}
            <Grid item xs={12} lg={8}>
              <Card sx={{ height: 400 }}>
                <CardHeader 
                  title="選考ファネル (今期累積)" 
                  action={<IconButton><MoreHorizontal /></IconButton>} 
                />
                <Divider />
                <CardContent sx={{ height: 320 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={funnelData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="count" fill="#60a5fa" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Agent Performance Chart */}
            <Grid item xs={12} lg={4}>
              <Card sx={{ height: 400 }}>
                <CardHeader 
                  title="エージェント別 0.5通過率" 
                  action={<IconButton><Settings size={16}/></IconButton>}
                />
                <Divider />
                <CardContent sx={{ height: 320 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={agentData}
                      margin={{ top: 20, right: 20, bottom: 20, left: -20 }}
                    >
                      <CartesianGrid stroke="#f5f5f5" />
                      <XAxis dataKey="name" scale="band" tick={{fontSize: 10}} interval={0} angle={-30} textAnchor="end" />
                      <YAxis yAxisId="left" orientation="left" tick={{fontSize: 10}} />
                      <YAxis yAxisId="right" orientation="right" unit="%" tick={{fontSize: 10}} />
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36}/>
                      <Bar yAxisId="left" dataKey="count" name="紹介人数" fill="#93c5fd" barSize={20} radius={[4, 4, 0, 0]} />
                      <Line yAxisId="right" type="monotone" dataKey="rate" name="0.5通過率(%)" stroke="#8b5cf6" strokeWidth={2} dot={{r: 4}} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Action List Table */}
          <Card>
            <CardHeader 
              title={
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography variant="h6" fontWeight="bold">未入力の0.5次面談ログ</Typography>
                  <Chip label="要対応: 3件" color="error" size="small" sx={{ bgcolor: '#fee2e2', color: '#dc2626', fontWeight: 'bold' }} />
                </Box>
              }
              action={
                <Box>
                  <Button startIcon={<Settings size={16} />} sx={{ color: 'text.secondary', mr: 1 }}>フィルター</Button>
                  <Button sx={{ color: 'primary.main' }}>すべて見る</Button>
                </Box>
              }
            />
            <Divider />
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold', fontSize: '0.75rem' }}>候補者名 / 年齢</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold', fontSize: '0.75rem' }}>応募ポジション</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold', fontSize: '0.75rem' }}>エージェント</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold', fontSize: '0.75rem' }}>面談日</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold', fontSize: '0.75rem' }}>担当者 (OWNER)</TableCell>
                    <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 'bold', fontSize: '0.75rem' }}>アクション</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingLogs.map((row) => (
                    <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1.5}>
                          <Avatar sx={{ bgcolor: 'primary.light', width: 36, height: 36, fontSize: '0.875rem' }}>{row.name.charAt(0)}</Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold">{row.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{row.age}歳</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={row.position.split(' ')[0]} size="small" variant="outlined" sx={{ mr: 1, borderColor: '#e2e8f0', borderRadius: 1 }} />
                        <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>{row.company}</Typography>
                      </TableCell>
                      <TableCell>
                         <Typography variant="body2">{row.agent}</Typography>
                         <Typography variant="caption" color="text.secondary">{row.agentRep}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="error.main" fontWeight="bold">{row.date}</Typography>
                      </TableCell>
                      <TableCell>
                         <Box display="flex" alignItems="center" gap={1}>
                            <Avatar src={row.avatar} sx={{ width: 24, height: 24 }} />
                            {/* <Typography variant="body2">{row.owner}</Typography> */}
                         </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Button variant="contained" size="small" disableElevation sx={{ borderRadius: 1 }}>
                          評価入力
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>

        </Box>
      </Box>
    </ThemeProvider>
  );
}