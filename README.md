# Storyteller Story QA Pipeline

**Automated quality evaluation for Storyteller stories.** Catches CTA mismatches, missing fields, and content issues — automatically, at scale, from the data.

Built by Vaughn Botha | March 2026

> **Live demo:** https://storyteller-task-kappa.vercel.app/

---

## The Problem

Teams publishing media-heavy content at high volume can't manually review every story for consistency and trustworthiness. But this isn't just a story quality problem — it's a **tenant health monitoring** problem. Storyteller needs visibility into what tenants are publishing before invisible trust damage shows up in engagement metrics.

The specific failure mode: a CTA says "Buy tickets" but links to `/highlights`. The user taps, lands on the wrong page, bounces. The editor missed it. Storyteller had no signal.

## What I Built

An n8n pipeline that automatically evaluates every story a tenant publishes:

```
Webhook → Split Stories → Structural Validation → AI Evaluation → Route by Status → Write to Neon + Email Alert
```

1. **Webhook** receives the tenant story payload (POST)
2. **Split** breaks the stories array so each flows independently
3. **Structural validation** (no AI) catches missing fields, empty titles, broken actions — free, fast, deterministic
4. **AI evaluation** (GPT-4 via OpenRouter) checks CTA coherence, title alignment, page completeness — returns structured JSON with specific issues
5. **Route** sends each result down the right path: `ok` stories get logged, `review`/`invalid`/`error` stories get logged AND trigger an email alert
6. **Database trigger** auto-populates a `tenant_health` table — tracks issue types and occurrence counts per tenant over time, decoupled from the pipeline

## Key Decisions

| Decision | Why |
|---|---|
| **No composite quality score** | "72" is not actionable. "CTA mismatch on page_2" is. Editors need specific issues, not numbers. |
| **Structural validation before AI** | If a story has no pages, there's nothing for AI to evaluate. Catching this first saves API spend on broken data. |
| **One AI call, not a multi-agent chain** | Four reviewers producing conflicting outputs that get averaged degrades signal quality. One precise, well-prompted call is more reliable. |
| **No video/image analysis** | Structured metadata already carries the coherence signal. Video analysis adds cost and latency at the wrong layer. |
| **Tenant health via database trigger** | Analytics layer runs independently. PostgreSQL trigger counts issues per tenant automatically. Pipeline doesn't need to know it exists. |
| **No automated moderation** | QA surfaces signals. It does not replace editors. Automating moderation creates liability. |

## What I'd Build Next

With engineering support, in this order:

1. **Raw payload inbox** — Store events before processing for resilience and replay
2. **Tenant health dashboard** — Data is already in the table; it needs a UI for customer success
3. **Pre-publish guardrails** — Same logic, but inside the CMS before publish
4. **CMS feedback loop** — Surface results to the editor who published the story
5. **URL validation** — HTTP HEAD checks on action URLs to catch broken links

## Quick Setup

**1. Database** — Run `2-database/schema.sql` against a Neon PostgreSQL instance.

**2. Workflows** — Import into n8n:
- `3-n8n-flows/story_qa_pipeline.json` (main QA pipeline)
- `3-n8n-flows/story_qa_results.json` (results retrieval endpoint)

**3. Frontend** — Open `index.html` in your browser. Sample data is pre-loaded — hit Submit to run the pipeline.

The frontend includes the full writeup with pipeline details, architecture diagrams, and design rationale below the QA tool.

## Repo Structure

```
index.html       → Single-file HTML interface with embedded writeup (root for Vercel)
1-sample-data/   → Example payload (Antarctic Football League — includes intentional CTA mismatch)
2-database/      → SQL schema with tables + tenant health trigger
3-n8n-flows/     → n8n workflow exports (main pipeline + results endpoint)
```

Numbered folders show setup order at a glance.

## Tech Stack

- **n8n** — workflow automation (webhook, validation, routing, alerts)
- **OpenRouter / GPT-4** — AI evaluation (one call per story, structured JSON output)
- **Neon PostgreSQL** — results storage + tenant health trigger
- **HTML / CSS / JS** — single-file frontend, no dependencies
