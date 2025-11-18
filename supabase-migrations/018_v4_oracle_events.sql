-- Tracks incoming capital oracle events (webhook callbacks)

CREATE TABLE IF NOT EXISTS capital_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects_v4(id) ON DELETE SET NULL,
    payload JSONB NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    signature TEXT,
    received_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_capital_events_project ON capital_events(project_id);

