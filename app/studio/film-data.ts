/** Shared, curated prototype catalog. Credits and streaming availability are intentionally not invented. */
export type Axis = "dark" | "pace" | "emotion" | "mind" | "visual" | "indie" | "humor" | "action";
export type DNA = Record<Axis, number>;
export type Film = { id:number; title:string; year:number; length:number; region:"American"|"European"|"Asian"|"World"; genres:string[]; description:string; dna:DNA; poster?:string };
const dna = (dark:number,pace:number,emotion:number,mind:number,visual:number,indie:number,humor:number,action:number):DNA=>({dark,pace,emotion,mind,visual,indie,humor,action});
export const FILMS:Film[]=[
  {id:1,title:"Arrival",year:2016,length:116,region:"American",genres:["Sci-fi","Drama"],description:"A profound encounter with language, memory and loss.",dna:dna(59,35,86,88,83,45,5,25),poster:"4Iu5f2nv7huqvuYkmZvSPOtbFjs.jpg"},
  {id:2,title:"Her",year:2013,length:126,region:"American",genres:["Romance","Sci-fi"],description:"A lonely, tender vision of connection and technology.",dna:dna(35,38,91,72,77,55,25,8),poster:"eCOtqtfvn7mxGl6nfmq4b1exJRc.jpg"},
  {id:3,title:"After Yang",year:2021,length:96,region:"American",genres:["Sci-fi","Drama"],description:"A delicate, intimate meditation on memory and family.",dna:dna(40,20,89,72,84,88,10,5)},
  {id:4,title:"Annihilation",year:2018,length:115,region:"American",genres:["Sci-fi","Mystery"],description:"Dreamlike science fiction that becomes deeply unsettling.",dna:dna(86,52,54,95,85,67,4,55)},
  {id:5,title:"Coherence",year:2013,length:89,region:"American",genres:["Sci-fi","Thriller"],description:"A tightly wound, inventive dinner-party mystery.",dna:dna(70,77,46,91,43,94,11,45)},
  {id:6,title:"Ex Machina",year:2014,length:108,region:"European",genres:["Sci-fi","Thriller"],description:"A precise, philosophical game of manipulation.",dna:dna(77,53,58,91,77,55,12,44)},
  {id:7,title:"Moon",year:2009,length:97,region:"European",genres:["Sci-fi","Drama"],description:"An isolated astronaut confronts the meaning of identity.",dna:dna(55,38,77,78,64,74,15,27)},
  {id:8,title:"Eternal Sunshine of the Spotless Mind",year:2004,length:108,region:"American",genres:["Romance","Drama"],description:"An inventive, aching trip through love and memory.",dna:dna(45,64,94,80,88,55,62,14)},
  {id:9,title:"Nightcrawler",year:2014,length:117,region:"American",genres:["Crime","Thriller"],description:"An unnerving portrait of ambition after dark.",dna:dna(94,79,50,68,74,64,45,67),poster:"8oPY6ULFOTbAEskySNhgsUIN4fW.jpg"},
  {id:10,title:"The Nice Guys",year:2016,length:116,region:"American",genres:["Comedy","Crime"],description:"A chaotic buddy mystery with razor-sharp humor.",dna:dna(41,91,42,45,60,35,93,75)},
  {id:11,title:"In Bruges",year:2008,length:107,region:"European",genres:["Crime","Comedy"],description:"Darkly funny, violent and unexpectedly heartfelt.",dna:dna(72,50,84,65,74,66,84,52)},
  {id:12,title:"Kiss Kiss Bang Bang",year:2005,length:103,region:"American",genres:["Crime","Comedy"],description:"A quick-witted noir that constantly surprises.",dna:dna(51,86,52,60,61,50,94,70)},
  {id:13,title:"Parasite",year:2019,length:132,region:"Asian",genres:["Thriller","Drama"],description:"A genre-shifting mix of suspense, satire and family.",dna:dna(74,78,79,85,84,76,71,61),poster:"7IiTTgloJzvGI1TAYymCfbfl3vT.jpg"},
  {id:14,title:"Burning",year:2018,length:148,region:"Asian",genres:["Mystery","Drama"],description:"A quietly devastating mystery of uncertainty.",dna:dna(91,25,77,88,91,88,10,25)},
  {id:15,title:"Drive",year:2011,length:100,region:"American",genres:["Crime","Drama"],description:"Neon nights, silence and sudden violence.",dna:dna(76,48,65,63,96,60,12,77)},
  {id:16,title:"The Grand Budapest Hotel",year:2014,length:99,region:"American",genres:["Comedy","Adventure"],description:"Stylized, witty and bittersweet.",dna:dna(37,84,78,67,99,58,86,38),poster:"eWdyYQreja6JGCzqHw5Q3x8l9a2.jpg"},
  {id:17,title:"Aftersun",year:2022,length:102,region:"European",genres:["Drama"],description:"A subtle emotional afterimage of family and memory.",dna:dna(55,20,99,62,85,92,12,5)},
  {id:18,title:"Before Sunset",year:2004,length:80,region:"European",genres:["Romance","Drama"],description:"An intimate conversation heavy with time and longing.",dna:dna(23,35,93,72,78,80,58,0)},
  {id:19,title:"Past Lives",year:2023,length:106,region:"American",genres:["Romance","Drama"],description:"A quietly moving story of paths not taken.",dna:dna(40,25,94,72,82,71,30,2)},
  {id:20,title:"The Handmaiden",year:2016,length:145,region:"Asian",genres:["Thriller","Drama"],description:"Intricate deception, desire and lavish visual style.",dna:dna(87,69,74,89,97,70,42,50),poster:"dLlH4aNHdnmf62umnInL8xPlPzw.jpg"},
  {id:21,title:"Oldboy",year:2003,length:120,region:"Asian",genres:["Thriller","Action"],description:"A brutal, shocking and emotionally charged mystery.",dna:dna(98,79,76,79,90,66,25,90)},
  {id:22,title:"The Lobster",year:2015,length:119,region:"European",genres:["Comedy","Drama"],description:"Absurd dark humor in an unsettling parallel world.",dna:dna(72,30,61,87,90,80,78,20)},
  {id:23,title:"The Worst Person in the World",year:2021,length:128,region:"European",genres:["Comedy","Drama"],description:"A lively, funny and affecting story of growing up.",dna:dna(42,67,87,74,73,83,72,12)}
];

export const findFilmById=(id:number)=>FILMS.find(f=>f.id===id);
