import {headers} from 'next/headers';

export const ADMIN='joedeltaprime@gmail.com';

export async function accessEmail(){
  const h=await headers();
  return (h.get('cf-access-authenticated-user-email')||'').trim().toLowerCase();
}

export async function isAdmin(){
  return (await accessEmail())===ADMIN;
}

export function sameOrigin(req:Request){
  const origin=req.headers.get('origin');
  if(!origin)return true;
  return origin===new URL(req.url).origin;
}
