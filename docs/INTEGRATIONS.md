# Integrations and open-source alternatives

| Tool | Native LexRadar capability | External option |
| --- | --- | --- |
| AuraPraxis / AI Studio | Outline, draft, revision, review and research lab | Configurable app URL with frame attempt and direct fallback |
| Writing editor | Natural-language revision preserving meaning and citations | User-supplied writing site |
| Stanford STORM | Perspectives ? evidence ? outline ? first draft | Stanford preview launcher |
| Connected Papers | Scholarly search, reference/citation map, saving sources | Connected Papers launcher |
| Research-Tool | Matched sidebar/control conventions | Original app launcher |

Launchers are not API integrations. Native workflows use configured Gemini and scholarly APIs. Provider login, terms, and framing controls remain intact. No private endpoints or proprietary similarity scores were copied.

## Open-source research reviewed

| Project | License reviewed | Use / decision |
| --- | --- | --- |
| [Stanford OVAL STORM](https://github.com/stanford-oval/storm) | MIT | Published retrieval and perspective stages informed an independent Node workflow; actual Python engine remains optional |
| [LangChain Open Deep Research](https://github.com/langchain-ai/open_deep_research) | MIT | Candidate for a future durable research worker; not a dependency |
| [SearXNG](https://github.com/searxng/searxng) | AGPL-3.0 | Possible self-hosted retrieval alternative; no unconfigured public instance used |
| [Unslop](https://github.com/heydamir/unslop) | CC BY 4.0 | Applied design process: compact navigation, restrained accent, readable research surfaces |

STORM's [README](https://github.com/stanford-oval/storm/blob/main/README.md) describes pre-writing research, multiple perspectives, simulated conversations, and article generation. LexRadar is not the full STORM/Co-STORM engine and claims no Stanford affiliation. The reference map is independently built from public metadata, rather than Connected Papers' proprietary algorithm.

## Server configuration

```text
GEMINI_API_KEY=your-server-key
GEMINI_MODEL=gemini-2.5-flash
WORKSPACE_ACCESS_TOKEN=your-private-workspace-code
OPENALEX_API_KEY=optional
CROSSREF_MAILTO=optional
```

Set these in `.env.local` for development, or Vercel environment settings for deployment. Restart the local server after changing them. Never prefix credentials with VITE_. Only the workspace code goes in the browser Connection panel; it is separate from the Gemini key. Local environment and access-code files are excluded from Git.
