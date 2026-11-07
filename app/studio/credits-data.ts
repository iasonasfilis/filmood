/** A future integration will populate verified film credits with stable person IDs. */
export type CreditRole="Cast"|"Direction"|"Writing"|"Cinematography"|"Editing"|"Music"|"Production";
export type VerifiedCredit={personId:string;name:string;role:CreditRole;character?:string};
export const VERIFIED_CREDITS:Record<number,VerifiedCredit[]>={};
