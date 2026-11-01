import ReactMarkdown from 'react-markdown';
import {ExternalLink} from 'lucide-react';
import {safeUrl} from './model';
import type {Reference} from './Citations';
export default function ResearchText({text,references=[]}:{text:string;references?:Reference[]}){return <div className="research-prose"><ReactMarkdown components={{a:({href,children})=>{const url=safeUrl(href||'');const index=references.findIndex(r=>r.url===url);return url?<a className="inline-citation" href={url} title={index>=0?references[index].title:url} target="_blank" rel="noopener noreferrer">{index>=0?`[${index+1}] ${references[index].title}`:children}<ExternalLink size={10}/></a>:<span>{children}</span>;},img:({alt})=><span>{alt}</span>}}>{text}</ReactMarkdown></div>;}
