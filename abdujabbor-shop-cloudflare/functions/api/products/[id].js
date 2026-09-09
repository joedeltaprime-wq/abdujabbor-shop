import {json,getProducts,setProducts,verifyAdmin,cleanProduct} from '../../_lib.js';
export async function onRequestPut({request,env,params}){
  if(!await verifyAdmin(request,env)) return json({error:'Unauthorized'},401);
  if(!env.STORE) return json({error:'Cloudflare KV STORE binding not configured'},503);
  const products=await getProducts(env); const idx=products.findIndex(p=>p.id===params.id);
  if(idx<0) return json({error:'Product not found'},404);
  const input=await request.json(); const product=cleanProduct(input,params.id);
  if(!product.title.uz) return json({error:'O‘zbekcha mahsulot nomi majburiy'},400);
  products[idx]=product; await setProducts(env,products); return json({product});
}
export async function onRequestDelete({request,env,params}){
  if(!await verifyAdmin(request,env)) return json({error:'Unauthorized'},401);
  if(!env.STORE) return json({error:'Cloudflare KV STORE binding not configured'},503);
  const products=await getProducts(env); const next=products.filter(p=>p.id!==params.id);
  if(next.length===products.length) return json({error:'Product not found'},404);
  await setProducts(env,next); return json({ok:true});
}
