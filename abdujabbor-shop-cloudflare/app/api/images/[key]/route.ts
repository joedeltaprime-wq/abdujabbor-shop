import {env} from 'cloudflare:workers';

export async function GET(_req:Request,{params}:{params:Promise<{key:string}>}){
  const {key}=await params;
  if(!/^[a-f0-9-]+\.(jpg|png|webp)$/.test(key))return new Response('Not found',{status:404});

  try{
    if(!env.STORE)throw new Error('Storage unavailable');
    const result=await env.STORE.getWithMetadata<{contentType?:string}>('img:'+key,{type:'arrayBuffer'});
    if(!result.value)return new Response('Not found',{status:404});

    const fallback=key.endsWith('.jpg')?'image/jpeg':key.endsWith('.png')?'image/png':'image/webp';
    return new Response(result.value,{headers:{
      'Content-Type':result.metadata?.contentType||fallback,
      'Cache-Control':'public,max-age=31536000,immutable',
      'X-Content-Type-Options':'nosniff'
    }});
  }catch{
    return new Response('Image unavailable',{status:503});
  }
}
