export async function onRequestGet({env,params}){
  if(!env.STORE) return new Response('Not configured',{status:404});
  const key=`img:${params.key}`; const result=await env.STORE.getWithMetadata(key,'arrayBuffer');
  if(!result.value) return new Response('Not found',{status:404});
  return new Response(result.value,{headers:{'Content-Type':result.metadata?.contentType||'application/octet-stream','Cache-Control':'public, max-age=31536000, immutable'}});
}
