import { z } from 'zod';

export const stages = ['Brief', 'Research', 'Draft', 'Review', 'Submit', 'Published'] as const;
export const outcomes = ['Submitted', 'Under review', 'Revisions requested', 'Accepted', 'Rejected', 'Withdrawn', 'Published'] as const;
const text = z.string().max(15000000);
const day = z.iso.date().or(z.literal(''));
const timestamp = z.iso.datetime({ offset: true });
export const venueSchema = z.object({
  id: z.string(), name: z.string().min(1), institution: z.string(), category: z.string(), subject: z.string(),
  country: z.string(), type: z.enum(['Journal', 'Blog']),
  submissionFee: z.enum(['Free', 'Paid', 'Unknown']), publicationFee: z.enum(['Free', 'Paid', 'Unknown']),
  feeNote: z.string(), feeSource: z.string(), url: z.string(), source: z.string(),
  status: z.enum(['Rolling', 'Dated call', 'Check call']), deadline: day, checked: day,
  words: z.string(), citation: z.string(), eligibility: z.string(), method: z.string(),
  review: z.string(), reviewDays: z.number().nonnegative().nullable(), requirements: z.string(), aiPolicy: z.string()
});
export type Venue = z.infer<typeof venueSchema>;
const versionSchema = z.object({ id: z.string(), name: z.string(), created: timestamp, text,
  fileName: z.string(), dataUrl: z.string().max(15000000), mime: z.string() });
const submissionSchema = z.object({ id: z.string(), venueId: z.string(), venueName: z.string(), versionId: z.string(),
  date: day, status: z.enum(outcomes), reference: z.string(), url: z.string() });
export const projectSchema = z.object({
  id: z.string(), title: z.string().min(1), question: z.string(), venueId: z.string(), docType: z.string(),
  citation: z.string(), words: z.string(), notes: text, stage: z.number().int().min(0).max(5), created: timestamp,
  draft: text, versions: z.array(versionSchema), checks: z.array(z.string()),
  research: z.object({ outputs:z.array(z.object({id:z.string(),action:z.string(),text,created:timestamp,references:z.array(z.object({title:z.string(),url:z.string()})),searchSuggestions:z.string(),incomplete:z.boolean()})) }).default({outputs:[]}),
  sources: z.array(z.object({ id: z.string(), title: z.string(), url: z.string(), note: z.string(), verified: z.boolean() })),
  submissions: z.array(submissionSchema), events: z.array(z.object({ id: z.string(), date: timestamp, label: z.string() }))
});
export type Project = z.infer<typeof projectSchema>;
export const taskSchema = z.object({ id: z.string(), title: z.string().min(1), projectId: z.string(), due: day, done: z.boolean() });
export type Task = z.infer<typeof taskSchema>;
export const stateSchema = z.object({
  schema: z.literal(1), projects: z.array(projectSchema), venues: z.array(venueSchema), tasks: z.array(taskSchema),
  settings: z.object({ goal: z.number().int().min(1).max(1000), auraUrl: z.string(), editorUrl: z.string() })
});
export type State = z.infer<typeof stateSchema>;
export const uid = () => crypto.randomUUID();
export const now = () => new Date().toISOString();
export const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
export const formatDate = (date: string) => date ? new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' }).format(new Date(date.length === 10 ? date + 'T12:00:00+05:30' : date)) : 'Not recorded';
export const wordCount = (value: string) => value.trim() ? value.trim().split(/\s+/).length : 0;
export const safeUrl = (value: string) => { try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : ''; } catch { return ''; } };
export const isFree = (v: Venue) => v.submissionFee === 'Free' && v.publicationFee === 'Free';
export const callStatus = (v: Venue) => v.deadline && v.deadline < today() ? 'Closed' : v.deadline === today() ? 'Due today' : v.status;
export const checklist = [
  ['sources', 'Sources and quotations checked against the originals'],
  ['argument', 'Argument, originality, and research question reviewed'],
  ['format', 'Word limit, citations, and file format match the guidelines'],
  ['anonymous', 'Author details removed where anonymous review is required'],
  ['ai', 'Publisher AI policy checked and required disclosures prepared'],
  ['exclusive', 'Eligibility and simultaneous-submission policy checked']
] as const;
export function newProject(title: string, venue?: Venue): Project {
  return { id: uid(), title, question: '', venueId: venue?.id || '', docType: venue?.type === 'Blog' ? 'Article' : 'Research Paper',
    citation: venue?.citation || 'Bluebook', words: venue?.words || '', notes: '', stage: 0, created: now(), draft: '',
    research:{outputs:[]}, versions: [], checks: [], sources: [], submissions: [], events: [{ id: uid(), date: now(), label: 'Research project created' }] };
}
export function brief(p: Project, v?: Venue) {
  return `RESEARCH BRIEF\n\nTitle: ${p.title}\nResearch question: ${p.question || 'To be defined'}\nDocument type: ${p.docType}\nTarget: ${v?.name || 'Not selected'}\nWord limit: ${p.words || v?.words || 'To be confirmed'}\nCitations: ${p.citation}\n\nPUBLISHER REQUIREMENTS\n${v?.requirements || 'Check the target publisher guidelines.'}\nEligibility: ${v?.eligibility || 'To be checked'}\nAI policy: ${v?.aiPolicy || 'Check before using AI assistance.'}\nGuidelines: ${v?.source || ''}\n\nRESEARCH NOTES\n${p.notes || 'No notes yet'}\n\nSOURCE REGISTER\n${p.sources.map(s => `${s.title}\n${s.url}\n${s.note}\nChecked: ${s.verified ? 'Yes' : 'No'}`).join('\n\n') || 'Add primary and secondary sources.'}\n\nTASK\nHelp develop a focused research outline and identify evidence gaps within the publisher policy above. Preserve the author’s argument. Do not invent cases, quotations, citations, or findings. Mark unsupported claims for verification. Distinguish source material from interpretation. Do not add author identity to an anonymous manuscript.`;
}
export function coverLetter(p: Project, v?: Venue) {
  return `Subject: Submission — ${p.title}\n\nDear Editorial Board,\n\nPlease find attached my ${p.docType.toLowerCase()}, “${p.title}”, for consideration${v ? ' by ' + v.name : ''}.\n\nResearch question: ${p.question || '[Add a concise statement of the contribution]'}\nWord count: ${wordCount(p.draft) || '[Confirm final word count]'}\nCitation style: ${p.citation}\n\n[Add author details and affiliation if requested.]\n[Confirm originality and exclusivity only if accurate.]\n[Include any AI-use, conflict-of-interest, or other required disclosures.]\n\nThank you for considering this submission.\n\nKind regards,\n[Author name]\n[Contact details]`;
}
export function validateBackup(raw: unknown): State {
  const state = stateSchema.parse(raw);
  const unique = (ids: string[]) => new Set(ids).size === ids.length;
  if (!unique(state.projects.map(p=>p.id)) || !unique(state.venues.map(v=>v.id)) || !unique(state.tasks.map(t=>t.id))) throw new Error('Duplicate record identifiers in backup.');
  for (const p of state.projects) {
    if (!unique(p.versions.map(v=>v.id))) throw new Error('Duplicate document identifiers.');
    for (const v of p.versions) if (v.dataUrl && !/^data:[a-z0-9.+\-/]*;base64,[A-Za-z0-9+/=\r\n]*$/i.test(v.dataUrl)) throw new Error('Invalid file attachment in backup.');
    if (p.submissions.some(s=>!p.versions.some(v=>v.id===s.versionId))) throw new Error('Submission references a missing document.');
  }
  return state;
}
