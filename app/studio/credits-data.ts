/** Seed credits are limited to titles whose people/roles were checked against published film records.
 * Expand through a verified provider integration; do not infer additional cast or filmographies.
 * In Bruges: https://www.impawards.com/2008/in_bruges.html
 * The Handmaiden: https://www.koreanfilm.or.kr/eng/films/index/filmsView.jsp?movieCd=20144444
 */
export type CreditRole="Cast"|"Direction"|"Writing"|"Cinematography"|"Editing"|"Music"|"Production";
export type VerifiedCredit={personId:string;name:string;role:CreditRole;character?:string};
export const VERIFIED_CREDITS:Record<number,VerifiedCredit[]>={
 11:[
  {personId:"colin-farrell",name:"Colin Farrell",role:"Cast"},
  {personId:"brendan-gleeson",name:"Brendan Gleeson",role:"Cast"},
  {personId:"ralph-fiennes",name:"Ralph Fiennes",role:"Cast"},
  {personId:"clemence-poesy",name:"Clémence Poésy",role:"Cast"},
  {personId:"martin-mcdonagh",name:"Martin McDonagh",role:"Direction"},
  {personId:"martin-mcdonagh",name:"Martin McDonagh",role:"Writing"}
 ],
 20:[
  {personId:"kim-min-hee",name:"Kim Min-hee",role:"Cast"},
  {personId:"kim-tae-ri",name:"Kim Tae-ri",role:"Cast"},
  {personId:"ha-jung-woo",name:"Ha Jung-woo",role:"Cast"},
  {personId:"cho-jin-woong",name:"Cho Jin-woong",role:"Cast"},
  {personId:"park-chan-wook",name:"Park Chan-wook",role:"Direction"},
  {personId:"park-chan-wook",name:"Park Chan-wook",role:"Writing"},
  {personId:"jeong-seo-kyeong",name:"Jeong Seo-kyeong",role:"Writing"},
  {personId:"chung-chung-hoon",name:"Chung Chung-hoon",role:"Cinematography"}
 ]
};
