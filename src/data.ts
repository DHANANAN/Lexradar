import {defaultProfile} from './model';
import type { State, Venue } from './model';

export const AURA_URL = 'https://aistudio.google.com/apps/d327dd40-48d1-4a7d-8121-221625fd1385?fullscreenApplet=true&showPreview=true&showAssistant=true';
export const EDITOR_URL = 'https://www.sthealthwriter.in/';
const nlsSource = 'https://www.nls.ac.in/research/nlsiu-journals-call-for-papers/';
const checked = '2026-11-01';
export const blankVenue: Venue = {
  id: '', name: '', institution: '', category: 'Independent', subject: '', country: 'India', type: 'Journal',
  submissionFee: 'Unknown', publicationFee: 'Unknown', feeNote: 'Fee policy needs confirmation.', feeSource: '',
  url: '', source: '', status: 'Check call', deadline: '', checked: '', words: 'See guidelines', citation: 'See guidelines',
  eligibility: 'Confirm author eligibility', method: 'See official guidelines', review: 'Not stated', reviewDays: null,
  requirements: 'Read the original call before preparing a submission.', aiPolicy: 'Not checked. Read the publisher policy before using AI assistance.'
};
const venue = (id: string, name: string, url: string, values: Partial<Venue>): Venue => ({ ...blankVenue, id, name, url, source: url, ...values });
const nls = (id: string, name: string, slug: string, values: Partial<Venue>): Venue => venue(id, name, `https://repository.nls.ac.in/${slug}/`, {
  institution: 'NLSIU, Bengaluru', category: 'NLU journal', source: nlsSource, checked,
  submissionFee: 'Free', publicationFee: 'Free', feeSource: nlsSource, feeNote: 'University states there are no fees for its repository journals.', ...values
});

