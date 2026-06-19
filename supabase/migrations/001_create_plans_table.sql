-- Create the plans table for storing AI-generated study plans.
-- No authentication. No RLS. All plans are publicly accessible (intentional for this project).

CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  topics TEXT NOT NULL,
  exam_date DATE NOT NULL,
  hours_per_day INTEGER NOT NULL,
  plan_content JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Disable RLS so the anon key can read and write without policies.
ALTER TABLE plans DISABLE ROW LEVEL SECURITY;
