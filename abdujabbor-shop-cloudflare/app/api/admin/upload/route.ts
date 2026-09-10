import {env} from 'cloudflare:workers';
import {isAdmin,sameOrigin} from '@/lib/admin';

export async function POST(req:Request){
  if(!sameOrigin(req)||!await isAdmin())return new Response('Forbidden',{status:403});

  try{
    if(!env.STORE)throw new Error('Storage unavailable');
    if(Number(req.headers.get('content-length'))>6*1024*1024)return new Response('5 MB limit',{status:413});

    const form=await req.formData();
    const file=form.get('file');
    if(!(file instanceof File)||file.size>5*1024*1024||!file.size){
      return Response.json({error:'Rasm hajmi 5 MB dan oshmasin.'},{status:400});
    }

    const bytes=await file.arrayBuffer();
    const b=new Uint8Array(bytes);
    let ext='';
    if(b[0]===255&&b[1]===216&&b[2]===255)ext='jpg';
    else if([137,80,78,71,13,10,26,10].every((v,i)=>b[i]===v))ext='png';
    else if(new TextDecoder().decode(b.slice(0,4))==='RIFF'&&new TextDecoder().decode(b.slice(8,12))==='WEBP')ext='webp';

    if(!ext)return Response.json({error:'JPG, PNG yoki WebP rasm tanlang.'},{status:400});

    const key=crypto.randomUUID()+'.'+ext;
    const contentType=ext==='jpg'?'image/jpeg':'image/'+ext;
    await env.STORE.put('img:'+key,bytes,{metadata:{contentType}});
    return Response.json({url:'/api/images/'+key});
  }catch(e){
    console.error('Upload failed',e);
    return Response.json({error:'Rasm yuklanmadi. Qayta urinib ko‘ring.'},{status:503});
  }
}
