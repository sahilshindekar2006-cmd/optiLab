-- Schema for OptiLab 360

-- 1. Experiments Table (For saving historical runs)
CREATE TABLE IF NOT EXISTS experiments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    grade INTEGER,
    wavelength DECIMAL,
    error_margin DECIMAL,
    mode TEXT NOT NULL,
    measurements JSONB NOT NULL
);

-- Enable RLS (Assuming anon role can insert for demo purposes)
ALTER TABLE experiments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert experiments"
    ON experiments FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Anyone can view experiments"
    ON experiments FOR SELECT
    USING (true);

-- 2. Realtime publication for collaboration
-- For the lab partner mode, we don't need a table, we just need to broadcast via Realtime Channels.
-- However, we must ensure the 'realtime' extension is enabled in the project dashboard.
