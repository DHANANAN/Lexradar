import {createHmac,randomBytes,timingSafeEqual} from 'node:crypto';
const cookieName='lexradar_session',limits=new Map();
const secret=env=>env.SESSION_SECRET||env.WORKSPACE_ACCESS_TOKEN;
function sign(payload,env){return createHmac('sha256',secret(env)).update(payload).digest('base64url');}
export function issueSession(env=process.env,clock=Date.now()){
  if(!secret(env))throw new Error('Server session configuration is missing');
  const payload=Buffer.from(JSON.stringify({id:randomBytes(18).toString('base64url'),expires:clock+86400000})).toString('base64url');return `${payload}.${sign(payload,env)}`;
}
export function readSession(cookie='',env=process.env,clock=Date.now()){
  if(!secret(env))return null;
  const token=cookie.split(';').map(p=>p.trim()).find(p=>p.startsWith(cookieName+'='))?.slice(cookieName.length+1);
  if(!token||token.length>600)return null;
  try{const [payload,signature]=token.split('.');const expected=sign(payload,env),a=Buffer.from(signature),b=Buffer.from(expected);if(a.length!==b.length||!timingSafeEqual(a,b))return null;const data=JSON.parse(Buffer.from(payload,'base64url'));return typeof data.id==='string'&&data.expires>clock?data:null;}catch{return null;}
}
export function sessionCookie(value,secure){return `${cookieName}=${value}; HttpOnly; SameSite=Lax; Path=/; Max-Age=86400${secure?'; Secure':''}`;}
export function allowRequest(req,clock=Date.now()){
  // Per-instance abuse guard; configure a provider budget for a durable cost limit.
  const ip=String(req.headers['x-vercel-forwarded-for']||req.headers['x-forwarded-for']||req.socket?.remoteAddress||'local').split(',')[0];
  if(limits.size>10000)for(const [k,v]of limits)if(clock-v.dayStart>86400000)limits.delete(k);
  const e=limits.get(ip)||{minuteStart:clock,minute:0,dayStart:clock,day:0};
  if(clock-e.minuteStart>60000){e.minuteStart=clock;e.minute=0;}if(clock-e.dayStart>86400000){e.dayStart=clock;e.day=0;}
  if(e.minute>=12||e.day>=60)return false;e.minute++;e.day++;limits.set(ip,e);return true;
}
