export interface Company {
  id: string;
  name: string;
  note: string | null;
  created_at: string;
  updated_at: string;
}

export interface CompanyCreate {
  name: string;
  note?: string;
}

export interface CompanyUpdate {
  name?: string;
  note?: string;
}

