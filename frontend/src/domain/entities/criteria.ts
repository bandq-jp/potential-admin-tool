export interface CriteriaGroup {
  id: string;
  job_position_id: string;
  label: string;
  description: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CriteriaItem {
  id: string;
  criteria_group_id: string;
  label: string;
  description: string | null;
  behavior_examples_text: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CriteriaGroupWithItems extends CriteriaGroup {
  items: CriteriaItem[];
}

export interface CriteriaGroupCreate {
  job_position_id: string;
  label: string;
  description?: string;
  sort_order?: number;
}

export interface CriteriaItemCreate {
  criteria_group_id: string;
  label: string;
  description?: string;
  behavior_examples_text?: string;
  sort_order?: number;
  is_active?: boolean;
}

