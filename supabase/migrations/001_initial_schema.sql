-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'interviewer' CHECK (role IN ('admin', 'interviewer')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE INDEX idx_users_email ON users(email);

-- Companies table
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_flag BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_companies_deleted ON companies(deleted_flag);

-- Job Positions table
CREATE TABLE job_positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_job_positions_company ON job_positions(company_id);
CREATE INDEX idx_job_positions_active ON job_positions(is_active);

-- Agents table
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255),
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_flag BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_agents_deleted ON agents(deleted_flag);

-- Criteria Groups table (大項目)
CREATE TABLE criteria_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_position_id UUID NOT NULL REFERENCES job_positions(id) ON DELETE CASCADE,
    label VARCHAR(255) NOT NULL,
    description TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_flag BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_criteria_groups_position ON criteria_groups(job_position_id);
CREATE INDEX idx_criteria_groups_deleted ON criteria_groups(deleted_flag);

-- Criteria Items table (中項目 - スコア対象)
CREATE TABLE criteria_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    criteria_group_id UUID NOT NULL REFERENCES criteria_groups(id) ON DELETE CASCADE,
    label VARCHAR(255) NOT NULL,
    description TEXT,
    behavior_examples_text TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_criteria_items_group ON criteria_items(criteria_group_id);
CREATE INDEX idx_criteria_items_active ON criteria_items(is_active);

-- Candidates table
CREATE TABLE candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    job_position_id UUID NOT NULL REFERENCES job_positions(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    resume_url TEXT,
    owner_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    note TEXT,
    
    -- Selection stages
    stage_0_5_result VARCHAR(50) NOT NULL DEFAULT 'not_done' CHECK (stage_0_5_result IN ('not_done', 'passed', 'rejected')),
    stage_first_result VARCHAR(50) NOT NULL DEFAULT 'not_done' CHECK (stage_first_result IN ('not_done', 'passed', 'rejected')),
    stage_second_result VARCHAR(50) NOT NULL DEFAULT 'not_done' CHECK (stage_second_result IN ('not_done', 'passed', 'rejected')),
    stage_final_result VARCHAR(50) NOT NULL DEFAULT 'not_done' CHECK (stage_final_result IN ('not_done', 'offer', 'rejected', 'declined')),
    hire_status VARCHAR(50) NOT NULL DEFAULT 'undecided' CHECK (hire_status IN ('undecided', 'hired', 'offer_declined')),
    mismatch_flag BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Stage dates
    stage_0_5_date DATE,
    stage_first_date DATE,
    stage_final_decision_date DATE,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_flag BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_candidates_company ON candidates(company_id);
CREATE INDEX idx_candidates_position ON candidates(job_position_id);
CREATE INDEX idx_candidates_agent ON candidates(agent_id);
CREATE INDEX idx_candidates_owner ON candidates(owner_user_id);
CREATE INDEX idx_candidates_deleted ON candidates(deleted_flag);
CREATE INDEX idx_candidates_stage_0_5 ON candidates(stage_0_5_result);
CREATE INDEX idx_candidates_hire_status ON candidates(hire_status);

-- Interviews table (0.5次面談)
CREATE TABLE interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID UNIQUE NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    interviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    interview_date DATE NOT NULL,
    
    -- Overall comments
    overall_comment_external TEXT,
    overall_comment_internal TEXT,
    
    -- Will / Attract
    will_text_external TEXT,
    will_text_internal TEXT,
    attract_text_external TEXT,
    attract_text_internal TEXT,
    
    -- Transcript
    transcript_raw_text TEXT,
    transcript_source VARCHAR(100),
    transcript_url TEXT,
    
    -- Generated reports (cached)
    client_report_markdown TEXT,
    agent_report_markdown TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_interviews_candidate ON interviews(candidate_id);
CREATE INDEX idx_interviews_interviewer ON interviews(interviewer_id);
CREATE INDEX idx_interviews_date ON interviews(interview_date);

-- Interview Details table (中項目ごとのスコア)
CREATE TABLE interview_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    interview_id UUID NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
    criteria_item_id UUID NOT NULL REFERENCES criteria_items(id) ON DELETE CASCADE,
    score_value INTEGER NOT NULL CHECK (score_value >= 1 AND score_value <= 4),
    comment_external TEXT,
    comment_internal TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(interview_id, criteria_item_id)
);

CREATE INDEX idx_interview_details_interview ON interview_details(interview_id);
CREATE INDEX idx_interview_details_criteria ON interview_details(criteria_item_id);

-- Interview Question Responses table (Q&Aログ)
CREATE TABLE interview_question_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    interview_id UUID NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
    criteria_item_id UUID REFERENCES criteria_items(id) ON DELETE SET NULL,
    question_text TEXT NOT NULL,
    answer_summary TEXT,
    hypothesis_text TEXT,
    transcript_reference TEXT,
    is_highlight BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_interview_qr_interview ON interview_question_responses(interview_id);
CREATE INDEX idx_interview_qr_highlight ON interview_question_responses(is_highlight);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_positions_updated_at BEFORE UPDATE ON job_positions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON agents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_criteria_groups_updated_at BEFORE UPDATE ON criteria_groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_criteria_items_updated_at BEFORE UPDATE ON criteria_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_candidates_updated_at BEFORE UPDATE ON candidates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_interviews_updated_at BEFORE UPDATE ON interviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_interview_details_updated_at BEFORE UPDATE ON interview_details FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_interview_qr_updated_at BEFORE UPDATE ON interview_question_responses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
