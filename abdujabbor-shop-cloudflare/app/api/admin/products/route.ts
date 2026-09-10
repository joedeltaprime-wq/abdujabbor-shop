import {isAdmin,sameOrigin} from '@/lib/admin';
import {products,saveProduct} from '@/lib/store';
import {z} from 'zod';

export const dynamic='force-dynamic';

const localized=z.object({
  uz:z.string().trim().min(1).max(3000),
  ru:z.string().trim().min(1).max(3000),
  en:z.string().trim().min(1).max(3000)
});

const product=z.object({
  id:z.string().uuid(),
  brand:z.string().trim().max(80).optional().default(''),
  name:localized,
  description:localized,
  category:z.enum(['iron','vacuum','kitchen','hair','board']),
  price:z.number().int().min(0).max(1000000000),
  oldPrice:z.number().int().min(0).max(1000000000).nullable(),
  images:z.array(z.string().regex(/^\/api\/images\/[a-f0-9-]+\.(jpg|png|webp)$/)).min(1).max(6),
  available:z.boolean(),
  published:z.boolean()
}).refine(p=>p.oldPrice===null||p.oldPrice>p.price,{message:'Old price must exceed current price'});

export async function GET(){
  if(!await isAdmin())return Response.json({error:'Ruxsat yo‘q'},{status:403});
  try{
    return Response.json({products:await products()},{headers:{'Cache-Control':'no-store'}});
  }catch(e){
    console.error(e);
    return Response.json({error:'Katalogni yuklab bo‘lmadi.'},{status:503});
  }
}

export async function POST(req:Request){
  if(!sameOrigin(req)||!await isAdmin())return Response.json({error:'Ruxsat yo‘q'},{status:403});
  try{
    if(Number(req.headers.get('content-length'))>40000)return new Response('Too large',{status:413});
    const parsed=product.safeParse(await req.json());
    if(!parsed.success)return Response.json({error:'Barcha tillarni, narxni va kamida bitta rasmni kiriting. Eski narx yangi narxdan katta bo‘lsin.'},{status:400});
    await saveProduct(parsed.data);
    return Response.json({ok:true});
  }catch(e){
    console.error('Save failed',e);
    return Response.json({error:'Saqlanmadi. Qayta urinib ko‘ring.'},{status:503});
  }
}
