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
} from '@mui/material';
import { Settings } from 'lucide-react';
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
            <Typography variant="h6" fontWeight="bold">
              未入力の0.5次面談ログ
            </Typography>
            <Chip
              label={`要対応: ${pendingCandidates.length}件`}
              color="error"
              size="small"
              sx={{ bgcolor: '#fee2e2', color: '#dc2626', fontWeight: 'bold' }}
            />
          </Box>
        }
        action={
          <Box>
            <Button startIcon={<Settings size={16} />} sx={{ color: 'text.secondary', mr: 1 }}>
              フィルター
            </Button>
            <Button component={Link} href="/dashboard/candidates" sx={{ color: 'primary.main' }}>
              すべて見る
            </Button>
          </Box>
        }
      />
      <Divider />
      <TableContainer>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>
                候補者名
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>
                応募ポジション
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>
                エージェント
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>
                面談日
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>
                担当者
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>
                アクション
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingCandidates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    未入力の面談ログはありません
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              pendingCandidates.slice(0, 5).map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <Avatar
                        sx={{ bgcolor: 'primary.light', width: 36, height: 36, fontSize: '0.875rem' }}
                      >
                        {row.name.charAt(0)}
                      </Avatar>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {row.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.job_position_name}
                      size="small"
                      variant="outlined"
                      sx={{ borderColor: '#e2e8f0', borderRadius: 1 }}
                    />
                    <Typography
                      variant="caption"
                      display="block"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      {row.company_name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{row.agent_company_name ?? '-'}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {row.agent_contact_name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="error.main" fontWeight="bold">
                      {row.stage_0_5_date}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{row.owner_user_name ?? '-'}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      component={Link}
                      href={`/dashboard/candidates/${row.id}/interview`}
                      variant="contained"
                      size="small"
                      disableElevation
                      sx={{ borderRadius: 1 }}
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

