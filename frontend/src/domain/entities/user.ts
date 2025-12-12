export type UserRole = 'admin' | 'interviewer' | 'client';

export interface User {
  id: string;
  clerk_id: string;
  name: string;
  email: string;
  role: UserRole;
  company_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserUpdate {
  name?: string;
  role?: UserRole;
  company_id?: string | null;
}
