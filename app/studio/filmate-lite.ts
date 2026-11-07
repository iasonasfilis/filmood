/* Filmate Lite: local, deterministic film-intent interpreter. No API or external service. */
export type FilmateAxis="dark"|"pace"|"emotion"|"mind"|"visual"|"indie"|"humor"|"action";
export type FilmateDNA=Record<FilmateAxis,number>;
type Pattern={words:string[];axis:FilmateAxis;value:number;label:string};
const patterns:Pattern[]=[
 {words:["dark","darker","σκοτειν","μαυρ","ζοφερ","bleak","grim"],axis:"dark",value:90,label:"darker atmosphere"},
 {words:["lighthearted","uplifting","feel good","feel-good","comfort","αισιοδοξ","χαρουμεν","ευχαριστ","αναλαφρ"],axis:"dark",value:15,label:"lighter atmosphere"},
 {words:["slow","slow burn","αργ","αργοκαυ","στοχαστ","meditative"],axis:"pace",value:22,label:"slow-burn pacing"},
 {words:["fast","faster","γρηγορ","ρυθμ","kinetic","nonstop"],axis:"pace",value:88,label:"faster pacing"},
 {words:["cry","heartbreak","sad","tearjerker","κλαψ","κλαμα","συγκινη","στεναχωρ","λυπηρ"],axis:"emotion",value:97,label:"emotional impact"},
 {words:["cold","detached","emotionless","χωρις συναισθημα","ασυγκινητ"],axis:"emotion",value:22,label:"emotional distance"},
 {words:["mind bending","mind-bending","twist","complex","puzzle","mindfuck","φιλοσοφ","μυστηρ","ανατροπ","μπερδε","εγκεφαλ"],axis:"mind",value:93,label:"complex storytelling"},
 {words:["simple","easy to follow","απλ","ευκολο","ξεκουραστ"],axis:"mind",value:24,label:"accessible storytelling"},
 {words:["beautiful","cinematography","visual","aesthetic","εικον","φωτογραφ","οπτικ","ομορφ","ατμοσφαιρ"],axis:"visual",value:94,label:"visual atmosphere"},
 {words:["arthouse","indie","experimental","σινεφιλ","ανεξαρτητ","πειραματικ","φεστιβαλ"],axis:"indie",value:95,label:"arthouse sensibility"},
 {words:["mainstream","blockbuster","εμπορικ","χολιγουντ"],axis:"indie",value:18,label:"mainstream storytelling"},
 {words:["funny","comedy","humor","hilarious","αστει","κωμωδ","γελα","χιουμορ"],axis:"humor",value:94,label:"humor"},
 {words:["serious","no jokes","σοβαρ","χωρις χιουμορ"],axis:"humor",value:7,label:"serious tone"},
 {words:["action","thrill","tense","intense","suspense","adrenaline","δρασ","εντασ","αγωνι","θριλερ"],axis:"action",value:92,label:"tension and action"},
 {words:["gentle","peaceful","calm","relax","ηρεμ","χαλαρ","χωρις δραση"],axis:"action",value:12,label:"gentle atmosphere"}
];
const axes:FilmateAxis[]=["dark","pace","emotion","mind","visual","indie","humor","action"];
const norm=(s:string)=>s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/ς/g,"σ");
const negation=/^(?:no|not|without|less|avoid|dont|don't|μη|μην|οχι|χωρισ|λιγοτερο)(?:\s+\S+){0,2}\s*$/;
export function interpretFilmate(message:string,base:FilmateDNA,filmTitles:string[],historyCount:number){
 const text=norm(message.trim());
 const result={...base};const found:string[]=[];const avoided:string[]=[];
 const matches:{axis:FilmateAxis;value:number;label:string;negated:boolean;position:number}[]=[];
 for(const p of patterns)for(const word of p.words){const token=norm(word);const idx=text.indexOf(token);if(idx<0)continue;const prefix=text.slice(Math.max(0,idx-35),idx);const isNegated=negation.test(prefix.slice(-38));matches.push({axis:p.axis,value:p.value,label:p.label,negated:isNegated,position:idx});break;}
 const unique=new Map<FilmateAxis,typeof matches[number]>();
 for(const match of matches.sort((a,b)=>a.position-b.position))unique.set(match.axis,match);
 for(const match of Array.from(unique.values())){if(match.negated){avoided.push(match.label);result[match.axis]=Math.round(result[match.axis]*.35+(100-match.value)*.65);}else{found.push(match.label);result[match.axis]=Math.round(result[match.axis]*.2+match.value*.8);}}
 const mentioned=filmTitles.find(title=>text.includes(norm(title)));
 const isQuestion=/\?|τι (να|μου)|what (should|can)|recommend|προτειν|suggest|help|βοηθ/.test(text);
 const greeting=/^(hi|hello|hey|γεια|καλησπερα|καλημερα)[!.\s]*$/.test(text);
 const short=text.length<5;
 let reply="";
 if(greeting)reply="Hey! I'm Filmate Lite. Tell me the kind of film you want — a feeling, a movie you loved, or what you want to avoid. I’ll use our film catalog to find a match.";
 else if(found.length||avoided.length){const features=[...found,...avoided.map(x=>"less "+x)];reply="Got it — I'm steering toward "+features.slice(0,4).join(", ")+(mentioned?", taking "+mentioned+" as a reference":"")+". I’ve adjusted the film DNA and ranked the available titles. Want it darker, funnier, slower or more emotional?";}
 else if(mentioned)reply="You mentioned "+mentioned+". I can use its cinematic DNA as a starting point. Tell me what you loved about it — the mood, the pacing, the ideas, or the emotional impact — and I’ll narrow the matches.";
 else if(greeting||short)reply="Tell me a little more: do you want something emotional, mind-bending, funny, intense or comforting?";
 else if(isQuestion)reply="I can help you explore the films in our demo catalog. Try describing the feeling you want, for example: ‘Something like Arrival, but darker and faster.’";
 else reply="I hear you. I can interpret moods, pacing, atmosphere, tension and film references, but I may miss more nuanced requests. Try adding a few words about the feeling you want.";
 const understood=found.length>0||avoided.length>0||Boolean(mentioned);
 return {dna:result,reply,understood,historyCount,matched:found,avoided};
}
