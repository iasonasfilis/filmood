import { NextResponse } from "next/server";
export const runtime = "nodejs";
const AXES=["dark","pace","emotion","mind","visual","indie","humor","action"] as const;
export async function POST(request:Request){
 try{
  const key=process.env.OPENAI_API_KEY;
  if(!key)return NextResponse.json({error:"Filmate AI is not connected yet. Add OPENAI_API_KEY in Vercel Environment Variables and redeploy."},{status:503});
  const body=await request.json();
  const message=typeof body.message==="string"?body.message.trim().slice(0,2000):"";
  if(!message)return NextResponse.json({error:"Please write what you want to watch."},{status:400});
  const base=body.base&&typeof body.base==="object"?body.base:{};
  const history=Array.isArray(body.history)?body.history.slice(-8).map((m:{role?:string;text?:string})=>({role:m.role==="user"?"user":"assistant",content:String(m.text||"").slice(0,1000)})):[];
  const response=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Authorization":`Bearer ${key}`,"Content-Type":"application/json"},body:JSON.stringify({model:process.env.FILMATE_MODEL||"gpt-4o-mini",temperature:0.6,response_format:{type:"json_object"},messages:[{role:"system",content:"You are Filmate, a thoughtful and conversational movie-discovery companion. Understand free-form Greek or English user requests, their emotional nuance, desired films and constraints. Return ONLY a JSON object with keys reply (a warm, concise 1-3 sentence response in the user's language, without asserting streaming availability), dna (object with all 8 integer 0-100 cinematic preference dimensions: dark,pace,emotion,mind,visual,indie,humor,action). Start from base preferences, adapt meaningfully to the user's request. The movie catalog is small and recommendations will be computed separately, so do not invent film availability, titles, or ratings. No extra keys."},{role:"user",content:JSON.stringify({reference:body.reference,moods:body.moods,base,availableTitles:Array.isArray(body.catalog)?body.catalog.slice(0,50).map((f:{title?:string})=>f.title):[]})},...history,{role:"user",content:message}],max_tokens:450})});
  if(!response.ok){return NextResponse.json({error:"Filmate AI request failed. Please check the API key, model and account billing."},{status:502});}
  const data=await response.json();
  const parsed=JSON.parse(data.choices?.[0]?.message?.content||"{}");
  const dna=Object.fromEntries(AXES.map(axis=>[axis,Math.max(0,Math.min(100,Math.round(Number(parsed.dna?.[axis]??base[axis]??50))))]));
  return NextResponse.json({reply:String(parsed.reply||"Let's find something that fits your mood.").slice(0,800),dna});
 }catch{return NextResponse.json({error:"Filmate could not process this request."},{status:500});}
}
