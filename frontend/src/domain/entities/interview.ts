export interface Interview {
  id: string;
  candidate_id: string;
  interviewer_id: string;
  interview_date: string;
  overall_comment_external: string | null;
  overall_comment_internal: string | null;
  will_text_external: string | null;
  will_text_internal: string | null;
  attract_text_external: string | null;
  attract_text_internal: string | null;
  transcript_raw_text: string | null;
  transcript_source: string | null;
  transcript_url: string | null;
  client_report_markdown: string | null;
  agent_report_markdown: string | null;
  created_at: string;
  updated_at: string;
}

export interface InterviewDetail {
  id: string;
  interview_id: string;
  criteria_item_id: string;
  score_value: number;
  comment_external: string | null;
  comment_internal: string | null;
  created_at: string;
  updated_at: string;
}

export interface InterviewQuestionResponse {
  id: string;
  interview_id: string;
  criteria_item_id: string | null;
  question_text: string;
  answer_summary: string | null;
  hypothesis_text: string | null;
  transcript_reference: string | null;
  is_highlight: boolean;
  created_at: string;
  updated_at: string;
}

export interface InterviewWithDetails extends Interview {
  details: InterviewDetail[];
  question_responses: InterviewQuestionResponse[];
}

export interface InterviewCreate {
  candidate_id: string;
  interviewer_id: string;
  interview_date: string;
}

export interface InterviewUpdate {
  interview_date?: string;
  overall_comment_external?: string;
  overall_comment_internal?: string;
  will_text_external?: string;
  will_text_internal?: string;
  attract_text_external?: string;
  attract_text_internal?: string;
  transcript_raw_text?: string;
  transcript_source?: string;
  transcript_url?: string;
}

export interface InterviewDetailCreate {
  criteria_item_id: string;
  score_value: number;
  comment_external?: string;
  comment_internal?: string;
}

export interface InterviewQuestionResponseCreate {
  criteria_item_id?: string;
  question_text: string;
  answer_summary?: string;
  hypothesis_text?: string;
  transcript_reference?: string;
  is_highlight?: boolean;
}

export const SCORE_LABELS: Record<number, string> = {
  1: '×',
  2: '△',
  3: '◯',
  4: '◎',
};

export const SCORE_OPTIONS = [
  { value: 4, label: '◎' },
  { value: 3, label: '◯' },
  { value: 2, label: '△' },
  { value: 1, label: '×' },
];

