import {json,createToken} from '../_lib.js';
export async function onRequestPost({request,env}){
  if(!env.ADMIN_PASSWORD || !env.SESSION_SECRET) return json({error:'Admin is not configured. Add ADMIN_PASSWORD and SESSION_SECRET secrets.'},503);
  let body={}; try{body=await request.json();}catch{}
  if(String(body.password||'')!==String(env.ADMIN_PASSWORD)) return json({error:'Invalid password'},401);
  return json({token:await createToken(env)});
}