export const initialVenues: Venue[] = [
  nls('nlsj', 'National Law School Journal', 'nlsj', { subject: 'Law & society', status: 'Rolling', method: 'Repository submission portal', requirements: 'Original legal or interdisciplinary scholarship; consult category-specific guidelines.' }),
  nls('slr', 'Socio-Legal Review', 'slr', { subject: 'Law & society', status: 'Rolling', source: 'https://repository.nls.ac.in/slr/policies.html', words: 'Articles: 6,000–10,000; comments: 3,000–5,000', citation: 'OSCOLA 4th edition', eligibility: 'Up to three authors', method: 'Digital Commons submission portal', review: 'Desk review: 2 weeks; peer review: 4–6 weeks', reviewDays: 14, requirements: 'Anonymous Word manuscript. EB Garamond 12pt; 1.5 spacing. No simultaneous journal submission. Use an interdisciplinary approach.', aiPolicy: 'AI must have only a minor, assistive role. Read the June 2026 policy and disclosure requirements.' }),
  nls('ijclp', 'International Journal on Consumer Law and Practice', 'ijclp', { subject: 'Consumer law', status: 'Dated call', deadline: '2026-11-01', eligibility: 'Students, academics and practitioners', requirements: 'Volume 14 general issue. Deadline date is stated; closing time and timezone need confirmation.' }),
  nls('jlpp', 'Journal of Law and Public Policy', 'jlpp', { subject: 'Public policy', status: 'Dated call', deadline: '2026-01-31', requirements: 'Listed Volume 9(2) call has expired. Check for a newer issue.' }),
  nls('ijlt', 'Indian Journal of Law and Technology', 'ijlt', { subject: 'Technology & IP', status: 'Dated call', deadline: '2026-05-15', requirements: 'Listed Volume 22 call has expired. Check for the next call.' }),
  nls('ijiel', 'Indian Journal of International Economic Law', 'ijiel', { subject: 'International law', status: 'Dated call', deadline: '2026-05-08', requirements: 'Listed digital competition special issue has expired. Check for a newer call.' }),
  venue('spicyip', 'SpicyIP', 'https://spicyip.com/guest-post-submission-guidelines', { institution: 'Independent IP scholarship', type: 'Blog', subject: 'Technology & IP', checked, status: 'Rolling', words: '900–1,200 preferred; 1,500 maximum', citation: 'Hyperlinks; footnotes for offline sources', method: 'Email in Word format; see guidelines', review: 'No response after 10 days means not taken forward', reviewDays: 10, requirements: 'Indian IP relevance and a public-interest angle. Original, unpublished, exclusive submission. Include title, short summary and bio in email.', aiPolicy: 'Not specified on the checked guidelines page. Confirm with the editors.' }),
  venue('cbcl', 'CBCL Blog', 'https://cbcl.nliu.ac.in/submission-guidelines/', { institution: 'NLIU, Bhopal', category: 'NLU centre', type: 'Blog', subject: 'Corporate & commercial law', checked, status: 'Rolling', words: 'Ideally up to 1,500, excluding endnotes', citation: 'Hyperlinks; consistent Bluebook where needed', eligibility: 'Students and legal professionals', method: 'Google Form linked in guidelines; no email submissions', review: '1–2 weeks for review', reviewDays: 14, requirements: 'Analytical contribution. Title at most 10 words. Provide name, affiliation and suggested category in the form.' }),
  venue('nlsir', 'NLSIR Online', 'https://forum.nls.ac.in/nlsir-online/submission-guidelines/', { institution: 'NLSIU, Bengaluru', category: 'NLU journal', type: 'Blog', subject: 'General law', checked, status: 'Rolling', words: '1,500–3,000', citation: 'Hyperlinks; OSCOLA 4th edition for offline sources', method: 'Google Form; separate form for NLSIU students', review: 'No response after 3 weeks means no longer considered', reviewDays: 21, requirements: 'Original and exclusive manuscript. Times New Roman 12pt, 1.5 spacing. Follow the publisher style guide.', aiPolicy: 'AI-generated content is prohibited.' }),
  venue('rml', 'RMLNLU Law Review Blog', 'https://rmlnlulawreview.com/submit-a-post/', { institution: 'RMLNLU, Lucknow', category: 'NLU journal', type: 'Blog', subject: 'General law', checked, words: '1,300–1,600', citation: 'Hyperlinks; OSCOLA 4th edition when needed', eligibility: 'Law students and other contributors', method: 'Google Form only', requirements: 'Anonymous Word manuscript, 4–5 keywords, British English. A review-pause notice remains on the page; confirm the form is open.', aiPolicy: 'Strict no-AI policy; content must be written entirely by the author.' }),
  venue('volker', 'Völkerrechtsblog', 'https://voelkerrechtsblog.org/authors_/directions-for-authors/', { institution: 'International law research community', category: 'International', country: 'Germany', type: 'Blog', subject: 'International law', checked, status: 'Rolling', words: '1,000–2,000; around 1,500 preferred', citation: 'Hyperlinks', method: 'submissions@voelkerrechtsblog.org', requirements: 'Argumentative contribution with title and subtitle. Exclusive submission preferred; disclose parallel submissions. Peer review timing is not guaranteed.', aiPolicy: 'Generative AI use must follow the linked DFG guidance. AI-generated illustrations are not accepted.' }),
  venue('oxhrh', 'Oxford Human Rights Hub', 'https://ohrh.law.ox.ac.uk/how-to-contribute/', { institution: 'University of Oxford', category: 'International', country: 'United Kingdom', type: 'Blog', subject: 'Human rights', checked, status: 'Rolling', words: '500–700', citation: 'Hyperlinks; no footnotes', eligibility: 'LL.B. or equivalent required; undergraduates not accepted', method: 'oxfordhumanrightshub@law.ox.ac.uk', requirements: 'Recent human-rights legal analysis for an international readership. Original, unpublished work. Current response delays noted.', aiPolicy: 'Only limited language improvement for authors whose first language is not English. AI ideation, drafting, rewriting and paraphrasing are prohibited.' }),
  ...[
    ['indiacorp', 'IndiaCorpLaw', 'https://indiacorplaw.in', 'Independent', 'Corporate & commercial law', 'Blog'],
    ['techlaw', 'Tech Law Forum', 'https://techlawforum.nalsar.ac.in/write-for-us/', 'NALSAR', 'Technology & IP', 'Blog'],
    ['livelaw', 'LiveLaw Columns', 'https://www.livelaw.in/articles/livelaw-editorial-guidelines-article-submissions-551674', 'Legal media', 'General law', 'Blog'],
    ['barbench', 'Bar & Bench Columns', 'https://www.barandbench.com/contact-us', 'Legal media', 'General law', 'Blog'],
    ['gnlu', 'GNLU Student Law Review', 'https://www.gnluslr.com', 'GNLU', 'General law', 'Journal'],
    ['nslr', 'NALSAR Student Law Review', 'https://nslr.in', 'NALSAR', 'General law', 'Journal'],
    ['nluj', 'NLUJ Law Review', 'https://www.nlujodhpur.ac.in/downloads/Submission_Guidelines.pdf', 'NLU Jodhpur', 'General law', 'Journal'],
    ['epw', 'Economic & Political Weekly', 'https://www.epw.in/notes-contributors.html', 'Sameeksha Trust', 'Social sciences', 'Journal'],
    ['nliu', 'NLIU Law Review', 'https://nliulawreview.nliu.ac.in/review-policy/', 'NLIU, Bhopal', 'General law', 'Journal'],
    ['sports', 'Centre for Sports Law & Policy', 'https://cslpnujs.wordpress.com/submissions/', 'NUJS', 'Sports law', 'Blog']
  ].map(([id, name, url, institution, subject, type]) => venue(id, name, url, { institution, subject, type: type as Venue['type'], category: institution.includes('NL') || institution === 'NUJS' ? 'NLU journal' : 'Independent', requirements: 'Directory lead. Current call, fees, eligibility and requirements have not been verified. Check the official source before targeting.' }))
];

export const initialState: State = { schema: 1, profile:defaultProfile, projects: [], venues: initialVenues, tasks: [], settings: { goal: 25, auraUrl: AURA_URL, editorUrl: EDITOR_URL } };
