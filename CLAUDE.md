# CLAUDE.md — Storyteller Story QA Pipeline

This is the single source of truth for the Storyteller take-home task project.

---

## Project Overview

We are building an **Automated Story QA Pipeline** as a take-home task for the **AI Automation Builder** role at Storyteller. Storyteller is a B2B SaaS platform that lets companies (tenants) embed Stories into their apps. Our pipeline automatically checks the quality of published stories, flags issues (like mismatched CTAs), and tracks tenant health over time.

**Applicant:** Vaughn Botha
**Date:** 13 March 2026

---

## The Task (from Storyteller)

- **Time limit:** 2 hours maximum (strictly enforced, tracked per stage below)
- **What they want:** A system that automatically reviews media-heavy content at scale for consistency, professionalism, and trustworthiness
- **Key constraint:** Must work **repeatedly and automatically** from data — no one-off analysis or purely conceptual solutions
- **What to submit:** Working system + explanation of decisions + how AI was used
- **What they're evaluating:** How you think, assumptions you make, decisions you prioritise

Full task brief: `AI_Product_Operations_Task.md`
Full PRD: `storyteller_qa_prd.md`

---

## What We Are Building

```
Webhook → Split Stories → Validate Structure → AI Evaluation → Route by Result → Write to Neon + Alert
```

1. **Webhook** receives tenant story payload (POST /story-qa)
2. **Split Stories** breaks the stories array into individual items
3. **Structural Validation** (no AI) checks for missing fields, empty titles, broken actions
4. **AI Evaluation** (OpenRouter node → GPT-4) checks CTA coherence, title alignment, page completeness
5. **Route by Result** sends stories down different paths based on status (see Routing Rules below)
6. **Write to Neon + Alert** stores results in PostgreSQL, emails alerts on flagged stories
7. **Database trigger** auto-populates a `tenant_health` table for pattern tracking
8. **Results webhook** (GET /story-qa-result) serves results to the frontend
9. **HTML frontend** lets you paste a payload, submit, and see QA results

---

## Tech Stack & Tools Available

| Tool | What It Does | How We Use It |
|---|---|---|
| **n8n** | Workflow automation | Runs the QA pipeline (webhook, validation, AI calls, routing, writing to DB) |
| **n8n MCP** | Claude Code can research nodes, build, validate, and deploy n8n workflows directly | Use for building production-ready flows |
| **OpenRouter (GPT-4)** | AI evaluation via n8n OpenRouter node | One call per story, returns structured JSON with issues and status. Credential already configured in n8n. |
| **Neon MCP** | Claude Code can create databases, schemas, run SQL, create triggers directly | Use for all database work |
| **HTML + CSS + JS** | Frontend interface | Single-file demo interface for submitting payloads and viewing results |
| **frontend-design skill** | Claude Code skill for building HTML interfaces | Use for ALL HTML/CSS/JS design work |
| **GitHub** | Source control | Repo for all deliverables (Vaughn will provide repo URL) |
| **Remotion / video-creator** | Screen recording & video creation | Create the demo video showing the pipeline in action |
| **Perplexity MCP** | Deep research | Use for any research questions that need thorough answers |
| **Brave API** | Web search & scraping | Use for quick web lookups |

---

## Build Stages & Time Tracking

**IMPORTANT:** We have a strict 2-hour limit. Vaughn will provide start and end times for each stage. This log is the audit trail that goes into the GitHub repo.

| Stage | Description | Start Time | End Time | Duration | Status |
|---|---|---|---|---|---|
| 1 | Project setup: CLAUDE.md, GitHub repo, Neon database + schema | 07:40 | 07:49 | 9 min | Done |
| 2 | n8n Main QA Pipeline workflow (webhook → validate → AI eval → route → write) | 07:50 | 08:15 | 25 min | Done |
| 3 | n8n Results Retrieval workflow (GET endpoint for frontend) | 08:39 | 08:43 | 4 min | Done |
| 4 | HTML Frontend (paste payload, submit, view results) | 09:00 | 09:10 | 10 min | Done |
| 5 | End-to-end testing with sample data | 09:28 | 09:37 | 9 min | Done |
| 6 | README + writeup landing page + color refresh + theme toggle | 10:00 | 10:07 | 7 min | Done |
| 7 | Demo video (Remotion) + embed in HTML | 10:34 | 10:47 | 13 min | Done |
| **TOTAL** | | | | **77 min** | |

**How to update:** Just say "start" or "finish" with the time (e.g., "start 09:15" / "finish 09:40"). I will figure out which stage we're on, log the times, calculate the duration, and keep a running total. You don't need to specify the stage number.

---

## n8n Workflow Standards

Every n8n workflow must include detailed sticky notes. Each sticky note must cover:

1. **What we did** — What this node/section does and why it exists
2. **Why we did it this way** — The reasoning behind the approach
3. **What we did NOT build** — Things we deliberately left out and why (e.g., "No video analysis — adds latency and cost, structured metadata carries the signal")
4. **What we would build next** — The logical next step if we had more time

