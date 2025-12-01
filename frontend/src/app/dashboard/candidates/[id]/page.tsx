'use client';

import { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Button,
  Chip,
  Grid,
  Divider,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material';
import { ArrowLeft, Edit, FileText, ExternalLink } from 'lucide-react';
import { useCandidate } from '@/hooks/useCandidates';
import { useInterview } from '@/hooks/useInterview';
import { SCORE_LABELS } from '@/domain/entities/interview';

const stageLabels = {
  not_done: '未実施',
  passed: '通過',
  rejected: '見送り',
  offer: '内定',
  declined: '辞退',
};

const hireLabels = {
  undecided: '未決',
  hired: '入社',
  offer_declined: '内定辞退',
};

export default function CandidateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { candidate, isLoading } = useCandidate(id);
  const { interview } = useInterview(id);

  if (isLoading || !candidate) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <Typography>読み込み中...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Button startIcon={<ArrowLeft size={18} />} onClick={() => router.back()}>
            戻る
          </Button>
          <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.main', fontSize: '1.25rem' }}>
            {candidate.name.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              {candidate.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {candidate.company_name} / {candidate.job_position_name}
            </Typography>
          </Box>
        </Box>
        <Box display="flex" gap={2}>
          {interview ? (
            <Button
              component={Link}
              href={`/dashboard/candidates/${id}/interview`}
              variant="outlined"
              startIcon={<Edit size={18} />}
            >
              評価編集
            </Button>
          ) : (
            <Button
              component={Link}
              href={`/dashboard/candidates/${id}/interview`}
              variant="contained"
              startIcon={<FileText size={18} />}
              disableElevation
            >
              評価入力
            </Button>
          )}
          <Button
            component={Link}
            href={`/dashboard/candidates/${id}/edit`}
            variant="outlined"
            startIcon={<Edit size={18} />}
          >
            基本情報編集
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardHeader title="基本情報" />
            <Divider />
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, width: 140 }}>企業</TableCell>
                    <TableCell>{candidate.company_name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>ポジション</TableCell>
                    <TableCell>
                      <Chip label={candidate.job_position_name} size="small" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>エージェント</TableCell>
                    <TableCell>
                      {candidate.agent_company_name
                        ? `${candidate.agent_company_name} (${candidate.agent_contact_name})`
                        : 'ダイレクト'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>担当者</TableCell>
                    <TableCell>{candidate.owner_user_name}</TableCell>
                  </TableRow>
                  {candidate.resume_url && (
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>履歴書</TableCell>
                      <TableCell>
                        <Button
                          href={candidate.resume_url}
                          target="_blank"
                          size="small"
                          endIcon={<ExternalLink size={14} />}
                        >
                          開く
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                  {candidate.note && (
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>備考</TableCell>
                      <TableCell sx={{ whiteSpace: 'pre-wrap' }}>{candidate.note}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardHeader title="選考ステータス" />
            <Divider />
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, width: 140 }}>0.5次面談</TableCell>
                    <TableCell>
                      <Chip
                        label={stageLabels[candidate.stage_0_5_result]}
                        color={candidate.stage_0_5_result === 'passed' ? 'success' : 'default'}
                        size="small"
                      />
                      {candidate.stage_0_5_date && (
                        <Typography variant="caption" sx={{ ml: 1 }}>
                          ({candidate.stage_0_5_date})
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>一次面談</TableCell>
                    <TableCell>
                      <Chip
                        label={stageLabels[candidate.stage_first_result]}
                        color={candidate.stage_first_result === 'passed' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>二次面談</TableCell>
                    <TableCell>
                      <Chip
                        label={stageLabels[candidate.stage_second_result]}
                        color={candidate.stage_second_result === 'passed' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>最終面談</TableCell>
                    <TableCell>
                      <Chip
                        label={stageLabels[candidate.stage_final_result]}
                        color={candidate.stage_final_result === 'offer' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>入社状況</TableCell>
                    <TableCell>
                      <Chip
                        label={hireLabels[candidate.hire_status]}
                        color={candidate.hire_status === 'hired' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>ミスマッチ</TableCell>
                    <TableCell>
                      {candidate.mismatch_flag ? (
                        <Chip label="あり" color="error" size="small" />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          なし
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

        {interview && (
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardHeader
                title="0.5次面談評価"
                action={
                  <Button
                    component={Link}
                    href={`/dashboard/candidates/${id}/interview`}
                    size="small"
                  >
                    詳細を見る
                  </Button>
                }
              />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      総合評価（外向き）
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {interview.overall_comment_external || '(未入力)'}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      評価スコア
                    </Typography>
                    <Box display="flex" gap={1} flexWrap="wrap">
                      {interview.details.map((d) => (
                        <Chip
                          key={d.id}
                          label={SCORE_LABELS[d.score_value]}
                          size="small"
                          color={d.score_value >= 3 ? 'success' : d.score_value === 2 ? 'warning' : 'error'}
                        />
                      ))}
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

