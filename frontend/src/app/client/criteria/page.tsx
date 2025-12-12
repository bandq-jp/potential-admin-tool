'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from '@mui/material';
import { ChevronDown } from 'lucide-react';
import { useClientJobPositions } from '@/hooks/useClientJobPositions';
import { useClientCriteria } from '@/hooks/useClientCriteria';

export default function ClientCriteriaPage() {
  const { jobPositions } = useClientJobPositions();
  const [selectedPositionId, setSelectedPositionId] = useState<string>('');

  useEffect(() => {
    if (!selectedPositionId && jobPositions.length > 0) {
      setSelectedPositionId(jobPositions[0].id);
    }
  }, [jobPositions, selectedPositionId]);

  const { criteriaGroups, isLoading } = useClientCriteria(selectedPositionId);

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        評価軸（定性要件）
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            select
            label="ポジション"
            value={selectedPositionId}
            onChange={(e) => setSelectedPositionId(e.target.value)}
            size="small"
            sx={{ minWidth: 280 }}
          >
            {jobPositions.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </TextField>
        </CardContent>
      </Card>

      {isLoading && (
        <Typography color="text.secondary">読み込み中...</Typography>
      )}

      {!isLoading && criteriaGroups.length === 0 && (
        <Typography color="text.secondary">評価軸がまだ登録されていません。</Typography>
      )}

      {criteriaGroups.map((group) => (
        <Accordion key={group.id} defaultExpanded>
          <AccordionSummary expandIcon={<ChevronDown size={18} />}>
            <Typography fontWeight={700}>{group.label}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {group.description && (
              <Typography variant="body2" color="text.secondary" mb={2}>
                {group.description}
              </Typography>
            )}
            <Box display="flex" flexDirection="column" gap={2}>
              {group.items.map((item) => (
                <Box key={item.id}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {item.label}
                  </Typography>
                  {item.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                      {item.description}
                    </Typography>
                  )}
                  {item.behavior_examples_text && (
                    <>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                        {item.behavior_examples_text}
                      </Typography>
                    </>
                  )}
                </Box>
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}

