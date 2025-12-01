'use client';

import { Card, CardContent, Box, Typography, Chip } from '@mui/material';
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
  const trendBgColor = {
    success: '#dcfce7',
    warning: '#fef3c7',
    error: '#fee2e2',
  };
  const trendTextColor = {
    success: '#166534',
    warning: '#92400e',
    error: '#991b1b',
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'visible',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? { boxShadow: 3 } : undefined,
      }}
      onClick={onClick}
    >
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
      <CardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight="bold"
              gutterBottom
            >
              {title}
            </Typography>
            <Box display="flex" alignItems="baseline">
              <Typography variant="h4" color="text.primary">
                {value}
              </Typography>
              {unit && (
                <Typography variant="body2" color="text.secondary" ml={0.5}>
                  {unit}
                </Typography>
              )}
            </Box>
          </Box>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              bgcolor: 'primary.50',
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon size={24} />
          </Box>
        </Box>

        <Box>
          {trend && (
            <Chip
              label={trend}
              size="small"
              sx={{
                bgcolor: trendBgColor[trendColor],
                color: trendTextColor[trendColor],
                fontWeight: 'bold',
                height: 24,
              }}
            />
          )}
          {subtext && (
            <Typography variant="caption" color="text.secondary" display="block" mt={1}>
              {subtext}
            </Typography>
          )}
          {alert && (
            <Typography
              variant="caption"
              color="error"
              fontWeight="bold"
              display="flex"
              alignItems="center"
              mt={1}
              sx={{ cursor: 'pointer' }}
            >
              詳細を確認 <ChevronRight size={14} />
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

