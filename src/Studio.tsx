import { useEffect, useRef, useState } from 'react';
import { Download, Search, Sparkles, X } from 'lucide-react';
import { brief, now, safeUrl, uid, type Project, type Venue } from './model';

type Result = { text: string; references?: { title: string; url: string }[]; searchSuggestions?: string; incomplete?: boolean };
export function Assistant({ text, onApply, discovery = false }: { text: string; onApply?: (text: string) => void; discovery?: boolean }) {
  const [action, setAction] = useState(discovery ? 'discover' : 'outline');
  const [instruction, setInstruction] = useState('');
  const [token, setToken] = useState(() => sessionStorage.getItem('lexradar-access') || '');
  const [result, setResult] = useState<Result | null>(null), [error, setError] = useState(''), [busy, setBusy] = useState(false);
  const [configured, setConfigured] = useState<boolean | null>(null);
  const request = useRef<AbortController | null>(null);
  useEffect(() => { fetch('/api/status').then(r=>r.json()).then(s=>setConfigured(s.aiConfigured && s.accessConfigured)).catch(()=>setConfigured(false)); return ()=>request.current?.abort(); }, []);
  async function run() {
    setBusy(true); setError(''); request.current = new AbortController();
    try {
      const response = await fetch('/api/assist', { method: 'POST', signal: request.current.signal, headers: { 'Content-Type': 'application/json', 'x-workspace-token': token }, body: JSON.stringify({ action, text: `${text}\n\nAUTHOR REQUEST\n${instruction}` }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Request failed'); setResult(data);
    } catch (e) { setError(e instanceof Error && e.name === 'AbortError' ? 'Request cancelled. Your document is unchanged.' : e instanceof Error ? e.message : 'Request failed'); }
    finally { setBusy(false); }
  }
  return <section className="studio"><div className="panel-heading"><h2><Sparkles size={17}/> {discovery ? 'Search the public web' : 'Aura writing studio'}</h2><span className="tag">{configured === null ? 'Checking connection' : configured ? 'Server connected' : 'Setup required'}</span></div>
    <div className="workspace-body"><p className="muted">{discovery ? 'Search official calls and publicly indexed announcements, including LinkedIn. Review the original evidence before saving a publisher.' : 'Work from your brief, source register, and current draft. Review the proposed text before adding it to your document.'}</p>
      {!configured && <p className="notice-box">The site owner must set GEMINI_API_KEY and WORKSPACE_ACCESS_TOKEN on the server. Drafting, local review, uploads, and exports work without them.</p>}
      <div className="form-grid"><label className="field"><span>{discovery ? 'Search mode' : 'Writing task'}</span><select value={action} onChange={e=>setAction(e.target.value)} disabled={busy}>{(discovery ? [['discover','Find calls with Google Search']] : [['outline','Research outline'],['draft','Starting draft'],['revise','Natural language revision'],['review','Completeness review']]).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
      <label className="field"><span>Workspace access code</span><input type="password" autoComplete="off" value={token} placeholder="Owner’s access code, not an API key" onChange={e=>{setToken(e.target.value);sessionStorage.setItem('lexradar-access',e.target.value);}}/></label></div>
      <label className="field"><span>{discovery ? 'What are you looking for?' : 'Directions for this task'}</span><textarea rows={3} value={instruction} onChange={e=>setInstruction(e.target.value)} placeholder={discovery ? 'Indian constitutional law blogs accepting student submissions, no submission or publication fee' : 'Keep the argument focused. Preserve citations. Identify missing evidence.'}/></label>
      <div className="button-row"><button className="primary" disabled={busy || !configured || !token || (discovery && !instruction.trim())} onClick={()=>void run()}>{discovery ? <Search size={15}/> : <Sparkles size={15}/>} {busy ? 'Working…' : 'Run task'}</button>{busy && <button onClick={()=>request.current?.abort()}><X size={14}/>Cancel</button>}<small className="muted">Running a task sends the supplied text to Google Gemini.</small></div>
      {error && <p role="alert" className="notice-box warning">{error}</p>}
      {result && <div className="assistant-result"><h3>Proposed output</h3>{result.incomplete && <p role="alert">Output reached its length limit. Ask for a shorter section.</p>}<pre className="text-preview">{result.text}</pre>{result.references?.length ? <ul>{result.references.map((ref,i)=><li key={i}>{safeUrl(ref.url) && <a href={safeUrl(ref.url)} target="_blank" rel="noreferrer">{ref.title || 'Source'}</a>}</li>)}</ul> : null}
      {result.searchSuggestions && <iframe title="Google Search suggestions" sandbox="allow-popups allow-popups-to-escape-sandbox" referrerPolicy="no-referrer" srcDoc={result.searchSuggestions} className="search-suggestions"/>}
      <div className="button-row">{onApply && <button className="primary" onClick={()=>onApply(result.text)}>Use as working draft & save version</button>}<button onClick={()=>{const url=URL.createObjectURL(new Blob([result.text],{type:'text/plain'}));const a=document.createElement('a');a.href=url;a.download='lexradar-research-output.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}}><Download size={15}/>Download output</button><button onClick={()=>setResult(null)}>Discard output</button></div><p className="caption">Generated text requires source checking. Acceptance, citations, and completeness are not guaranteed.</p></div>}
    </div></section>;
}
export function ProjectStudio({ project, venue, apply }: { project: Project; venue?: Venue; apply: (project: Project) => void }) {
  return <details className="studio-drawer"><summary><Sparkles size={16}/> Open Aura writing studio <span>Outline · Draft · Revise · Review</span></summary><Assistant text={`${brief(project,venue)}\n\nWORKING DRAFT\n${project.draft}`} onApply={text=>{
    const versions = [...project.versions];
    if(project.draft.trim() && !versions.some(v=>v.text===project.draft)) versions.push({id:uid(),name:'Before studio revision',created:now(),text:project.draft,fileName:'',dataUrl:'',mime:'text/plain'});
    versions.push({id:uid(),name:'Studio output — review required',created:now(),text,fileName:'',dataUrl:'',mime:'text/plain'});
    apply({...project,draft:text,versions,events:[...project.events,{id:uid(),date:now(),label:'Studio output accepted as working draft'}]});
  }}/></details>;
}
