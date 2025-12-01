'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Grid,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  ArrowLeft,
  Save,
  Copy,
  Plus,
  Trash2,
  ChevronDown,
  Star,
} from 'lucide-react';
import { useCandidate } from '@/hooks/useCandidates';
import { useInterview } from '@/hooks/useInterview';
import { useCriteria } from '@/hooks/useCriteria';
import { useAuth } from '@/hooks/useAuth';
import { SCORE_OPTIONS, SCORE_LABELS } from '@/domain/entities/interview';
import type {
  InterviewDetailCreate,
  InterviewQuestionResponseCreate,
} from '@/domain/entities/interview';

export default function InterviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: candidateId } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const { candidate } = useCandidate(candidateId);
  const {
    interview,
    createInterview,
    updateInterview,
    saveDetails,
    addQuestionResponse,
    deleteQuestionResponse,
    generateClientReport,
    generateAgentReport,
  } = useInterview(candidateId);
  const { criteriaGroups } = useCriteria(candidate?.job_position_id ?? '');

  const [interviewDate, setInterviewDate] = useState('');
  const [overallExternal, setOverallExternal] = useState('');
  const [overallInternal, setOverallInternal] = useState('');
  const [willExternal, setWillExternal] = useState('');
  const [willInternal, setWillInternal] = useState('');
  const [attractExternal, setAttractExternal] = useState('');
  const [attractInternal, setAttractInternal] = useState('');
  const [transcriptText, setTranscriptText] = useState('');
  const [transcriptSource, setTranscriptSource] = useState('');

  const [scores, setScores] = useState<Record<string, number>>({});
  const [commentExternal, setCommentExternal] = useState<Record<string, string>>({});
  const [commentInternal, setCommentInternal] = useState<Record<string, string>>({});

  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  });

  useEffect(() => {
    if (interview) {
      setInterviewDate(interview.interview_date);
      setOverallExternal(interview.overall_comment_external ?? '');
      setOverallInternal(interview.overall_comment_internal ?? '');
      setWillExternal(interview.will_text_external ?? '');
      setWillInternal(interview.will_text_internal ?? '');
      setAttractExternal(interview.attract_text_external ?? '');
      setAttractInternal(interview.attract_text_internal ?? '');
      setTranscriptText(interview.transcript_raw_text ?? '');
      setTranscriptSource(interview.transcript_source ?? '');

      const scoreMap: Record<string, number> = {};
      const extMap: Record<string, string> = {};
      const intMap: Record<string, string> = {};
      interview.details.forEach((d) => {
        scoreMap[d.criteria_item_id] = d.score_value;
        extMap[d.criteria_item_id] = d.comment_external ?? '';
        intMap[d.criteria_item_id] = d.comment_internal ?? '';
      });
      setScores(scoreMap);
      setCommentExternal(extMap);
      setCommentInternal(intMap);
    } else {
      setInterviewDate(new Date().toISOString().split('T')[0]);
    }
  }, [interview]);

  const handleSave = async () => {
    if (!user || !candidate) return;
    setIsSaving(true);

    try {
      let interviewId = interview?.id;

      if (!interview) {
        const created = await createInterview({
          candidate_id: candidateId,
          interviewer_id: user.id,
          interview_date: interviewDate,
        });
        interviewId = created.id;
      }

      if (interviewId) {
        await updateInterview(interviewId, {
          interview_date: interviewDate,
          overall_comment_external: overallExternal,
          overall_comment_internal: overallInternal,
          will_text_external: willExternal,
          will_text_internal: willInternal,
          attract_text_external: attractExternal,
          attract_text_internal: attractInternal,
          transcript_raw_text: transcriptText,
          transcript_source: transcriptSource,
        });

        const details: InterviewDetailCreate[] = Object.entries(scores).map(
          ([criteriaItemId, scoreValue]) => ({
            criteria_item_id: criteriaItemId,
            score_value: scoreValue,
            comment_external: commentExternal[criteriaItemId] || undefined,
            comment_internal: commentInternal[criteriaItemId] || undefined,
          })
        );

        if (details.length > 0) {
          await saveDetails(interviewId, details);
        }
      }

      setSnackbar({ open: true, message: '保存しました' });
    } catch (error) {
      console.error('Failed to save interview:', error);
      setSnackbar({ open: true, message: '保存に失敗しました' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddQuestion = async () => {
    if (!interview || !newQuestion.trim()) return;

    await addQuestionResponse(interview.id, {
      question_text: newQuestion,
      answer_summary: newAnswer || undefined,
      is_highlight: false,
    });
    setNewQuestion('');
    setNewAnswer('');
  };

  const handleCopyReport = async (type: 'client' | 'agent') => {
    if (!interview) return;

    try {
      const result =
        type === 'client'
          ? await generateClientReport(interview.id)
          : await generateAgentReport(interview.id);

      await navigator.clipboard.writeText(result.markdown);
      setSnackbar({
        open: true,
        message: `${type === 'client' ? 'クライアント' : 'エージェント'}向けレポートをコピーしました`,
      });
    } catch (error) {
      console.error('Failed to generate report:', error);
    }
  };

  if (!candidate) {
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
          <Typography variant="h4">0.5次面談評価</Typography>
          <Chip label={candidate.name} />
        </Box>
        <Box display="flex" gap={2}>
          {interview && (
            <>
              <Button
                variant="outlined"
                startIcon={<Copy size={18} />}
                onClick={() => handleCopyReport('client')}
              >
                クライアント向けコピー
              </Button>
              <Button
                variant="outlined"
                startIcon={<Copy size={18} />}
                onClick={() => handleCopyReport('agent')}
              >
                エージェント向けコピー
              </Button>
            </>
          )}
          <Button
            variant="contained"
            startIcon={<Save size={18} />}
            onClick={handleSave}
            disabled={isSaving}
            disableElevation
          >
            保存
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ mb: 3 }}>
            <CardHeader title="面談情報" />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    type="date"
                    label="面談日"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="文字起こしソース"
                    value={transcriptSource}
                    onChange={(e) => setTranscriptSource(e.target.value)}
                    fullWidth
                    placeholder="Zoom / Meet / Notta など"
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="文字起こしテキスト"
                    value={transcriptText}
                    onChange={(e) => setTranscriptText(e.target.value)}
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="オンライン面談の文字起こしを貼り付け..."
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardHeader title="定性要件別評価" />
            <Divider />
            <CardContent>
              {criteriaGroups.length === 0 ? (
                <Alert severity="info">
                  このポジションには定性要件が設定されていません。
                  マスタ管理から設定してください。
                </Alert>
              ) : (
                criteriaGroups.map((group) => (
                  <Accordion key={group.id} defaultExpanded>
                    <AccordionSummary expandIcon={<ChevronDown />}>
                      <Typography fontWeight={600}>{group.label}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {group.items.map((item) => (
                        <Box key={item.id} sx={{ mb: 3, pl: 2 }}>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            mb={1}
                          >
                            <Typography variant="subtitle2" fontWeight={600}>
                              {item.label}
                            </Typography>
                            <ToggleButtonGroup
                              value={scores[item.id] ?? null}
                              exclusive
                              onChange={(_, value) => {
                                if (value !== null) {
                                  setScores((prev) => ({ ...prev, [item.id]: value }));
                                }
                              }}
                              size="small"
                            >
                              {SCORE_OPTIONS.map((opt) => (
                                <ToggleButton
                                  key={opt.value}
                                  value={opt.value}
                                  sx={{
                                    px: 2,
                                    fontWeight: 700,
                                    '&.Mui-selected': {
                                      bgcolor:
                                        opt.value >= 3
                                          ? 'success.light'
                                          : opt.value === 2
                                          ? 'warning.light'
                                          : 'error.light',
                                    },
                                  }}
                                >
                                  {opt.label}
                                </ToggleButton>
                              ))}
                            </ToggleButtonGroup>
                          </Box>
                          {item.description && (
                            <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                              {item.description}
                            </Typography>
                          )}
                          <Grid container spacing={1}>
                            <Grid size={{ xs: 6 }}>
                              <TextField
                                label="外向きコメント"
                                value={commentExternal[item.id] ?? ''}
                                onChange={(e) =>
                                  setCommentExternal((prev) => ({
                                    ...prev,
                                    [item.id]: e.target.value,
                                  }))
                                }
                                fullWidth
                                size="small"
                                multiline
                                rows={2}
                              />
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                              <TextField
                                label="内部メモ"
                                value={commentInternal[item.id] ?? ''}
                                onChange={(e) =>
                                  setCommentInternal((prev) => ({
                                    ...prev,
                                    [item.id]: e.target.value,
                                  }))
                                }
                                fullWidth
                                size="small"
                                multiline
                                rows={2}
                              />
                            </Grid>
                          </Grid>
                        </Box>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="質問・回答ログ (Q&A)" />
            <Divider />
            <CardContent>
              {interview?.question_responses.map((qr) => (
                <Box
                  key={qr.id}
                  sx={{ mb: 2, p: 2, bgcolor: 'background.default', borderRadius: 2 }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="start">
                    <Box flex={1}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Q: {qr.question_text}
                      </Typography>
                      {qr.answer_summary && (
                        <Typography variant="body2" color="text.secondary" mt={0.5}>
                          A: {qr.answer_summary}
                        </Typography>
                      )}
                    </Box>
                    <Box display="flex" gap={1}>
                      <IconButton
                        size="small"
                        color={qr.is_highlight ? 'warning' : 'default'}
                        title="レポートに含める"
                      >
                        <Star size={16} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => deleteQuestionResponse(qr.id)}
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              ))}
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="質問"
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="回答要約"
                      value={newAnswer}
                      onChange={(e) => setNewAnswer(e.target.value)}
                      fullWidth
                      size="small"
                      multiline
                      rows={2}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Button
                      startIcon={<Plus size={16} />}
                      onClick={handleAddQuestion}
                      disabled={!newQuestion.trim()}
                    >
                      Q&A追加
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ mb: 3 }}>
            <CardHeader title="総合所感" />
            <Divider />
            <CardContent>
              <TextField
                label="外向き（クライアント向け）"
                value={overallExternal}
                onChange={(e) => setOverallExternal(e.target.value)}
                fullWidth
                multiline
                rows={4}
                sx={{ mb: 2 }}
              />
              <TextField
                label="内部メモ"
                value={overallInternal}
                onChange={(e) => setOverallInternal(e.target.value)}
                fullWidth
                multiline
                rows={4}
              />
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardHeader title="Will（志向性）" />
            <Divider />
            <CardContent>
              <TextField
                label="外向き"
                value={willExternal}
                onChange={(e) => setWillExternal(e.target.value)}
                fullWidth
                multiline
                rows={3}
                sx={{ mb: 2 }}
              />
              <TextField
                label="内部メモ"
                value={willInternal}
                onChange={(e) => setWillInternal(e.target.value)}
                fullWidth
                multiline
                rows={3}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="アトラクトポイント" />
            <Divider />
            <CardContent>
              <TextField
                label="外向き"
                value={attractExternal}
                onChange={(e) => setAttractExternal(e.target.value)}
                fullWidth
                multiline
                rows={3}
                sx={{ mb: 2 }}
              />
              <TextField
                label="内部メモ"
                value={attractInternal}
                onChange={(e) => setAttractInternal(e.target.value)}
                fullWidth
                multiline
                rows={3}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  );
}

