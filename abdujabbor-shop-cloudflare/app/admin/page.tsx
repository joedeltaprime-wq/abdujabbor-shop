import {accessEmail,ADMIN} from '@/lib/admin';
import {Brand} from '@/components/brand';
import AdminPanel from './panel';

export const dynamic='force-dynamic';

export default async function Admin(){
  const email=await accessEmail();

  if(!email){
    return <main className="auth-card">
      <Brand/>
      <h1>Admin panel</h1>
      <p>Bu sahifa Cloudflare Access orqali himoyalangan. Admin sifatida kirish uchun ruxsat berilgan Gmail hisobidan foydalaning.</p>
      <a href="/">Katalogga qaytish</a>
    </main>;
  }

  if(email!==ADMIN){
    return <main className="auth-card">
      <Brand/>
      <h1>Kirish huquqi yo‘q</h1>
      <p>{email} admin sifatida belgilanmagan.</p>
      <a href="/cdn-cgi/access/logout">Boshqa akkaunt bilan kirish</a>
      <a href="/">Katalogga qaytish</a>
    </main>;
  }

  return <AdminPanel/>;
}
