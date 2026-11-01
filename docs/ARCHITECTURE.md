# Architecture

LexRadar connects publication discovery, research, drafting, and submission tracking. Projects, attachments, research-stage history and source registers are stored locally in IndexedDB. A Node API performs requests with server-only credentials.

```mermaid
flowchart LR
 A[Announcement feeds + Google Search] --> B[Discovery inbox]
 B --> C[Publisher index + evidence review]
 C --> D[Project brief]
 E[OpenAlex + Crossref] --> F[Paper map + source register]
 D --> G[Perspectives]
 G --> H[Grounded research]
 F --> H
 H --> I[Outline]
 I --> J[First draft]
 J --> K[Revision + saved versions]
 K --> L[Publisher submission route]
 L --> M[Submission and publication record]
```

## Repository structure

| Path | Responsibility |
| --- | --- |
| `src/App.tsx` | Navigation, document workbench, publisher directory, tasks, versions, backups |
| `src/ResearchLab.tsx` | Four-stage research pipeline, stage history, draft acceptance |
| `src/PaperExplorer.tsx` | Scholarly search, paper map, inspector, saving references |
| `src/Discovery.tsx` | Announcement feed, global call search, source register |
| `src/ToolsHub.tsx` | External-tool workspace, transferable brief, direct-open fallback |
| `src/Studio.tsx` | Outline, draft, revision, and completeness assistance |
| `src/Connection.tsx` | Workspace code and connection status |
| `src/model.ts` | Validated local data model and compatible backup defaults |
| `src/documents.ts` | DOCX extraction and export, loaded on demand |
| `server/service.js` | Gemini actions, source fetching, authorization, routing |
| `server/scholarly.js` | OpenAlex/Crossref adapters and graph edges |
| `server/sources.js` | Explicit source register |
| `api/[...path].js` | Vercel Node API entry point |
| `public/discovery-snapshot.json` | Dated starter announcements, separate from live refresh |
| `tests/` | Unit checks and browser workflows |

## Research pipeline

Perspectives | grounded evidence | outline | manuscript. Each stage is a separate request, saved immediately on completion. Full runs stop on a failed or truncated response, or when evidence gathering returns no grounding references. A stage can be rerun with a narrower direction. Accepting a first draft preserves previous working text as a version. Research-stage history is included in project backups. No source becomes verified merely because it was retrieved.

## Reference map method

Shared-reference edges count the intersection of two returned papers' reference lists (bibliographic coupling). Direct-citation edges connect returned papers that cite one another. Node size reflects citation count; positions are ordered by year. At most 24 works are returned per search. Missing reference metadata means missing edges. This is an independent method, not Connected Papers' proprietary model.

## API

| Endpoint | Access | Purpose |
| --- | --- | --- |
| `GET /api/status` | Public | Configuration booleans and source register; never secret values |
| `GET /api/discover?source=...` | Public | Bounded registered-source fetch |
| `GET /api/scholarly?q=...&provider=...&mode=...` | Public | Scholarly metadata and reference edges |
| `GET /api/session` | Same-origin browser | Issue an automatic signed HttpOnly session |
| `POST /api/assist` | Signed server session | Research, writing, and grounded global calls |

Announcement fetches are allowlisted by origin, bounded in time/size, and checked against robots rules. Scholarly requests use fixed providers and bounded result counts. AI requests require an automatically issued signed cookie and reject cross-origin browser requests. IP burst and daily guards are per instance; they reset across cold starts/scale-out and are not a durable billing limit. Configure provider-side quotas for an enforceable budget. Credentials remain server-side. Per-instance short-lived caches are not a shared database or a scheduled monitor.

## External tools

Workspace launchers cover AuraPraxis / AI Studio, the writing editor, Stanford STORM, Connected Papers and Research-Tool. Frames are sandboxed and optional. A direct-open button is always present because provider login and framing restrictions are outside LexRadar's control. Browser frame-load events do not reliably establish successful sign-in. Project text transfers when a user copies and pastes the brief.

## Scaling boundary

This release is a personal workbench with public discovery. General multi-user AI access requires account ownership, persistent quotas, shared discovery storage, a scheduler, and private file storage. These are proposed milestones in [ROADMAP.md](ROADMAP.md), not features claimed by this release.


## v0.3 workspace additions

- `server/session.js`: automatically signed, expiring HttpOnly browser sessions and best-effort per-instance usage guards.
- `src/api.ts`: shared session bootstrap and one expired-session retry for every AI screen.
- `src/AuraWorkspace.tsx`: native document-type/citation selection, writing tools, editing, source cards, version acceptance and Word export.
- `src/Profile.tsx`: local research identity and writing preferences included in validated backups.
- `src/Citations.tsx` / `src/ResearchText.tsx`: source cards, source-check controls, inline citation chips and RIS export.
- `src/ZoteroLibrary.tsx`: paged public library reading via the fixed Zotero v3 API, and saving references locally.
- `src/WritingDesk.tsx`: native Gemini revision beside the provider's direct launcher; no claim of access to a third-party paid API.

`GET /api/zotero?kind=users|groups&id=<numeric>&start=<offset>` reads public metadata only. The deployed app does not embed private provider credentials in browser code. A connected ChatGPT app does not automatically provide a deployed site with a runtime API credential.

The native evidence summary consumes actual returned abstracts and metadata. It does not label citation counts as quality scores, invent consensus percentages, or claim full-text reading when abstracts are absent.
