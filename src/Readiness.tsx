import { wordCount, type Project, type Venue } from './model';
export default function Readiness({project:p,venue:v}:{project:Project;venue?:Venue}) {
  const checks = [
    ['Research question',!!p.question.trim(),'Define the question in the Brief tab.'],
    ['Manuscript text',wordCount(p.draft)>0,'Write or import a working draft.'],
    ['Source register',p.sources.length>0,'Record the sources supporting the argument.'],
    ['Sources checked',p.sources.length>0&&p.sources.every(s=>s.verified),'Read and verify each original source.'],
    ['Publisher selected',!!v,'Choose the publisher and record its requirements.'],
    ['Submission version',p.versions.some(x=>x.text===p.draft)&&!!p.draft,'Save a version of the current text.'],
    ['Verification markers resolved',!!p.draft&&!/\[VERIFY\]|\[TODO\]|\[CITATION NEEDED\]/i.test(p.draft),'Resolve outstanding verification markers.']
  ] as const;
  return <section className="readiness"><h3>Document readiness</h3><p className="caption">Mechanical checks only. This does not assess originality, legal accuracy, or acceptance.</p><ul>{checks.map(([label,done,help])=><li key={label}><strong className={done?'ready':'pending'}>{done?'✓':'○'} {label}</strong>{!done&&<small>{help}</small>}</li>)}</ul><div className="panel-foot">{wordCount(p.draft).toLocaleString()} words · Target: {p.words||v?.words||'No word limit recorded'}</div></section>;
}
