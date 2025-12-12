'use client';

import { use } from 'react';
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
import { ArrowLeft, Copy } from 'lucide-react';
import { useClientCandidate } from '@/hooks/useClientCandidates';
import { useClientInterview } from '@/hooks/useClientInterview';
import { SCORE_LABELS } from '@/domain/entities/interview';

const stageLabels: Record<string, string> = {
  not_done: '未実施',
  passed: '通過',
  rejected: '見送り',
  offer: '内定',
  declined: '辞退',
};

const hireLabels: Record<string, string> = {
  undecided: '未決',
  hired: '入社',
  offer_declined: '内定辞退',
};

export default function ClientCandidateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { candidate, isLoading } = useClientCandidate(id);
  const { interview, getClientReport } = useClientInterview(id);

  const handleCopyReport = async () => {
    if (!interview) return;
    try {
      const result = await getClientReport(interview.id);
      await navigator.clipboard.writeText(result.markdown);
      alert('レポートをコピーしました');
    } catch (e) {
      console.error(e);
    }
  };

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
        {interview && (
          <Button
            variant="outlined"
            startIcon={<Copy size={18} />}
            onClick={handleCopyReport}
          >
            レポートコピー
          </Button>
        )}
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
                  {candidate.resume_url && (
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>履歴書</TableCell>
                      <TableCell>
                        <Button href={candidate.resume_url} target="_blank" size="small">
                          開く
                        </Button>
                      </TableCell>
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
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

        {interview && (
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardHeader title="0.5次面談評価（外向き）" />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      総合評価
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

                  {interview.will_text_external && (
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        Will（志向性）
                      </Typography>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                        {interview.will_text_external}
                      </Typography>
                    </Grid>
                  )}

                  {interview.attract_text_external && (
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        アトラクトポイント
                      </Typography>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                        {interview.attract_text_external}
                      </Typography>
                    </Grid>
                  )}

                  {interview.question_responses.length > 0 && (
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        主な質問と回答
                      </Typography>
                      <Box display="flex" flexDirection="column" gap={2}>
                        {interview.question_responses.map((q) => (
                          <Box key={q.id}>
                            <Typography variant="body2" fontWeight={600}>
                              Q. {q.question_text}
                            </Typography>
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mt: 0.5 }}>
                              {q.answer_summary || '(回答なし)'}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

