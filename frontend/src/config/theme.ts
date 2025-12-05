'use client';

import { createTheme, alpha } from '@mui/material/styles';

// 洗練されたライトテーマのカラーパレット
const colors = {
  primary: {
    main: '#3b82f6',
    light: '#60a5fa',
    dark: '#2563eb',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#6366f1',
    light: '#818cf8',
    dark: '#4f46e5',
    contrastText: '#ffffff',
  },
  accent: {
    teal: '#14b8a6',
    amber: '#f59e0b',
    rose: '#f43f5e',
    violet: '#8b5cf6',
  },
  neutral: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
  },
  background: {
    default: '#f8fafc',
    paper: '#ffffff',
    subtle: '#f1f5f9',
  },
  border: {
    light: '#e2e8f0',
    main: '#cbd5e1',
  },
};

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: colors.primary,
    secondary: colors.secondary,
    background: {
      default: colors.background.default,
      paper: colors.background.paper,
    },
    text: {
      primary: colors.neutral[800],
      secondary: colors.neutral[500],
    },
    error: {
      main: '#ef4444',
      light: '#fef2f2',
      dark: '#dc2626',
    },
    success: {
      main: '#10b981',
      light: '#ecfdf5',
      dark: '#059669',
    },
    warning: {
      main: '#f59e0b',
      light: '#fffbeb',
      dark: '#d97706',
    },
    info: {
      main: '#0ea5e9',
      light: '#f0f9ff',
      dark: '#0284c7',
    },
    divider: colors.border.light,
  },
  typography: {
    fontFamily: '"Noto Sans JP", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.3,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '1.75rem',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 700,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    subtitle1: {
      fontWeight: 600,
      fontSize: '0.9375rem',
      lineHeight: 1.5,
    },
    subtitle2: {
      fontWeight: 600,
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '0.9375rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: colors.neutral[500],
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.5,
      color: colors.neutral[500],
    },
    button: {
      fontWeight: 600,
      textTransform: 'none' as const,
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: `${colors.neutral[300]} ${colors.neutral[100]}`,
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            width: 8,
            height: 8,
          },
          '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
            background: colors.neutral[100],
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            backgroundColor: colors.neutral[300],
            borderRadius: 4,
            '&:hover': {
              backgroundColor: colors.neutral[400],
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          border: `1px solid ${colors.border.light}`,
          backgroundImage: 'none',
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: '20px 24px 16px',
        },
        title: {
          fontSize: '1rem',
          fontWeight: 600,
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '16px 24px 24px',
          '&:last-child': {
            paddingBottom: 24,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 16px',
          transition: 'all 0.2s ease-in-out',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          },
        },
        outlined: {
          borderColor: colors.border.main,
          '&:hover': {
            borderColor: colors.primary.main,
            backgroundColor: alpha(colors.primary.main, 0.04),
          },
        },
        sizeLarge: {
          padding: '12px 24px',
          fontSize: '0.9375rem',
        },
        sizeSmall: {
          padding: '6px 12px',
          fontSize: '0.8125rem',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: alpha(colors.primary.main, 0.08),
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '0.75rem',
          borderRadius: 6,
        },
        filled: {
          '&.MuiChip-colorDefault': {
            backgroundColor: colors.neutral[100],
            color: colors.neutral[700],
          },
        },
        outlined: {
          borderColor: colors.border.light,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: colors.background.paper,
            transition: 'all 0.2s ease-in-out',
            '& fieldset': {
              borderColor: colors.border.light,
            },
            '&:hover fieldset': {
              borderColor: colors.border.main,
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.primary.main,
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '& fieldset': {
            borderColor: colors.border.light,
          },
          '&:hover fieldset': {
            borderColor: colors.border.main,
          },
          '&.Mui-focused fieldset': {
            borderColor: colors.primary.main,
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: '0.9375rem',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottomColor: colors.border.light,
          padding: '14px 16px',
        },
        head: {
          fontWeight: 600,
          fontSize: '0.75rem',
          color: colors.neutral[600],
          backgroundColor: colors.background.subtle,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: alpha(colors.primary.main, 0.02),
          },
          '&:last-child td': {
            borderBottom: 0,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.background.paper,
          color: colors.neutral[800],
          boxShadow: 'none',
          borderBottom: `1px solid ${colors.border.light}`,
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: '64px !important',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: `1px solid ${colors.border.light}`,
          backgroundColor: colors.background.paper,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '2px 8px',
          padding: '10px 12px',
          transition: 'all 0.2s ease-in-out',
          '&.Mui-selected': {
            backgroundColor: alpha(colors.primary.main, 0.08),
            color: colors.primary.main,
            '&:hover': {
              backgroundColor: alpha(colors.primary.main, 0.12),
            },
          },
          '&:hover': {
            backgroundColor: colors.background.subtle,
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 36,
          color: 'inherit',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: colors.border.light,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          fontWeight: 600,
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontWeight: 600,
          fontSize: '0.6875rem',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: colors.neutral[800],
          fontSize: '0.75rem',
          fontWeight: 500,
          padding: '6px 12px',
          borderRadius: 6,
        },
        arrow: {
          color: colors.neutral[800],
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 'none',
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: colors.background.subtle,
            borderBottom: `1px solid ${colors.border.light}`,
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 600,
            fontSize: '0.75rem',
            color: colors.neutral[600],
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          },
          '& .MuiDataGrid-cell': {
            borderBottomColor: colors.border.light,
            padding: '12px 16px',
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: alpha(colors.primary.main, 0.02),
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        },
        elevation2: {
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: '1.125rem',
          fontWeight: 600,
          padding: '20px 24px',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '0 24px 20px',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '16px 24px 20px',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
          border: `1px solid ${colors.border.light}`,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          padding: '10px 16px',
          '&:hover': {
            backgroundColor: colors.background.subtle,
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: '3px 3px 0 0',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        standardSuccess: {
          backgroundColor: '#ecfdf5',
          color: '#065f46',
        },
        standardError: {
          backgroundColor: '#fef2f2',
          color: '#991b1b',
        },
        standardWarning: {
          backgroundColor: '#fffbeb',
          color: '#92400e',
        },
        standardInfo: {
          backgroundColor: '#f0f9ff',
          color: '#075985',
        },
      },
    },
  },
});

// カスタムカラー定義をエクスポート（コンポーネントで使用可能）
export { colors };
