'use client';

import Link from 'next/link';
import {
  Card,
  CardHeader,
  Divider,
  Box,
  Typography,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  alpha,
} from '@mui/material';
import { Filter, ArrowRight } from 'lucide-react';
import type { CandidateWithRelations } from '@/domain/entities/candidate';

interface PendingInterviewsTableProps {
  candidates: CandidateWithRelations[];
}

export function PendingInterviewsTable({ candidates }: PendingInterviewsTableProps) {
  const pendingCandidates = candidates.filter(
    (c) => c.stage_0_5_result === 'not_done' && c.stage_0_5_date
  );

  return (
    <Card>
      <CardHeader
        title={
          <Box display="flex" alignItems="center" gap={2}>
            <Typography 
              variant="h6" 
              sx={{
                fontWeight: 600,
                fontSize: '1rem',
              }}
            >
              未入力の0.5次面談ログ
            </Typography>
            <Chip
              label={`要対応: ${pendingCandidates.length}件`}
              size="small"
              sx={{ 
                bgcolor: '#fef2f2', 
                color: '#dc2626', 
                fontWeight: 600,
                fontSize: '0.75rem',
                height: 24,
              }}
            />
          </Box>
        }
        action={
          <Box display="flex" gap={1}>
            <Button 
              startIcon={<Filter size={16} />} 
              size="small"
              sx={{ 
                color: 'text.secondary',
                fontWeight: 500,
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              フィルター
            </Button>
            <Button 
              component={Link} 
              href="/dashboard/candidates" 
              endIcon={<ArrowRight size={16} />}
              size="small"
              sx={{ 
                color: 'primary.main',
                fontWeight: 600,
              }}
            >
              すべて見る
            </Button>
          </Box>
        }
        sx={{
          px: 3,
          py: 2.5,
        }}
      />
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>候補者名</TableCell>
              <TableCell>応募ポジション</TableCell>
              <TableCell>エージェント</TableCell>
              <TableCell>面談日</TableCell>
              <TableCell>担当者</TableCell>
              <TableCell align="right">アクション</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingCandidates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <Box 
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Typography 
                      sx={{
                        color: 'text.secondary',
                        fontSize: '0.875rem',
                      }}
                    >
                      未入力の面談ログはありません
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              pendingCandidates.slice(0, 5).map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                    transition: 'background-color 0.15s ease-in-out',
                  }}
                >
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <Avatar
                        sx={{ 
                          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                          color: 'primary.main',
                          width: 36, 
                          height: 36, 
                          fontSize: '0.875rem',
                          fontWeight: 600,
                        }}
                      >
                        {row.name.charAt(0)}
                      </Avatar>
                      <Typography 
                        variant="subtitle2" 
                        sx={{
                          fontWeight: 600,
                          color: 'text.primary',
                        }}
                      >
                        {row.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Chip
                        label={row.job_position_name}
                        size="small"
                        variant="outlined"
                        sx={{ 
                          borderColor: 'divider',
                          borderRadius: 1.5,
                          fontWeight: 500,
                          fontSize: '0.75rem',
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          color: 'text.secondary',
                          mt: 0.5,
                        }}
                      >
                        {row.company_name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2"
                      sx={{ fontWeight: 500 }}
                    >
                      {row.agent_company_name ?? '-'}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ color: 'text.secondary' }}
                    >
                      {row.agent_contact_name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.stage_0_5_date}
                      size="small"
                      sx={{
                        bgcolor: '#fef2f2',
                        color: '#dc2626',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2"
                      sx={{ fontWeight: 500 }}
                    >
                      {row.owner_user_name ?? '-'}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      component={Link}
                      href={`/dashboard/candidates/${row.id}/interview`}
                      variant="contained"
                      size="small"
                      disableElevation
                      sx={{ 
                        borderRadius: 1.5,
                        px: 2,
                        fontWeight: 600,
                        fontSize: '0.8125rem',
                      }}
                    >
                      評価入力
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
