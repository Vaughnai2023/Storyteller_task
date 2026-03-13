# Storyteller Story QA Pipeline — Execution Plan

## Context
Vaughn is building an Automated Story QA Pipeline for his Storyteller AI Automation Builder application. Strict 2-hour limit. Stage 1 starts at 07:40. The PRD and CLAUDE.md are complete — all specs are locked. This plan covers executing all 7 stages.

## Execution Rules
- **Stage-by-stage**: Complete each stage fully before moving to the next
- **Test & confirm**: At the end of each stage, test the deliverables and confirm with Vaughn before progressing
- **Time tracking**: Log start/end times in CLAUDE.md for each stage
- **Frontend design**: When reaching Stage 4, ask Vaughn about aesthetic preferences before building. Use the `/frontend-design` skill for all HTML/CSS/JS work

---

## Stage 1: Project Setup — Neon Database + Schema + Sample Data
**Goal:** Create database, tables, trigger, sample data file, and folder structure.

### Steps:
1. **Update CLAUDE.md** — Log Stage 1 start time as 07:40
2. **Create folder structure** locally:
   ```
   1-sample-data/
   2-database/
   3-workflow/
   4-frontend/
   docs/
   ```
3. **Create sample data file** — `1-sample-data/antarctic_football_league.json` with the example payload from the task brief (clean JSON, no escape chars)
4. **Set up Neon database** via Neon MCP:
   - List existing projects or create a new one (`storyteller-qa`)
   - Create `story_qa_results` table (from PRD Section 8)
   - Create `tenant_health` table (from PRD Section 8)
   - Create `update_tenant_health()` trigger function + trigger (from PRD Section 8)
5. **Save schema to file** — `2-database/schema.sql` with the full DDL
6. **Test** — Run a test INSERT into `story_qa_results` and verify the trigger populates `tenant_health`

---

## Stage 2: n8n Main QA Pipeline Workflow
**Goal:** Build the 6-node pipeline in n8n via MCP.

### Nodes:
1. **Webhook** — `POST /story-qa`, receives tenant payload
2. **Split Stories** — Item Lists node, splits `stories` array
3. **Structural Validation** — Code node: checks story_title, pages array, asset_url, action cta+url
4. **AI Evaluation** — OpenRouter node (GPT-4): uses the prompt from PRD Section 4
5. **Route by Result** — Switch node on `status` field (ok / review / invalid / invalid_structure / error)
6. **Write to Neon** — PostgreSQL INSERT into `story_qa_results`
7. **Email Alert** — Send email for review/invalid/error statuses
8. **Error Handler** — Catches failures, writes error row to Neon + alerts
9. **Sticky Notes** — One per section, following the 4-part format from CLAUDE.md

### Export:
- Download workflow JSON → save as `3-workflow/story_qa_pipeline.json`

---

## Stage 3: n8n Results Retrieval Workflow
**Goal:** Build the GET endpoint for the frontend.

### Nodes:
1. **Webhook** — `GET /story-qa-result` with `story_id` query param
2. **Neon Query** — `SELECT * FROM story_qa_results WHERE story_id = $1 ORDER BY evaluated_at DESC LIMIT 1`
3. **Respond to Webhook** — Return the row as JSON

### Export:
- Download workflow JSON → save as `3-workflow/story_qa_results.json`

---

## Stage 4: HTML Frontend
**Goal:** Single-file demo interface using `/frontend-design` skill.

### Before building:
- Ask Vaughn about aesthetic preferences (colors, style, branding)

### Specs (from PRD Section 10):
- Two-panel layout (left: JSON input, right: results)
- Textarea pre-filled with Antarctic Football League payload
- Submit → POST to webhook → poll GET endpoint every 2s
- Status badges: green (ok), amber (review), red (invalid/error)
- Save as `4-frontend/index.html`

---

## Stage 5: End-to-End Testing
**Goal:** Submit sample payload through frontend, verify full pipeline.

### Test checklist:
- [ ] POST payload to webhook succeeds
- [ ] story_123 flagged as `review` with CTA mismatch on page_2
- [ ] story_124 passes as `ok`
- [ ] Both rows written to `story_qa_results`
- [ ] `tenant_health` has `cta_mismatch` entry for Antarctic Football League
- [ ] Frontend displays results correctly with proper badges
- [ ] Email alert fires for story_123

---

## Stage 6: README Writeup
**Goal:** Write README.md following PRD Section 12 structure.

Sections: The Problem, What I Built, The Demo, Why These Decisions, What I Would Not Build Yet, What I Would Build First, How This Shows Up Over Time.

---

## Stage 7: Demo Video
**Goal:** Screen recording showing the pipeline in action (under 90 seconds).

Follow the demo flow from PRD Section 14.

---

## Verification
- Submit Antarctic Football League payload via frontend
- Confirm story_123 = review (CTA mismatch), story_124 = ok
- Check Neon tables for both rows + tenant_health trigger
- Confirm email alert received for flagged story
