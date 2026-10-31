# LexRadar

A compact research-to-publication workbench. Browse publishers, develop a research brief, continue in AuraPraxis, save manuscript versions, and track submissions to publication.

## Run

Requires Node.js 22.12+ (tested with Node 24).

```sh
npm install
npm run dev
```

Open the local address printed by Vite. Production build:

```sh
npm run build
npm run preview
```

The `dist/` directory can be served by a static host. Its relative asset paths support deployment under a repository subpath. No account, API key, or backend is required for this version.

## Workflow

1. Create a project or start one from a publisher record.
2. Define the question, document type, target, citation style, and research scope.
3. Keep a source register with verification notes.
4. Copy the brief and open the linked AuraPraxis app; paste it into the app and choose the matching research category. External tools have their own sign-in and processing requirements.
5. Paste returned text or upload a DOC/DOCX, PDF, TXT, or Markdown file (up to 10 MB). Save named versions. Word/PDF files are preserved intact, not parsed or formatted by LexRadar.
6. Review the publisher requirements and complete the preparation checklist.
7. Copy a cover-letter template, open the publisher's submission route, and submit there. Log the exact manuscript version afterward.
8. Record editorial decisions and revisions. A published status requires a publication URL.

The project tree connects saved versions to submission attempts. The dashboard counts submission attempts, review stages, and published records separately. Opening a tool or publisher link never marks a submission as sent.

## Storage and backups

IndexedDB stores projects, attachments, sources, tasks, and directory edits in this browser and origin. It is not cloud storage or a cross-device account. Clearing browser site data removes this workspace. Use **Settings → Export full backup** to keep a complete JSON backup including uploaded files. Restore validates the backup and asks before replacing existing records.

External tools receive no manuscript data automatically. The user chooses what to copy and paste. LexRadar does not collect Google credentials, store API keys, send emails, or claim automatic synchronization with AuraPraxis.

## Publisher directory

There are 22 starter records, with official sources reviewed on 1 November 2026 for 12 records. Other records are explicitly unverified leads carried forward or added for coverage. Six NLSIU repository journals have a university source for zero submission/publication fees; expired calls remain expired. Fees absent from guidelines remain **Unknown**, not inferred free from open access. Zero-fee filtering excludes unconfirmed fees.

This release provides manual source verification and record editing, not continuous scraping. A checked date records the last review, not a guarantee that a call is still open. Deadline-only calls need their closing time and timezone confirmed with the publisher. Review timelines are source statements, not publication promises. Country, subject, format, and institution are displayed; filters support subject, format, fee status, expiry, and search by publisher/institution.

The launch directory is a starting point, not complete coverage of Indian journals. Cloud sync, an automated source monitor, and deeper tool integration are future extensions. The first version deliberately uses React + TypeScript + Vite and IndexedDB instead of a server/database deployment.

## Validation

```sh
npx playwright install chromium
npm test
```

Tests cover the complete research/submission workflow, exact-version history, attachment backup/restore, fee and expiry filters, escaped user text, mobile overflow, draft retention, and invalid backup rejection. Tests use isolated browser storage and do not submit documents to publishers.

## Design and related projects

- Design process adapted from **Unslop**, by Damir Sokolovsky (@heydamir), under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/): https://github.com/heydamir/unslop. Adaptation: a restrained, table-oriented academic workbench; compact corners and conventional controls follow the requested 2015–16 direction.
- [AuraPraxis](https://github.com/DHANANAN/AuraPraxis) informed the research document types, citation choices, and version workflow. It remains a separately hosted tool; its AI services are not duplicated here.
- The writing editor link is the user-supplied https://www.sthealthwriter.in/. Linking is not a security audit or endorsement of detection claims.

The original single-file prototype remains at its original path for reference. It is not part of the Vite production build. Only the new workbench is included in `dist/`.
