# Data source index

Reviewed 1 November 2026. Running registry: `server/sources.js`; venue records: `src/data.ts`.

| Source | Access in this release | Coverage |
| --- | --- | --- |
| LiveLaw | Live HTML adapter | Calls for papers |
| Bar & Bench | Live HTML adapter | Relevant law-school announcements |
| Lawctopus | RSS adapter registered; currently blocked by robots rules | Manual reference / public search leads |
| Google Search via Gemini | Grounded global call search and evidence retrieval | Official announcements, international calls, publicly indexed LinkedIn posts |
| OpenAlex | Public API; optional server key | Scholarly works, authors, venues and references |
| Crossref | Public API; automatic OpenAlex fallback | DOI metadata and deposited references |
| NLSIU repository | Official reference | Journal requirements and stated fee evidence |
| EPW, ICSSR, SSRN, DOAJ | Reference register | Journals, social sciences and research opportunities |
| India Code | Government reference | Primary legislation |
| Shodhganga / INFLIBNET | Repository reference | Indian theses and background scholarship |
| Open Government Data India | Government reference | Datasets; automated catalog access requires its separate API key |
| UGC | Government reference | Journal selection guidance and historical CARE reference |

## Evidence rules

New leads contain a title, URL, summary, source, and fetch time. Global search requires grounding references. If the provider returns narrative rather than parseable JSON, a short formatting pass structures the retrieved findings. If that fails, the grounding references become explicitly unverified reading leads. AI-extracted fee/deadline claims remain unconfirmed until a person checks the original publisher. New publisher-index entries keep both fees Unknown, no verified deadline, and no checked date.

Open access does not imply free publication. Free submission does not imply free publication. A DOI does not establish legitimacy, accreditation, indexing, an open call, or acceptance. Deadlines need a year, closing time, and timezone from the source. Review times must be attributed rather than promised.

UGC discontinued CARE listing in 2025. The historical list does not establish current approval. See the [UGC notice hosted by MGCU](https://mgcub.ac.in/storage/content_files/1766657472_UGC-Public-Notice-16-July-2025.pdf) and [HNLU notice](https://hnlu.ac.in/uncategorized/notice-regarding-ugc-care-journals/).

## Adding providers

1. Register the original source, access method, and coverage.
2. Prefer documented APIs and feeds; record robots and permission restrictions.
3. Test malformed URLs, duplicate records, missing data, and parse errors.
4. Separate fetching an announcement from verifying publisher requirements.
5. Record fetch time and errors. Never report a static snapshot as a successful live refresh.

Refresh is on demand. The register includes reference-only sources and does not imply that every listed site is continuously scraped. The starter directory and current search are not exhaustive global coverage. Published-work APIs complement announcements; they do not replace them.

API references: [Crossref](https://www.crossref.org/documentation/retrieve-metadata/rest-api/), [OpenAlex authentication](https://help.openalex.org/api/authentication/), [OpenAlex search](https://help.openalex.org/api/searching/), [Gemini grounding](https://ai.google.dev/gemini-api/docs/google-search).
