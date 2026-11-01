import {apiFetch} from './api';
import {useConnection} from './Connection';
import {CitationCards,ResearchText} from './Citations';
import { useEffect, useRef, useState } from 'react';
import { Download, Search, PenLine, X } from 'lucide-react';
import { brief, now, safeUrl, uid, type Project, type Venue } from './model';

type Result = { text: string; references?: { title: string; url: string }[]; searchSuggestions?: string; incomplete?: boolean };
export function Assistant({ text, onApply, discovery = false, initialAction='outline' }: { text: string; onApply?: (text: string) => void; discovery?: boolean; initialAction?:string }) {
  const [action, setAction] = useState(discovery ? 'discover' : initialAction);
  const [instruction, setInstruction] = useState('');
  const {status,connected:configured}=useConnection();
  const [result, setResult] = useState<Result | null>(null), [error, setError] = useState(''), [busy, setBusy] = useState(false);

  const request = useRef<AbortController | null>(null);
  useEffect(() => ()=>request.current?.abort(), []);
  async function run() {
    setBusy(true); setError(''); request.current = new AbortController();
    try {
      const response = await apiFetch('/api/assist', { method: 'POST', signal: request.current.signal, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, text: `${text}\n\nAUTHOR REQUEST\n${instruction}` }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Request failed'); setResult(data);
    } catch (e) { setError(e instanceof Error && e.name === 'AbortError' ? 'Request cancelled. Your document is unchanged.' : e instanceof Error ? e.message : 'Request failed'); }
    finally { setBusy(false); }
  }
  return <section className="studio"><div className="panel-heading"><h2><PenLine size={17}/> {discovery ? 'Search the public web' : 'Aura writing studio'}</h2><span className="tag">{status === null ? 'Checking connection' : configured ? 'Server connected' : 'Setup required'}</span></div>
    <div className="workspace-body"><p className="muted">{discovery ? 'Search official calls and publicly indexed announcements, including LinkedIn. Review the original evidence before saving a publisher.' : 'Work from your brief, source register, and current draft. Review the proposed text before adding it to your document.'}</p>
      {status&&!status.aiConfigured && <p className="notice-box">The site owner must set the Gemini connection on the server. Drafting, local review, uploads, and exports work without them.</p>}
      <div className="form-grid"><label className="field"><span>{discovery ? 'Search mode' : 'Writing task'}</span><select value={action} onChange={e=>setAction(e.target.value)} disabled={busy}>{(discovery ? [['discover','Find calls with Google Search']] : [['outline','Research outline'],['draft','Starting draft'],['revise','Natural language revision'],['review','Completeness review'],['format','Format document & citations']]).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
      <div className="automatic-access">Server session connects automatically</div></div>
      <label className="field"><span>{discovery ? 'What are you looking for?' : 'Directions for this task'}</span><textarea rows={3} value={instruction} onChange={e=>setInstruction(e.target.value)} placeholder={discovery ? 'Indian constitutional law blogs accepting student submissions, no submission or publication fee' : 'Keep the argument focused. Preserve citations. Identify missing evidence.'}/></label>
      <div className="button-row"><button className="primary" disabled={busy || !configured || (discovery && !instruction.trim())} onClick={()=>void run()}>{discovery ? <Search size={15}/> : <PenLine size={15}/>} {busy ? 'Working…' : 'Run task'}</button>{busy && <button onClick={()=>request.current?.abort()}><X size={14}/>Cancel</button>}<small className="muted">Running a task sends the supplied text to Google Gemini.</small></div>
      {error && <p role="alert" className="notice-box warning">{error}</p>}
      {result && <div className="assistant-result"><h3>Proposed output</h3>{result.incomplete && <p role="alert">Output reached its length limit. Ask for a shorter section.</p>}<ResearchText text={result.text} references={result.references}/><CitationCards references={result.references||[]}/>
      {result.searchSuggestions && <iframe title="Google Search suggestions" sandbox="allow-popups allow-popups-to-escape-sandbox" referrerPolicy="no-referrer" srcDoc={result.searchSuggestions} className="search-suggestions"/>}
      <div className="button-row">{onApply && <button className="primary" onClick={()=>onApply(result.text)}>Use as working draft & save version</button>}<button onClick={()=>{const url=URL.createObjectURL(new Blob([result.text],{type:'text/plain'}));const a=document.createElement('a');a.href=url;a.download='lexradar-research-output.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}}><Download size={15}/>Download output</button><button onClick={()=>setResult(null)}>Discard output</button></div><p className="caption">Generated text requires source checking. Acceptance, citations, and completeness are not guaranteed.</p></div>}
    </div></section>;
}
export function ProjectStudio({ project, venue, apply }: { project: Project; venue?: Venue; apply: (project: Project) => void }) {
  return <details className="studio-drawer"><summary><PenLine size={16}/> Open Aura writing studio <span>Outline · Draft · Revise · Review</span></summary><Assistant text={`${brief(project,venue)}\n\nWORKING DRAFT\n${project.draft}`} onApply={text=>{
    const versions = [...project.versions];
    if(project.draft.trim() && !versions.some(v=>v.text===project.draft)) versions.push({id:uid(),name:'Before studio revision',created:now(),text:project.draft,fileName:'',dataUrl:'',mime:'text/plain'});
    versions.push({id:uid(),name:'Studio output — review required',created:now(),text,fileName:'',dataUrl:'',mime:'text/plain'});
    apply({...project,draft:text,versions,events:[...project.events,{id:uid(),date:now(),label:'Studio output accepted as working draft'}]});
  }}/></details>;
}
