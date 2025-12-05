'use client';

import { Card, CardContent, Box, Typography, Chip, alpha } from '@mui/material';
import { AlertTriangle, ChevronRight, LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtext?: string;
  trend?: string;
  trendColor?: 'success' | 'warning' | 'error';
  icon: LucideIcon;
  alert?: boolean;
  onClick?: () => void;
}

export function KPICard({
  title,
  value,
  unit,
  subtext,
  trend,
  trendColor = 'success',
  icon: Icon,
  alert,
  onClick,
}: KPICardProps) {
  const trendStyles = {
    success: {
      bg: '#ecfdf5',
      color: '#059669',
    },
    warning: {
      bg: '#fffbeb',
      color: '#d97706',
    },
    error: {
      bg: '#fef2f2',
      color: '#dc2626',
    },
  };

  const iconBgColors = {
    success: { bg: '#ecfdf5', color: '#10b981' },
    warning: { bg: '#fffbeb', color: '#f59e0b' },
    error: { bg: '#fef2f2', color: '#ef4444' },
    default: { bg: (theme: any) => alpha(theme.palette.primary.main, 0.08), color: 'primary.main' },
  };

  const iconStyle = alert ? iconBgColors.error : iconBgColors.default;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'visible',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        '&:hover': onClick ? { 
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
          transform: 'translateY(-2px)',
        } : undefined,
      }}
      onClick={onClick}
    >
      {alert && (
        <Box sx={{ position: 'absolute', top: -8, right: -8, zIndex: 10 }}>
          <Chip
            label="要確認"
            color="error"
            size="small"
            icon={<AlertTriangle size={12} />}
            sx={{ 
              fontWeight: 600,
              fontSize: '0.6875rem',
              height: 24,
              boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)',
              '& .MuiChip-icon': {
                ml: 0.5,
              },
            }}
          />
        </Box>
      )}
      <CardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: '20px 24px 24px !important',
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontWeight: 600,
                fontSize: '0.8125rem',
                mb: 1,
              }}
            >
              {title}
            </Typography>
            <Box display="flex" alignItems="baseline" gap={0.5}>
              <Typography 
                variant="h4" 
                sx={{
                  fontWeight: 700,
                  fontSize: '1.75rem',
                  color: alert ? 'error.main' : 'text.primary',
                  letterSpacing: '-0.02em',
                }}
              >
                {value}
              </Typography>
              {unit && (
                <Typography 
                  variant="body2" 
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                  }}
                >
                  {unit}
                </Typography>
              )}
            </Box>
          </Box>
          <Box
            sx={{
              p: 1.25,
              borderRadius: 2,
              bgcolor: typeof iconStyle.bg === 'function' ? iconStyle.bg : iconStyle.bg,
              color: iconStyle.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon size={22} strokeWidth={2} />
          </Box>
        </Box>

        <Box sx={{ mt: 'auto' }}>
          {trend && (
            <Chip
              label={trend}
              size="small"
              sx={{
                bgcolor: trendStyles[trendColor].bg,
                color: trendStyles[trendColor].color,
                fontWeight: 600,
                fontSize: '0.75rem',
                height: 24,
                '& .MuiChip-label': {
                  px: 1.5,
                },
              }}
            />
          )}
          {subtext && (
            <Typography 
              variant="caption" 
              sx={{
                color: 'text.secondary',
                display: 'block',
                mt: trend ? 1 : 0,
                fontSize: '0.75rem',
              }}
            >
              {subtext}
            </Typography>
          )}
          {alert && (
            <Typography
              variant="caption"
              sx={{
                color: 'error.main',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 0.25,
                mt: 1,
                cursor: 'pointer',
                fontSize: '0.75rem',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              詳細を確認 <ChevronRight size={14} />
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
