import { SignUp } from '@clerk/nextjs';
import { Box, Typography } from '@mui/material';
import { Briefcase } from 'lucide-react';

export default function SignUpPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f8fafc',
        p: 3,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            bgcolor: 'primary.main',
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          <Briefcase size={24} />
        </Box>
        <Typography variant="h5" fontWeight={800} color="primary">
          RecruitLog
        </Typography>
      </Box>
      <SignUp afterSignUpUrl="/dashboard" signInUrl="/sign-in" />
    </Box>
  );
}

