# LexRadar

[Live workbench](https://lexradar-two.vercel.app/) ? [Architecture](docs/ARCHITECTURE.md) ? [Sources](docs/SOURCES.md) ? [Roadmap & timeline](docs/ROADMAP.md) ? [Integrations](docs/INTEGRATIONS.md)

A research-to-publication workbench for law and social sciences. Find calls, explore a question, gather evidence, develop a first draft, and track its submission history.

## Workflow

1. **Discover:** fetch announcements or search global calls with Gemini Google Search. Save leads to the publisher index.
2. **Choose a target:** verify eligibility, both fees, deadline, word limit, and original requirements.
3. **Explore:** brainstorm questions, methods, and competing perspectives in the research lab.
4. **Research:** search OpenAlex/Crossref, explore reference connections, and maintain a source register. Gather grounded web evidence in the lab.
5. **Draft:** develop an outline and first draft or use the writing studio. Accept text explicitly and preserve previous versions.
6. **Revise:** use natural-language revision, readiness checks, and source verification. Import DOCX text or preserve an original file; export Word or text.
7. **Submit and track:** prepare an exact version, submit through the publisher's route, and record editorial decisions and the published URL.

## Capabilities

- Collapsible navigation on all four edges, light/dark modes, bottom controls, and project tabs.
- Grounded global call search, permitted announcement fetchers, and a uniform source register.
- Publisher directory with unknown fees distinct from evidence of zero submission and publication fees.
- Resumable perspectives ? evidence ? outline ? manuscript pipeline, including stage history and source links.
- OpenAlex search with Crossref fallback, paper inspector, shared-reference and direct-citation maps.
- External-tool workspace for AuraPraxis, writing editor, Stanford STORM, Connected Papers and Research-Tool, with direct-open fallbacks.
- Project briefs, verification notes, versions, tasks, submission history and publication records.
- IndexedDB storage and validated JSON backup/restore, including uploaded files and research stages.

This release is a personal workbench with public discovery, not exhaustive global coverage or a multi-user cloud service. Reference-only sources are labelled. Scholarly indexes describe published works, not proof of open calls. [The roadmap](docs/ROADMAP.md) identifies the remaining shared database, scheduled refresh, account and coverage work.

## Development

Node.js 22.12+; tested with Node 24.

```sh
npm ci
npm run dev
```

Vite serves the app and API together. Local document tools and public scholarly search work without Gemini. To enable research/writing, set the server variables in [Integrations](docs/INTEGRATIONS.md), restart the server, and enter the workspace code in Connection.

```sh
npm run build
npm test
```

Tests include Node unit checks and Playwright browser workflows. Install Chromium once with `npx playwright install chromium`. `npm run preview` serves the client only; use Vite development or Vercel for API routes.

## Deployment

The repository is connected to Vercel's lexradar project. The client builds into dist/; api/[...path].js provides the Node API. Configure server variables, deploy the reviewed commit, then verify status, discovery, scholarly search, and a protected assistant request. Status reveals configuration booleans only.

## Storage

Data stays in this browser and origin. Clearing site data removes the workspace; export a full backup in Settings. Gemini tasks send the selected brief, source notes and text to Google. External tools receive the text the user chooses to paste. Emails and manuscript submissions are not sent automatically.

The workspace code is a personal access gate. General multi-user AI access requires account ownership and persistent per-user quotas.

## Attribution

Design process adapted from **Unslop**, by Damir Sokolovsky (@heydamir), under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), with credit to [the original skill](https://github.com/heydamir/unslop). This adaptation uses compact academic navigation and the requested ivory/bronze and obsidian/gold palette.

[AuraPraxis](https://github.com/DHANANAN/AuraPraxis) informed document types and the writing workflow. [Stanford STORM](https://github.com/stanford-oval/storm) informed the research stages. The native map uses public OpenAlex/Crossref metadata. See [Integrations](docs/INTEGRATIONS.md) for reviewed open-source alternatives and licenses. No affiliation or identical implementation of external services is claimed.

The original single-file prototype remains in the repository for historical reference and is excluded from the app build.
