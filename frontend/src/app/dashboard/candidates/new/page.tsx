'use client';

import { useState } from 'react';
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
} from '@mui/material';
import { ArrowLeft, Save } from 'lucide-react';
import { useCandidates } from '@/hooks/useCandidates';
import { useCompanies } from '@/hooks/useCompanies';
import { useJobPositions } from '@/hooks/useJobPositions';
import { useAgents } from '@/hooks/useAgents';
import { useAuth } from '@/hooks/useAuth';
import type { CandidateCreate } from '@/domain/entities/candidate';

export default function NewCandidatePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { createCandidate } = useCandidates();
  const { companies } = useCompanies();
  const { agents } = useAgents();

  const [formData, setFormData] = useState<Partial<CandidateCreate>>({
    name: '',
    company_id: '',
    job_position_id: '',
    agent_id: '',
    resume_url: '',
    note: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { jobPositions } = useJobPositions(formData.company_id);

  const handleChange = (field: keyof CandidateCreate) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      await createCandidate({
        name: formData.name!,
        company_id: formData.company_id!,
        job_position_id: formData.job_position_id!,
        agent_id: formData.agent_id || undefined,
        resume_url: formData.resume_url || undefined,
        note: formData.note || undefined,
        owner_user_id: user.id,
      });
      router.push('/dashboard/candidates');
    } catch (error) {
      console.error('Failed to create candidate:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Button
          startIcon={<ArrowLeft size={18} />}
          onClick={() => router.back()}
        >
          戻る
        </Button>
        <Typography variant="h4">新規候補者登録</Typography>
      </Box>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="候補者名"
                  value={formData.name}
                  onChange={handleChange('name')}
                  fullWidth
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  select
                  label="クライアント企業"
                  value={formData.company_id}
                  onChange={handleChange('company_id')}
                  fullWidth
                  required
                >
                  {companies.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  select
                  label="求人ポジション"
                  value={formData.job_position_id}
                  onChange={handleChange('job_position_id')}
                  fullWidth
                  required
                  disabled={!formData.company_id}
                >
                  {jobPositions.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  select
                  label="エージェント"
                  value={formData.agent_id}
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
                  value={formData.resume_url}
                  onChange={handleChange('resume_url')}
                  fullWidth
                  placeholder="https://..."
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="備考"
                  value={formData.note}
                  onChange={handleChange('note')}
                  fullWidth
                  multiline
                  rows={4}
                />
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
                    登録
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

