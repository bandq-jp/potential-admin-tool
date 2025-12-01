-- Enable Row Level Security (RLS) on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE criteria_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE criteria_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_question_responses ENABLE ROW LEVEL SECURITY;

-- Policies for service role (backend API access with service_role key)
-- These allow full access when using the service_role key from the backend

CREATE POLICY "Service role full access on users" 
    ON users FOR ALL 
    TO service_role 
    USING (true) 
    WITH CHECK (true);

CREATE POLICY "Service role full access on companies" 
    ON companies FOR ALL 
    TO service_role 
    USING (true) 
    WITH CHECK (true);

CREATE POLICY "Service role full access on job_positions" 
    ON job_positions FOR ALL 
    TO service_role 
    USING (true) 
    WITH CHECK (true);

CREATE POLICY "Service role full access on agents" 
    ON agents FOR ALL 
    TO service_role 
    USING (true) 
    WITH CHECK (true);

CREATE POLICY "Service role full access on criteria_groups" 
    ON criteria_groups FOR ALL 
    TO service_role 
    USING (true) 
    WITH CHECK (true);

CREATE POLICY "Service role full access on criteria_items" 
    ON criteria_items FOR ALL 
    TO service_role 
    USING (true) 
    WITH CHECK (true);

CREATE POLICY "Service role full access on candidates" 
    ON candidates FOR ALL 
    TO service_role 
    USING (true) 
    WITH CHECK (true);

CREATE POLICY "Service role full access on interviews" 
    ON interviews FOR ALL 
    TO service_role 
    USING (true) 
    WITH CHECK (true);

CREATE POLICY "Service role full access on interview_details" 
    ON interview_details FOR ALL 
    TO service_role 
    USING (true) 
    WITH CHECK (true);

CREATE POLICY "Service role full access on interview_question_responses" 
    ON interview_question_responses FOR ALL 
    TO service_role 
    USING (true) 
    WITH CHECK (true);

