export type StageResult = 'not_done' | 'passed' | 'rejected';
export type FinalStageResult = 'not_done' | 'offer' | 'rejected' | 'declined';
export type HireStatus = 'undecided' | 'hired' | 'offer_declined';

export interface Candidate {
  id: string;
  company_id: string;
  job_position_id: string;
  agent_id: string | null;
  name: string;
  resume_url: string | null;
  owner_user_id: string;
  note: string | null;
  stage_0_5_result: StageResult;
  stage_first_result: StageResult;
  stage_second_result: StageResult;
  stage_final_result: FinalStageResult;
  hire_status: HireStatus;
  mismatch_flag: boolean;
  stage_0_5_date: string | null;
  stage_first_date: string | null;
  stage_final_decision_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface CandidateWithRelations extends Candidate {
  company_name: string | null;
  job_position_name: string | null;
  agent_company_name: string | null;
  agent_contact_name: string | null;
  owner_user_name: string | null;
}

export interface CandidateCreate {
  company_id: string;
  job_position_id: string;
  agent_id?: string;
  name: string;
  resume_url?: string;
  owner_user_id: string;
  note?: string;
}

export interface CandidateUpdate {
  job_position_id?: string;
  agent_id?: string;
  name?: string;
  resume_url?: string;
  owner_user_id?: string;
  note?: string;
  stage_0_5_result?: StageResult;
  stage_first_result?: StageResult;
  stage_second_result?: StageResult;
  stage_final_result?: FinalStageResult;
  hire_status?: HireStatus;
  mismatch_flag?: boolean;
  stage_0_5_date?: string;
  stage_first_date?: string;
  stage_final_decision_date?: string;
}

export interface FunnelStats {
  total: number;
  stage_0_5_done: number;
  stage_0_5_passed: number;
  stage_first_done: number;
  stage_first_passed: number;
  stage_second_done: number;
  stage_second_passed: number;
  stage_final_done: number;
  stage_final_offer: number;
  hired: number;
  mismatch: number;
}

export interface MonthlyStats {
  active_candidates: number;
  hired: number;
  mismatch: number;
  stage_0_5_done: number;
  stage_0_5_passed: number;
}

export interface DashboardStats {
  active_candidates: number;
  pending_interviews: number;
  hired_this_month: number;
  mismatch_count: number;
  stage_0_5_pass_rate: number;
  stage_0_5_done_count: number;
  current_month: MonthlyStats;
  previous_month: MonthlyStats;
  active_trend_percent: number | null;
  hired_trend_percent: number | null;
}

