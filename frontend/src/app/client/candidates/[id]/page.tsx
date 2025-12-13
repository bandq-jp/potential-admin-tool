'use client';

import { use, useEffect, useState } from 'react';
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
  Link as MuiLink,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Skeleton,
} from '@mui/material';
import { ArrowLeft, Copy, ChevronDown, RefreshCcw } from 'lucide-react';
import { useClientCandidate } from '@/hooks/useClientCandidates';
import { useClientInterview } from '@/hooks/useClientInterview';
import { SCORE_LABELS } from '@/domain/entities/interview';
import { useSnackbar } from '@/components/providers/SnackbarProvider';

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
  const { showSuccess, showError } = useSnackbar();
  const {
    interview,
    isLoading: interviewLoading,
    error: interviewError,
    mutate: mutateInterview,
    getClientReport,
  } = useClientInterview(id);
  const [reportMarkdown, setReportMarkdown] = useState<string>('');
  const [reportStatus, setReportStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [reportReloadNonce, setReportReloadNonce] = useState(0);

  const handleCopyReport = async () => {
    if (!interview) return;
    try {
      const result = await getClientReport(interview.id);
      await navigator.clipboard.writeText(result.markdown);
      showSuccess('レポートをコピーしました');
    } catch (e) {
      console.error(e);
      showError('レポートの取得に失敗しました');
    }
  };

  useEffect(() => {
    const interviewId = interview?.id;
    if (!interviewId) {
      setReportMarkdown('');
      setReportStatus('idle');
      return;
    }

    let cancelled = false;
    const load = async () => {
      try {
        setReportStatus('loading');
        const result = await getClientReport(interviewId);
        if (!cancelled) {
          setReportMarkdown(result.markdown);
          setReportStatus('success');
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) setReportStatus('error');
      }
    };
    load();

    return () => {
      cancelled = true;
    };
  }, [interview?.id, getClientReport, reportReloadNonce]);

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

        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader
              title="0.5次面談ログ（外向き）"
              action={
                interview ? (
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Copy size={16} />}
                    onClick={handleCopyReport}
                  >
                    レポートコピー
                  </Button>
                ) : undefined
              }
            />
            <Divider />
            <CardContent>
              {interviewLoading && (
                <>
                  <Skeleton variant="text" width={180} />
                  <Skeleton variant="rounded" height={120} sx={{ mt: 2 }} />
                  <Skeleton variant="rounded" height={120} sx={{ mt: 2 }} />
                </>
              )}

              {!interviewLoading && interviewError && (
                <Alert
                  severity="error"
                  action={
                    <Button
                      color="inherit"
                      size="small"
                      startIcon={<RefreshCcw size={16} />}
                      onClick={() => mutateInterview()}
                    >
                      再試行
                    </Button>
                  }
                  sx={{ mb: 2 }}
                >
                  0.5次面談ログを取得できませんでした。
                </Alert>
              )}

              {!interviewLoading && !interview && !interviewError && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  0.5次面談ログはまだ共有されていません。共有後に、面談情報・議事録・総合所感（外向き）が表示されます。
                </Alert>
              )}

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 5 }}>
                  <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                    面談情報
                  </Typography>
                  <Card variant="outlined" sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Table size="small">
                        <TableBody>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 600, width: 140 }}>面談日</TableCell>
                            <TableCell>
                              {interview?.interview_date ?? candidate.stage_0_5_date ?? '-'}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>議事録ソース</TableCell>
                            <TableCell>{interview?.transcript_source ?? '-'}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>議事録URL</TableCell>
                            <TableCell>
                              {interview?.transcript_url ? (
                                <MuiLink href={interview.transcript_url} target="_blank" rel="noreferrer">
                                  開く
                                </MuiLink>
                              ) : (
                                '-'
                              )}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 7 }}>
                  <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                    総合所感 / Will / アトラクト（外向き）
                  </Typography>
                  <Card variant="outlined" sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Box display="flex" flexDirection="column" gap={2}>
                        <Box>
                          <Typography variant="caption" color="text.secondary" fontWeight={700}>
                            総合所感
                          </Typography>
                          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mt: 0.5 }}>
                            {interview?.overall_comment_external || '(未入力)'}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary" fontWeight={700}>
                            Will（志向性）
                          </Typography>
                          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mt: 0.5 }}>
                            {interview?.will_text_external || '(未入力)'}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary" fontWeight={700}>
                            アトラクトポイント
                          </Typography>
                          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mt: 0.5 }}>
                            {interview?.attract_text_external || '(未入力)'}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                    議事録
                  </Typography>

                  <Accordion disableGutters sx={{ borderRadius: 2, '&:before': { display: 'none' } }}>
                    <AccordionSummary expandIcon={<ChevronDown size={18} />}>
                      <Typography fontWeight={700}>クライアント提出用レポート</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {!interview && (
                        <Typography variant="body2" color="text.secondary">
                          レポートはまだありません。
                        </Typography>
                      )}
                      {interview && (reportStatus === 'idle' || reportStatus === 'loading') && (
                        <Box>
                          <Skeleton variant="text" />
                          <Skeleton variant="text" />
                          <Skeleton variant="text" />
                        </Box>
                      )}
                      {interview && reportStatus === 'error' && (
                        <Alert
                          severity="warning"
                          action={
                            <Button
                              color="inherit"
                              size="small"
                              startIcon={<RefreshCcw size={16} />}
                              onClick={() => setReportReloadNonce((n) => n + 1)}
                            >
                              再取得
                            </Button>
                          }
                          sx={{ mb: 2 }}
                        >
                          レポートの取得に失敗しました。
                        </Alert>
                      )}
                      {interview && reportStatus === 'success' && !reportMarkdown && (
                        <Typography variant="body2" color="text.secondary">
                          レポートはまだありません。
                        </Typography>
                      )}
                      {interview && reportStatus === 'success' && reportMarkdown && (
                        <Box
                          component="pre"
                          sx={{
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            fontFamily:
                              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                            fontSize: '0.875rem',
                            m: 0,
                          }}
                        >
                          {reportMarkdown}
                        </Box>
                      )}
                    </AccordionDetails>
                  </Accordion>

                  <Accordion disableGutters sx={{ borderRadius: 2, mt: 1, '&:before': { display: 'none' } }}>
                    <AccordionSummary expandIcon={<ChevronDown size={18} />}>
                      <Typography fontWeight={700}>文字起こし</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {!interview?.transcript_raw_text && (
                        <Typography variant="body2" color="text.secondary">
                          文字起こしはまだありません。
                        </Typography>
                      )}
                      {interview?.transcript_raw_text && (
                        <Box
                          component="pre"
                          sx={{
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            fontFamily:
                              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                            fontSize: '0.875rem',
                            m: 0,
                          }}
                        >
                          {interview.transcript_raw_text}
                        </Box>
                      )}
                    </AccordionDetails>
                  </Accordion>
                </Grid>

                {interview && (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                      評価スコア
                    </Typography>
                    <Box display="flex" gap={1} flexWrap="wrap">
                      {interview.details.length === 0 && (
                        <Typography variant="body2" color="text.secondary">
                          スコアはまだありません。
                        </Typography>
                      )}
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
                )}

                {interview && interview.question_responses.length > 0 && (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                      主な質問と回答
                    </Typography>
                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                      <CardContent>
                        <Box display="flex" flexDirection="column" gap={2}>
                          {interview.question_responses.map((q) => (
                            <Box key={q.id}>
                              <Typography variant="body2" fontWeight={700}>
                                Q. {q.question_text}
                              </Typography>
                              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mt: 0.5 }}>
                                {q.answer_summary || '(回答なし)'}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
