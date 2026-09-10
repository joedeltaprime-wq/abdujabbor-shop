import {isAdmin,sameOrigin} from '@/lib/admin';
import {settings,saveSettings} from '@/lib/store';
import {z} from 'zod';

export const dynamic='force-dynamic';

const phone=z.string().max(35).transform(s=>s.replace(/[\s()-]/g,''));
const schema=z.object({
  phonePrimary:phone.pipe(z.string().regex(/^\+[1-9]\d{7,14}$/)),
  phoneSecondary:phone.pipe(z.string().regex(/^(\+[1-9]\d{7,14})?$/)),
  telegram:z.string().trim().max(100).regex(/^https:\/\/t\.me\/[a-zA-Z][a-zA-Z0-9_]{3,31}\/?$/).transform(s=>s.replace(/\/$/,''))
});

export async function GET(){
  if(!await isAdmin())return Response.json({error:'Ruxsat yo‘q'},{status:403});
  try{
    return Response.json({settings:await settings()},{headers:{'Cache-Control':'no-store'}});
  }catch(e){
    console.error('Settings load failed',e);
    return Response.json({error:'Aloqa ma’lumotlarini yuklab bo‘lmadi.'},{status:503});
  }
}

export async function POST(req:Request){
  if(!sameOrigin(req)||!await isAdmin())return Response.json({error:'Ruxsat yo‘q'},{status:403});
  try{
    const raw=await req.text();
    if(raw.length>2000)return Response.json({error:'Ma’lumot hajmi juda katta.'},{status:413});
    const parsed=schema.safeParse(JSON.parse(raw));
    if(!parsed.success)return Response.json({error:'Telefonni +998... shaklida, Telegram havolasini https://t.me/username shaklida kiriting.'},{status:400});
    await saveSettings(parsed.data);
    return Response.json({ok:true,settings:parsed.data});
  }catch(e){
    console.error('Settings save failed',e);
    return Response.json({error:'Saqlanmadi. Kiritgan ma’lumotlaringizni tekshirib qayta urinib ko‘ring.'},{status:503});
  }
}
