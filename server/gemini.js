const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
export async function providerRequest(payload,env,timeout=55000){
 const signal=AbortSignal.timeout(timeout),primary=env.GEMINI_MODEL||'gemini-2.5-flash',fallback=env.GEMINI_FALLBACK_MODEL||'gemini-2.5-flash-lite';
 for(let attempt=0;attempt<3;attempt++){
  const model=attempt===2?fallback:primary;
  const response=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,{method:'POST',signal,headers:{'Content-Type':'application/json','x-goog-api-key':env.GEMINI_API_KEY},body:JSON.stringify(payload)});
  if(![500,502,503,504].includes(response.status)||attempt===2)return response;
  await response.body?.cancel();await delay(350);
 }
 throw new Error('The research provider is temporarily unavailable');
}
