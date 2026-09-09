import {json,getProducts,setProducts,verifyAdmin,cleanProduct} from '../_lib.js';
export async function onRequestPost({request,env}){
  if(!await verifyAdmin(request,env)) return json({error:'Unauthorized'},401);
  if(!env.STORE) return json({error:'Cloudflare KV STORE binding not configured'},503);
  const input=await request.json(); const product=cleanProduct(input);
  if(!product.title.uz) return json({error:'O‘zbekcha mahsulot nomi majburiy'},400);
  const products=await getProducts(env);
  if(products.some(p=>p.id===product.id)) product.id=`p-${Date.now()}`;
  products.push(product); await setProducts(env,products);
  return json({product},201);
}
