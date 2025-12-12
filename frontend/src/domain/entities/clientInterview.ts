export interface ClientInterviewDetail {
  id: string;
  interview_id: string;
  criteria_item_id: string;
  score_value: number;
  comment_external: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClientInterviewQuestionResponse {
  id: string;
  interview_id: string;
  criteria_item_id: string | null;
  question_text: string;
  answer_summary: string | null;
  transcript_reference: string | null;
  is_highlight: boolean;
  created_at: string;
  updated_at: string;
}

export interface ClientInterviewWithDetails {
  id: string;
  candidate_id: string;
  interview_date: string;
  overall_comment_external: string | null;
  will_text_external: string | null;
  attract_text_external: string | null;
  client_report_markdown: string | null;
  created_at: string;
  updated_at: string;
  details: ClientInterviewDetail[];
  question_responses: ClientInterviewQuestionResponse[];
}

