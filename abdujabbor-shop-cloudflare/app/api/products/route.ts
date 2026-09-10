import {products,settings} from '@/lib/store';
import {samples} from '@/lib/catalog';
import {defaultSettings} from '@/lib/settings';

export const dynamic='force-dynamic';

export async function GET(){
  try{
    const [all,contact]=await Promise.all([products(),settings()]);
    return Response.json({
      products:all.length?all.filter(p=>p.published):samples,
      settings:contact
    },{headers:{'Cache-Control':'no-store'}});
  }catch(e){
    console.error('Catalog load failed',e);
    // Public shop remains usable even before the KV binding is attached.
    return Response.json({products:samples,settings:defaultSettings},{headers:{'Cache-Control':'no-store'}});
  }
}
