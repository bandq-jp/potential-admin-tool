import type { StageResult, FinalStageResult, HireStatus } from './candidate';

export interface ClientCandidate {
  id: string;
  company_id: string;
  job_position_id: string;
  name: string;
  resume_url: string | null;
  stage_0_5_result: StageResult;
  stage_first_result: StageResult;
  stage_second_result: StageResult;
  stage_final_result: FinalStageResult;
  hire_status: HireStatus;
  stage_0_5_date: string | null;
  stage_first_date: string | null;
  stage_final_decision_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClientCandidateWithRelations extends ClientCandidate {
  company_name: string | null;
  job_position_name: string | null;
}

