export type UserRole = 'admin' | 'interviewer';

export interface User {
  id: string;
  clerk_id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

