import {json,verifyAdmin} from '../_lib.js';
export async function onRequestPost({request,env}){
  if(!await verifyAdmin(request,env)) return json({error:'Unauthorized'},401);
  if(!env.STORE) return json({error:'Cloudflare KV STORE binding not configured'},503);
  const form=await request.formData(); const file=form.get('file');
  if(!(file instanceof File)) return json({error:'File required'},400);
  if(file.size>5*1024*1024) return json({error:'Image max size is 5 MB'},400);
  if(!['image/jpeg','image/png','image/webp'].includes(file.type)) return json({error:'Only JPG, PNG or WebP'},400);
  const ext=file.type==='image/png'?'png':file.type==='image/webp'?'webp':'jpg';
  const key=`img:${crypto.randomUUID()}.${ext}`;
  await env.STORE.put(key,await file.arrayBuffer(),{metadata:{contentType:file.type,filename:file.name}});
  return json({url:`/api/images/${encodeURIComponent(key.slice(4))}`},201);
}
