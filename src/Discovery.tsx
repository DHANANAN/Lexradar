import { useEffect, useState } from 'react';
import { get, set } from 'idb-keyval';
import { RefreshCw, BookmarkPlus, ExternalLink } from 'lucide-react';
import { Assistant } from './Studio';
import { safeUrl } from './model';

type Source = { id:string; name:string; kind:string; url:string; format:string; coverage:string };
export type Call = { id:string;title:string;url:string;summary:string;published:string;sourceId:string;sourceName:string;fetchedAt:string };
export default function Discovery({ save }: { save:(call:Call)=>void }) {
  const [sources,setSources]=useState<Source[]>([]),[calls,setCalls]=useState<Call[]>([]),[busy,setBusy]=useState(''),[error,setError]=useState('');
  const [query,setQuery]=useState(''),[source,setSource]=useState('all'),[tab,setTab]=useState('calls');
  const [reports,setReports]=useState<Record<string,string>>({});
  useEffect(()=>{fetch('/api/status').then(r=>r.json()).then(s=>setSources(s.sources)).catch(()=>setError('Discovery server unavailable. Start the development server or open the deployed site.'));get('lexradar-discovery').then(data=>{if(Array.isArray(data))setCalls(data);else fetch('/discovery-snapshot.json').then(r=>r.json()).then(data=>{if(Array.isArray(data))setCalls(data);}).catch(()=>{});}).catch(()=>setError('Saved discovery results could not be read.'));},[]);
  async function refresh(id:string) {
    setBusy(id);setError('');
    try { const response=await fetch('/api/discover?source='+encodeURIComponent(id));const data=await response.json();if(!response.ok)throw new Error(data.error || 'Source could not be fetched');
      const next=[...data.calls,...calls.filter(c=>!data.calls.some((n:Call)=>n.url===c.url))].slice(0,600);await set('lexradar-discovery',next);setCalls(next);setReports(r=>({...r,[id]:`${data.calls.length} leads fetched · ${new Date(data.fetchedAt).toLocaleString()}`}));
    } catch(e) {const message=e instanceof Error?e.message:'Fetch failed';setError(message);setReports(r=>({...r,[id]:'Fetch failed: '+message}));}finally{setBusy('');}
  }
  const filtered=calls.filter(c=>(source==='all'||c.sourceId===source)&&`${c.title} ${c.summary}`.toLowerCase().includes(query.toLowerCase()));
  return <><div className="page-heading"><div><p className="eyebrow">An evidence-led publication index</p><h1>Discover calls</h1><p className="subtitle">Gather announcements. Check the original. Build your shortlist.</p></div><span className="tag">{calls.length} saved leads</span></div>
    <div className="discovery-tabs" role="tablist" aria-label="Discovery views">{[['calls','Live feed'],['sources','Source register'],['search','Web research']].map(([id,label])=><button role="tab" aria-selected={tab===id} key={id} className={tab===id?'active':''} onClick={()=>setTab(id)}>{label}</button>)}</div>
    {error&&<p role="alert" className="notice-box warning">{error}</p>}
    {tab==='search'?<Assistant text="Find publication opportunities for students in law and social sciences." discovery/>:tab==='sources'?<section className="panel"><div className="panel-heading"><h2>Source register</h2><small>Feeds, official references, and public search</small></div><div className="table-scroll"><table><thead><tr><th>Source</th><th>Coverage</th><th>Access</th><th>Latest fetch</th></tr></thead><tbody>{sources.map(s=><tr key={s.id}><td><a href={safeUrl(s.url)} target="_blank" rel="noreferrer">{s.name}</a><small>{s.kind}</small></td><td>{s.coverage}</td><td>{s.format==='reference'?'Official reference — manual review':s.format==='search'?'Google public search':<button disabled={!!busy} onClick={()=>void refresh(s.id)}>{busy===s.id?'Fetching…':'Fetch announcements'}</button>}</td><td><small>{reports[s.id]||'Not fetched in this session'}</small></td></tr>)}</tbody></table></div><div className="panel-foot">Source inclusion is not an endorsement. Publisher identity, fees, indexing and current submission terms require evidence from the publisher.</div></section>:<>
    <section className="panel"><div className="filter-bar"><input aria-label="Search discovered calls" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search titles and announcement text"/><select aria-label="Discovery source" value={source} onChange={e=>setSource(e.target.value)}><option value="all">All sources</option>{sources.filter(s=>['rss','html'].includes(s.format)).map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select><button className="primary" disabled={!!busy} onClick={()=>void refresh(source==='all'?'livelaw':source)}><RefreshCw size={15}/>{busy?'Fetching…':'Fetch latest'}</button></div>
    <div className="panel-foot">Announcements are unverified leads. Both fees and deadlines remain unknown until you check and record the publisher’s terms.</div>
    {filtered.length?<div className="call-list">{filtered.map(c=><article key={c.id}><div className="row between"><span className="eyebrow">{c.sourceName}</span><span className="tag">Needs verification</span></div><h2>{c.title}</h2>{c.summary&&<p>{c.summary}</p>}<small>Fetched {new Date(c.fetchedAt).toLocaleString()}{c.published&&` · Posted ${new Date(c.published).toLocaleDateString()}`}</small><div className="button-row"><a className="button" href={safeUrl(c.url)} target="_blank" rel="noreferrer">Original announcement <ExternalLink size={13}/></a><button onClick={()=>save(c)}><BookmarkPlus size={14}/>Save to publisher index</button></div></article>)}</div>:<div className="empty"><RefreshCw size={25}/><h3>{query?'No matching announcements':'Your discovery inbox starts here'}</h3><p>Fetch the latest announcements or choose another provider in the source register.</p></div>}</section></>}
  </>;
}
