let session:Promise<void>|null=null;
export function ensureSession(force=false){
  if(force)session=null;
  if(!session)session=fetch('/api/session',{credentials:'same-origin'}).then(async r=>{if(!r.ok){const data=await r.json().catch(()=>({}));throw new Error(data.error||'The server session could not be started');}}).catch(e=>{session=null;throw e;});
  return session;
}
export async function apiFetch(url:string,options:RequestInit={}){
  await ensureSession();let r=await fetch(url,{...options,credentials:'same-origin'});
  if(r.status===401){await ensureSession(true);r=await fetch(url,{...options,credentials:'same-origin'});}return r;
}
