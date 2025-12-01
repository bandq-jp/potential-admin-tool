export interface JobPosition {
  id: string;
  company_id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface JobPositionCreate {
  company_id: string;
  name: string;
  description?: string;
  is_active?: boolean;
}

export interface JobPositionUpdate {
  name?: string;
  description?: string;
  is_active?: boolean;
}

