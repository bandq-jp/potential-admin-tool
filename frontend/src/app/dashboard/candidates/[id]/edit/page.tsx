'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  MenuItem,
  Grid,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { ArrowLeft, Save } from 'lucide-react';
import { useCandidate, useCandidates } from '@/hooks/useCandidates';
import { useJobPositions } from '@/hooks/useJobPositions';
import { useAgents } from '@/hooks/useAgents';
import type { CandidateUpdate, StageResult, FinalStageResult, HireStatus } from '@/domain/entities/candidate';

export default function EditCandidatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { candidate, isLoading } = useCandidate(id);
  const { updateCandidate } = useCandidates();
  const { agents } = useAgents();

  const [formData, setFormData] = useState<CandidateUpdate>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { jobPositions } = useJobPositions(candidate?.company_id);

  useEffect(() => {
    if (candidate) {
      setFormData({
        name: candidate.name,
        job_position_id: candidate.job_position_id,
        agent_id: candidate.agent_id ?? undefined,
        resume_url: candidate.resume_url ?? undefined,
        note: candidate.note ?? undefined,
        stage_0_5_result: candidate.stage_0_5_result,
        stage_0_5_date: candidate.stage_0_5_date ?? undefined,
        stage_first_result: candidate.stage_first_result,
        stage_first_date: candidate.stage_first_date ?? undefined,
        stage_second_result: candidate.stage_second_result,
        stage_final_result: candidate.stage_final_result,
        stage_final_decision_date: candidate.stage_final_decision_date ?? undefined,
        hire_status: candidate.hire_status,
        mismatch_flag: candidate.mismatch_flag,
      });
    }
  }, [candidate]);

  const handleChange = (field: keyof CandidateUpdate) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateCandidate(id, formData);
      router.push(`/dashboard/candidates/${id}`);
    } catch (error) {
      console.error('Failed to update candidate:', error);
    } finally {
      setIsSubmitting(false);
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
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Button startIcon={<ArrowLeft size={18} />} onClick={() => router.back()}>
          戻る
        </Button>
        <Typography variant="h4">候補者編集: {candidate.name}</Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  基本情報
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="候補者名"
                      value={formData.name ?? ''}
                      onChange={handleChange('name')}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      select
                      label="求人ポジション"
                      value={formData.job_position_id ?? ''}
                      onChange={handleChange('job_position_id')}
                      fullWidth
                    >
                      {jobPositions.map((p) => (
                        <MenuItem key={p.id} value={p.id}>
                          {p.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      select
                      label="エージェント"
                      value={formData.agent_id ?? ''}
                      onChange={handleChange('agent_id')}
                      fullWidth
                    >
                      <MenuItem value="">なし（ダイレクト）</MenuItem>
                      {agents.map((a) => (
                        <MenuItem key={a.id} value={a.id}>
                          {a.company_name} - {a.contact_name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="履歴書URL"
                      value={formData.resume_url ?? ''}
                      onChange={handleChange('resume_url')}
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="備考"
                      value={formData.note ?? ''}
                      onChange={handleChange('note')}
                      fullWidth
                      multiline
                      rows={3}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  選考ステータス
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      select
                      label="0.5次結果"
                      value={formData.stage_0_5_result ?? 'not_done'}
                      onChange={handleChange('stage_0_5_result')}
                      fullWidth
                    >
                      <MenuItem value="not_done">未実施</MenuItem>
                      <MenuItem value="passed">通過</MenuItem>
                      <MenuItem value="rejected">見送り</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      type="date"
                      label="0.5次日付"
                      value={formData.stage_0_5_date ?? ''}
                      onChange={handleChange('stage_0_5_date')}
                      fullWidth
                      slotProps={{ inputLabel: { shrink: true } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      select
                      label="一次結果"
                      value={formData.stage_first_result ?? 'not_done'}
                      onChange={handleChange('stage_first_result')}
                      fullWidth
                    >
                      <MenuItem value="not_done">未実施</MenuItem>
                      <MenuItem value="passed">通過</MenuItem>
                      <MenuItem value="rejected">見送り</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      type="date"
                      label="一次日付"
                      value={formData.stage_first_date ?? ''}
                      onChange={handleChange('stage_first_date')}
                      fullWidth
                      slotProps={{ inputLabel: { shrink: true } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      select
                      label="二次結果"
                      value={formData.stage_second_result ?? 'not_done'}
                      onChange={handleChange('stage_second_result')}
                      fullWidth
                    >
                      <MenuItem value="not_done">未実施</MenuItem>
                      <MenuItem value="passed">通過</MenuItem>
                      <MenuItem value="rejected">見送り</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      select
                      label="最終結果"
                      value={formData.stage_final_result ?? 'not_done'}
                      onChange={handleChange('stage_final_result')}
                      fullWidth
                    >
                      <MenuItem value="not_done">未実施</MenuItem>
                      <MenuItem value="offer">内定</MenuItem>
                      <MenuItem value="rejected">見送り</MenuItem>
                      <MenuItem value="declined">辞退</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      select
                      label="入社状況"
                      value={formData.hire_status ?? 'undecided'}
                      onChange={handleChange('hire_status')}
                      fullWidth
                    >
                      <MenuItem value="undecided">未決</MenuItem>
                      <MenuItem value="hired">入社</MenuItem>
                      <MenuItem value="offer_declined">内定辞退</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.mismatch_flag ?? false}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              mismatch_flag: e.target.checked,
                            }))
                          }
                        />
                      }
                      label="ミスマッチ"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Box display="flex" gap={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={() => router.back()}>
                キャンセル
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<Save size={18} />}
                disabled={isSubmitting}
                disableElevation
              >
                保存
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}