This makes the workflow self-documenting and shows clear thinking to the Storyteller team.

---

## Routing Rules — Where Each Result Goes

Every story result ends up in Neon AND gets routed to the right action. Nothing disappears.

| Status | Written to Neon? | Email Alert? | What Happens |
|---|---|---|---|
| `ok` | Yes | No | Story is clean. Logged for records. No action needed. |
| `review` | Yes | Yes — "Story flagged for review" | Issues found (e.g., CTA mismatch). Editor attention recommended. Email contains story_id, tenant, issues list. |
| `invalid` / `invalid_structure` | Yes | Yes — "Story failed validation" | Structural failure (missing fields, no pages, etc.). Email contains story_id, tenant, what failed. |
| `error` | Yes | Yes — "Pipeline error" | Something broke in the pipeline itself. Email contains story_id, tenant, which node failed, error message. |

**Alert method:** Email (already available in n8n, no extra credential setup needed).
**Sticky note guidance:** Note in workflow that alerts could also be sent to Slack, Microsoft Teams, etc. — email chosen for speed of setup in this prototype.

---

## GitHub Repository Structure

```
storyteller-story-qa/
│
├── README.md                      ← The written submission. Start here.
├── time-log.md                    ← Audit trail of time spent per stage
│
├── 1-sample-data/
│   └── antarctic_football_league.json    ← Example payload (copy-paste into frontend)
│
├── 2-database/
│   └── schema.sql                 ← Run this first. Creates tables + trigger in Neon.
│
├── 3-workflow/
│   ├── story_qa_pipeline.json     ← Import into n8n. Main QA pipeline.
│   └── story_qa_results.json      ← Import into n8n. Results retrieval for frontend.
│
├── 4-frontend/
│   └── index.html                 ← Open in browser. Paste payload, hit Submit.
│
└── docs/
    └── CLAUDE.md                  ← Project source of truth (this file)
```

**Why numbered folders?** So anyone cloning the repo sees the setup order at a glance:
1. Look at the sample data to understand the input
2. Set up the database
3. Import the workflows
4. Open the frontend and run a test

**GitHub repo URL:** (Vaughn to provide — I will need the repo URL to push code)

---

## Key Design Decisions

These decisions are made upfront and explained in the README:

| Decision | Reason |
|---|---|
| No composite quality score | A number like "72" is not actionable. Specific named issues (e.g., "CTA mismatch on page_2") are what editors can act on. |
| No multi-agent reviewer chain | One precise, well-prompted AI call is more reliable than four conflicting reviewers averaged together. |
| Structural validation before AI | Eliminates API spend on broken data. Fast, deterministic, free. |
| Tenant health via database trigger | Analytics layer is decoupled from pipeline. n8n doesn't need to know the trigger exists. |
| No video/image analysis | Structured metadata already carries the coherence signal. Video analysis adds latency and cost at the wrong layer. |
| No automated moderation | QA surfaces signals. It does not replace editors. Automating moderation creates liability. |

---

## What We Deliberately Are Not Building (and Why)

- **Raw payload inbox table** — In production this would be the first write (store before processing). Omitted for time.
- **Full dashboard UI** — The Neon table is the output. A dashboard is the next build with engineering support.
- **Video/image analysis** — Cost and latency, structured metadata is sufficient.
- **Automated moderation decisions** — QA informs, doesn't decide.

---

## What We Would Build Next (With Engineering Support)

1. Raw payload inbox table (resilience)
2. Tenant health dashboard (UI for customer success team)
3. Pre-publish guardrail mode (same logic, runs before publish)
4. CMS feedback loop (results shown to the editor who published)
5. URL validation (HTTP HEAD check on action URLs)

---

## Credentials & Infrastructure

| What | Status | Notes |
|---|---|---|
| **Neon database** | Claude builds via MCP | I create the project, schema, and triggers directly. |
| **OpenRouter (GPT-4)** | Ready | Credential already configured in Vaughn's n8n instance. Using OpenRouter node. |
| **n8n instance** | Ready | Self-hosted. Connected via n8n MCP. I can build and deploy workflows directly. |
| **GitHub repo** | Waiting on Vaughn | Vaughn will provide the repo URL when ready. |
| **Email (alerts)** | Built-in n8n | No extra credentials needed. Used for review/invalid/error alerts. |

---

## Working Notes

_This section tracks where we are right now._

**Current status:** Stages 1–7 complete. Pipeline tested, frontend live with embedded demo video.
**Time used:** 77 min of 120 min (43 min remaining).
**Last completed:** Stage 7 — Demo video recorded via Playwright + Remotion. Shows full QA flow (submit → flagged result → clean result) plus n8n pipeline screenshots (editor, executions, alert detail). Embedded in HTML page.
**Next step:** Final polish, README updates, GitHub push.
**Blockers:** GitHub repo URL still needed from Vaughn (not blocking — we can push later).
**AI model:** OpenRouter → GPT-4 (via n8n OpenRouter node, credential already set up).
**Alerts:** Email only for this prototype. Sticky notes mention Slack/Teams as future options.
