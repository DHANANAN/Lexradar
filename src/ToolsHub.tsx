import AuraWorkspace from './AuraWorkspace';
import ZoteroLibrary from './ZoteroLibrary';
import WritingDesk from './WritingDesk';
import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Maximize, RotateCw, Copy } from 'lucide-react';
import { brief, safeUrl, type State } from './model';
export type ToolTarget={id:string;name:string;url:string};
export function toolCatalog(state:State):ToolTarget[]{return [
  {id:'aura',name:'AuraPraxis',url:state.settings.auraUrl},
  {id:'writer',name:'Writing editor',url:state.settings.editorUrl},
  {id:'storm',name:'Stanford STORM',url:'https://storm.genie.stanford.edu/'},
  {id:'papers',name:'Connected Papers',url:'https://www.connectedpapers.com/'},
  {id:'undetectable',name:'Undetectable AI',url:'https://undetectable.ai/'},
  {id:'zotero',name:'Zotero Web',url:'https://www.zotero.org/mylibrary'},
  {id:'consensus',name:'Consensus',url:'https://consensus.app/'},
  {id:'researchtool',name:'Research-Tool',url:'https://researchtool-chi.vercel.app/'}
];}
export function openInWorkspace(name:string,url:string){if(safeUrl(url))window.dispatchEvent(new CustomEvent('lexradar-open-tool',{detail:{id:'source',name,url}}));}
export default function ToolsHub({state,target,change,update,notify}:{state:State;update:(fn:(s:State)=>State)=>void;notify:(s:string)=>void;target:ToolTarget|null;change:(t:ToolTarget)=>void}) {
  const tools=toolCatalog(state),active=target||tools[0];const [attempt,setAttempt]=useState(false),[reload,setReload]=useState(0),[elapsed,setElapsed]=useState(false),[projectId,setProjectId]=useState(state.projects[0]?.id||''),[message,setMessage]=useState('');const frame=useRef<HTMLDivElement>(null);
  useEffect(()=>{setAttempt(false);setElapsed(false);setMessage('');},[active.url]);
  useEffect(()=>{if(!attempt)return;const timer=setTimeout(()=>setElapsed(true),10000);return()=>clearTimeout(timer);},[attempt,reload]);
  const project=state.projects.find(p=>p.id===projectId),projectBrief=project?brief(project,state.venues.find(v=>v.id===project.venueId)):'';
  return <><div className="page-heading"><div><p className="eyebrow">Your connected research desk</p><h1>Tool workspace</h1><p className="subtitle">Use external research tools beside your project brief.</p></div></div><div className="discovery-tabs" aria-label="External tools">{tools.map(t=><button key={t.id} className={active.id===t.id?'active':''} onClick={()=>change(t)}>{t.name}</button>)}</div>
    {active.id==='aura'?<><AuraWorkspace state={state} update={update} notify={notify}/><p className="caption">Native AuraPraxis tools run here. <a href={safeUrl(state.settings.auraUrl)} target="_blank" rel="noreferrer">Open the original AI Studio app</a></p></>:['writer','undetectable'].includes(active.id)?<WritingDesk state={state} update={update} notify={notify} provider={active.name} url={active.url}/>:active.id==='zotero'?<ZoteroLibrary state={state} update={update} notify={notify}/>:<section className="panel"><div className="tool-browser-bar"><div><strong>{active.name}</strong><small>{new URL(safeUrl(active.url)||'https://example.org').hostname}</small></div><div className="button-row"><button onClick={()=>{setAttempt(true);setElapsed(false);setReload(n=>n+1);}}><RotateCw size={14}/>Try inside workspace</button><button disabled={!attempt} onClick={()=>void frame.current?.requestFullscreen().catch(()=>setMessage('Full screen is not available in this browser.'))}><Maximize size={14}/>Full screen</button><a className="button primary" href={safeUrl(active.url)} target="_blank" rel="noopener noreferrer">Open directly <ExternalLink size={14}/></a></div></div>
    <div className="tool-browser-grid"><div className="tool-frame" ref={frame}>{attempt?<><iframe key={active.url+reload} src={safeUrl(active.url)} title={active.name} sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads allow-modals" referrerPolicy="no-referrer" allow="fullscreen"/>{elapsed&&<div className="frame-help">If the page is blank or sign-in fails, use “Open directly”. The provider controls whether it allows embedding.</div>}</>:<div className="empty"><ExternalLink size={28}/><h3>{active.name}</h3><p>Try this tool inside the workspace, or open it directly to use its normal sign-in. Your brief stays available alongside it.</p>{active.id==='aura'&&<p>Google AI Studio applets commonly require their own tab. Use LexRadar’s Research lab and writing studio for the native workflow.</p>}<button onClick={()=>setAttempt(true)}>Open inside workspace</button></div>}</div>
    <aside className="tool-brief"><h2>Project brief</h2><label className="field"><span>Project</span><select value={projectId} onChange={e=>setProjectId(e.target.value)}><option value="">Select a project</option>{state.projects.map(p=><option key={p.id} value={p.id}>{p.title}</option>)}</select></label><textarea aria-label="Transferable project brief" readOnly rows={18} value={projectBrief} placeholder="Create a project to prepare a brief for this tool."/><button disabled={!projectBrief} onClick={()=>void navigator.clipboard.writeText(projectBrief).then(()=>setMessage('Brief copied. Paste it into the external tool.')).catch(()=>setMessage('Clipboard unavailable. Select and copy the brief above.'))}><Copy size={14}/>Copy brief</button><p className="caption">External tools receive the text you choose to paste. Sign-in, availability, and processing are controlled by the provider.</p>{message&&<p role="status">{message}</p>}</aside></div></section>}
  </>;
}
