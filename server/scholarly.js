const cache = new Map();
async function json(url, headers = {}) {
  const response = await fetch(url, { headers: { Accept:'application/json', 'User-Agent':'LexRadar/0.2 scholarly research workbench', ...headers }, signal:AbortSignal.timeout(18000) });
  if (!response.ok) { await response.body?.cancel(); throw new Error(`Scholarly provider returned HTTP ${response.status}`); }
  return response.json();
}
const doiUrl = value => value ? `https://doi.org/${String(value).replace(/^https?:\/\/(dx\.)?doi\.org\//,'')}` : '';
export function normalizeOpenAlex(work) {
  return { id:work.id, title:work.title || 'Untitled work', year:work.publication_year || null,
    authors:(work.authorships || []).slice(0,6).map(a=>a.author?.display_name).filter(Boolean),
    venue:work.primary_location?.source?.display_name || '', doi:work.doi || '',
    url:work.doi || work.primary_location?.landing_page_url || work.id,
    openUrl:work.open_access?.oa_url || '', citations:work.cited_by_count || 0,
    references:work.referenced_works || [], provider:'OpenAlex' };
}
export function normalizeCrossref(work) {
  return { id:doiUrl(work.DOI), title:work.title?.[0] || 'Untitled work', year:work.published?.['date-parts']?.[0]?.[0] || null,
    authors:(work.author || []).slice(0,6).map(a=>[a.given,a.family].filter(Boolean).join(' ')),
    venue:work['container-title']?.[0] || '', doi:doiUrl(work.DOI),url:doiUrl(work.DOI),openUrl:'',
    citations:work['is-referenced-by-count'] || 0,references:(work.reference || []).filter(r=>r.DOI).map(r=>doiUrl(r.DOI)),provider:'Crossref' };
}
export async function scholarlySearch(query, provider='openalex', env=process.env) {
  if (typeof query !== 'string' || query.trim().length < 3 || query.length > 250) throw new Error('Enter a topic or DOI between 3 and 250 characters');
  if (!['openalex','crossref'].includes(provider)) throw new Error('Unknown scholarly provider');
  const key=provider+':'+query;const old=cache.get(key);if(old&&Date.now()-old.time<900000)return old.data;
  let works, fallbackReason='';
  if(provider==='openalex') {
    try {
      const url=new URL('https://api.openalex.org/works');url.searchParams.set('search',query);url.searchParams.set('per-page','24');
      const data=await json(url,env.OPENALEX_API_KEY?{Authorization:`Bearer ${env.OPENALEX_API_KEY}`} : {});works=(data.results || []).map(normalizeOpenAlex);
    } catch(error) { fallbackReason=error.message;provider='crossref'; }
  }
  if(provider==='crossref') {
    const url=new URL('https://api.crossref.org/works');url.searchParams.set('query.bibliographic',query);url.searchParams.set('rows','24');
    if(env.CROSSREF_MAILTO)url.searchParams.set('mailto',env.CROSSREF_MAILTO);
    const data=await json(url);works=(data.message?.items || []).map(normalizeCrossref);
  }
  const data={works,provider:provider==='openalex'?'OpenAlex':'Crossref',fallbackReason,fetchedAt:new Date().toISOString()};
  if(cache.size>100)cache.clear();cache.set(key,{time:Date.now(),data});return data;
}
export function paperEdges(works, mode='references') {
  const edges=[];
  for(let i=0;i<works.length;i++)for(let j=i+1;j<works.length;j++) {
    const a=works[i],b=works[j];
    if(mode==='direct') {
      if(a.references.includes(b.id))edges.push({source:a.id,target:b.id,weight:1,kind:'citation'});
      if(b.references.includes(a.id))edges.push({source:b.id,target:a.id,weight:1,kind:'citation'});
    } else {
      const refs=new Set(b.references);const shared=[...new Set(a.references)].filter(r=>refs.has(r)).length;
      if(shared)edges.push({source:a.id,target:b.id,weight:shared,kind:'shared references'});
    }
  }
  return edges;
}
