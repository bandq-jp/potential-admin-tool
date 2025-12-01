export interface Agent {
  id: string;
  company_name: string;
  contact_name: string;
  contact_email: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
}

export interface AgentCreate {
  company_name: string;
  contact_name: string;
  contact_email?: string;
  note?: string;
}

export interface AgentUpdate {
  company_name?: string;
  contact_name?: string;
  contact_email?: string;
  note?: string;
}

export interface AgentStats {
  id: string;
  company_name: string;
  contact_name: string;
  referral_count: number;
  stage_0_5_pass_rate: number;
  final_offer_rate: number;
  mismatch_rate: number;
}

