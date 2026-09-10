export type ShopSettings={phonePrimary:string;phoneSecondary:string;telegram:string};
export const defaultSettings:ShopSettings={phonePrimary:'+998974007753',phoneSecondary:'+998974077753',telegram:'https://t.me/Abdujabbor_shop'};
export function phoneLabel(phone:string){return /^\+998\d{9}$/.test(phone)?`${phone.slice(0,4)} ${phone.slice(4,6)} ${phone.slice(6,9)} ${phone.slice(9,11)} ${phone.slice(11)}`:phone}
export function telegramLabel(url:string){return '@'+url.replace(/^https:\/\/t\.me\//,'').replace(/\/$/,'')}
