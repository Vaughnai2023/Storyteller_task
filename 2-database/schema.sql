-- Storyteller Story QA Pipeline — Database Schema
-- Run this first. Creates tables + trigger in Neon.
-- Project: storyteller-qa (morning-hat-42971951)
-- Database: neondb

-- Table 1: story_qa_results
-- Stores QA evaluation output for every story processed.
-- error_message is null for successful evaluations, populated on failures.
CREATE TABLE story_qa_results (
  id              SERIAL PRIMARY KEY,
  story_id        TEXT NOT NULL,
  tenant_id       TEXT NOT NULL,
  tenant_name     TEXT,
  status          TEXT NOT NULL,
  confidence      TEXT,
  issues          JSONB,
  summary         TEXT,
  error_message   TEXT,
  evaluated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Table 2: tenant_health
-- Auto-populated by trigger. Tracks recurring issue patterns per tenant.
-- UNIQUE constraint on (tenant_id, issue_type) enables upsert counting.
CREATE TABLE tenant_health (
  id               SERIAL PRIMARY KEY,
  tenant_id        TEXT NOT NULL,
  tenant_name      TEXT,
  issue_type       TEXT NOT NULL,
  occurrence_count INT DEFAULT 1,
  first_seen_at    TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, issue_type)
);

-- Trigger function: update_tenant_health
-- Fires on every INSERT into story_qa_results.
-- Extracts each issue from the JSONB array and upserts into tenant_health.
-- n8n does not need to know this trigger exists — analytics is decoupled from pipeline.
CREATE OR REPLACE FUNCTION update_tenant_health()
RETURNS TRIGGER AS $$
DECLARE
  issue JSONB;
BEGIN
  IF NEW.issues IS NOT NULL THEN
    FOR issue IN SELECT * FROM jsonb_array_elements(NEW.issues)
    LOOP
      INSERT INTO tenant_health
        (tenant_id, tenant_name, issue_type, occurrence_count,
         first_seen_at, last_seen_at)
      VALUES
        (NEW.tenant_id, NEW.tenant_name,
         issue->>'type', 1, NOW(), NOW())
      ON CONFLICT (tenant_id, issue_type)
      DO UPDATE SET
        occurrence_count = tenant_health.occurrence_count + 1,
        last_seen_at = NOW();
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_tenant_health
AFTER INSERT ON story_qa_results
FOR EACH ROW EXECUTE FUNCTION update_tenant_health();
