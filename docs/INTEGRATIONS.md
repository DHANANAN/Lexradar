# Integrations and open-source alternatives

| Tool | Native LexRadar capability | External option |
| --- | --- | --- |
| AuraPraxis / AI Studio | Outline, draft, revision, review and research lab | Configurable app URL with frame attempt and direct fallback |
| Writing editor | Natural-language revision preserving meaning and citations | User-supplied writing site |
| Stanford STORM | Perspectives -> evidence -> outline -> first draft | Stanford preview launcher |
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
SESSION_SECRET=your-random-server-signing-secret
OPENALEX_API_KEY=optional
CROSSREF_MAILTO=optional
```

Set these in `.env.local` for development, or Vercel environment settings for deployment. Restart the local server after changing them. Never prefix credentials with VITE_. No secret goes into the browser. The Connection panel checks the automatic server session and can test the Gemini connection. WORKSPACE_ACCESS_TOKEN is supported only as a legacy server-side signing-secret fallback. Local environment and access-code files are excluded from Git.


## Research desk v0.3

AuraPraxis now has a native page and a native entry inside Tools. Document type, citation style, source cards, writing tasks, draft editing and Word export operate within LexRadar. It uses the same server Gemini connection as the research lab; it does not require a Google AI Studio frame.

Undetectable AI and Zotero Web are included in the roster. Zotero has a native public-library reader through its official v3 API and RIS exports. Private Zotero libraries need separate authorization; the app does not ask for a private API key in the browser. Undetectable's main site sends SAMEORIGIN/frame-ancestor restrictions. Its official widget is documented at https://undetectable.ai/develop, but the public loader returned HTTP 403 during verification. Native Gemini revision is available alongside its direct launcher; no paid Undetectable integration is claimed.

The Consensus-style literature finder uses real OpenAlex/Crossref records and available abstracts. Its synthesis describes evidence and uncertainty and never presents invented consensus percentages. The Connected App/Composio discovery found Consensus tools, but account authorization is required. A ChatGPT connector grant is distinct from a deployed app's server credential; the current native finder works independently of it.

Profiles and preferences are stored with the local workspace and backed up. They are not Firebase accounts or a multi-user cloud identity service.

Server sessions are signed, HttpOnly and SameSite. Usage guards are per function instance, so provider-side quotas remain the durable billing cap. No Firebase project or paid backend plan was provisioned for these changes.
