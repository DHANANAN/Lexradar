# Vision and implementation timeline

**Vision:** one research desk from an open call and a focused question to evidence, a first draft, revision, and a traceable submission record. Initial focus: Indian law and social sciences; international discovery through public scholarly indexes and grounded search.

## Release record

| Milestone | Date / status | Outcome |
| --- | --- | --- |
| HTML prototype | Historical reference | Initial tracker concept |
| Workbench v0.1 | 1 November 2026 - shipped | Publisher directory, projects, sources, tasks, versions, submissions, backups |
| Research desk v0.2 | 1 November 2026 - implemented | Sidebar controls, global calls, research pipeline, paper map, external-tool workspace, server Gemini connection, Word import/export |
| Research desk v0.3 | 1 November 2026 - implemented | Automatic server sessions, native AuraPraxis, profile defaults, citation cards, RIS, Zotero public libraries, evidence summaries |

## Proposed delivery sequence

These windows are planning estimates after configuration is available, not promises of exhaustive coverage or publication acceptance.

| Phase | Window | Deliverable | Completion check |
| --- | --- | --- | --- |
| Source verification | Week 1 | Explicit NLU, law journal and social science registry; additional permitted feeds | Original source, reviewer and checked date for every verified fee/deadline |
| Shared discovery | Weeks 2-3 | Database, refresh history, scheduled fetch, deduplication, expiry handling | Calls appear once, retain provenance and expire correctly |
| Research accounts | Weeks 3-4 | Sign-in, project ownership, cross-device sync, private files, persistent per-user quotas | Accounts cannot read each other's drafts; backups remain portable |
| Evidence desk | Weeks 4-5 | DOI resolution, improved parsing, source-to-claim notes, citation exports | Claims link to evidence or explicit verification tasks |
| Publisher matching | Week 6 | Explainable subject, eligibility, format, fee and deadline matching | Unknown requirements never silently treated as satisfied |

## Configuration

A Gemini key and server signing secret enable the current research/writing API. Browser sessions are automatic; no manual access code remains. Optional OpenAlex key increases the API allowance; optional Crossref email selects its polite pool. Direct government dataset integration needs a separate data.gov.in API key. A shared service requires choosing a database/auth provider and confirming its plan; no paid database subscription was created.

The actual Stanford STORM package would require a separate Python service. The native current implementation uses Node and TypeScript and follows the published research-stage idea. A future similarity map may add co-citation and wider graph expansion, with its method documented.

The next priority is source evidence and coverage: official verification, fetch history, and permissioned adapters. There is no single reliable API for all current manuscript calls.
