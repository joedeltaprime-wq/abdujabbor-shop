import {json,getSettings,setSettings,verifyAdmin,cleanSettings} from '../_lib.js';
export async function onRequestGet({env}){return json({settings:await getSettings(env)});}
export async function onRequestPut({request,env}){
  if(!await verifyAdmin(request,env)) return json({error:'Unauthorized'},401);
  if(!env.STORE) return json({error:'Cloudflare KV STORE binding not configured'},503);
  const settings=cleanSettings(await request.json()); await setSettings(env,settings); return json({settings});
}
