export const PRODUCTS_KEY = 'abdu:products:v1';
export const SETTINGS_KEY = 'abdu:settings:v1';

export const DEFAULT_SETTINGS = {
  phone1: '+998 97 400 77 53',
  phone2: '+998 97 407 77 53',
  telegram: 'Abdujabbor_shop',
  location: 'Toshkent shahri',
  delivery: 'Toshkent bo‘ylab yetkazib berish',
  deliveryNote: 'Yetkazib berish narxi va muddatini buyurtma vaqtida kelishamiz.',
  about: {
    uz: 'Abdujabbor Shop — maishiy texnika va uy-ro‘zg‘or buyumlari do‘koni. Dazmol, changyutgich, dazmol doskasi, qozon, fen va boshqa kundalik buyumlarni taklif qilamiz.',
    ru: 'Abdujabbor Shop — магазин бытовой техники и товаров для дома.',
    en: 'Abdujabbor Shop is a home appliance and household goods store.'
  }
};

export function json(data, status=200, headers={}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',...headers}
  });
}

export async function getProducts(env){
  if(!env.STORE) return [];
  return (await env.STORE.get(PRODUCTS_KEY,'json')) || [];
}
export async function setProducts(env, products){
  if(!env.STORE) throw new Error('STORE binding not configured');
  await env.STORE.put(PRODUCTS_KEY, JSON.stringify(products));
}
export async function getSettings(env){
  if(!env.STORE) return DEFAULT_SETTINGS;
  const stored=(await env.STORE.get(SETTINGS_KEY,'json')) || {};
  return {...DEFAULT_SETTINGS,...stored,about:{...DEFAULT_SETTINGS.about,...(stored.about||{})}};
}
export async function setSettings(env, settings){
  if(!env.STORE) throw new Error('STORE binding not configured');
  await env.STORE.put(SETTINGS_KEY, JSON.stringify(settings));
}

function b64url(bytes){
  let s=''; for(const b of bytes) s+=String.fromCharCode(b);
  return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
function unb64url(s){
  s=s.replace(/-/g,'+').replace(/_/g,'/'); while(s.length%4)s+='=';
  const raw=atob(s); return Uint8Array.from(raw,c=>c.charCodeAt(0));
}
async function sign(text, secret){
  const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
  const sig=await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(text));
  return b64url(new Uint8Array(sig));
}
export async function createToken(env){
  if(!env.SESSION_SECRET) throw new Error('SESSION_SECRET not configured');
  const payload=b64url(new TextEncoder().encode(JSON.stringify({role:'admin',exp:Date.now()+12*60*60*1000})));
  return `${payload}.${await sign(payload,env.SESSION_SECRET)}`;
}
export async function verifyAdmin(request, env){
  if(!env.SESSION_SECRET) return false;
  const auth=request.headers.get('Authorization')||'';
  const token=auth.startsWith('Bearer ')?auth.slice(7):'';
  const [payload,sig]=token.split('.'); if(!payload||!sig)return false;
  const expected=await sign(payload,env.SESSION_SECRET); if(sig!==expected)return false;
  try{const data=JSON.parse(new TextDecoder().decode(unb64url(payload)));return data.role==='admin'&&Number(data.exp)>Date.now();}catch{return false;}
}
export function cleanText(v,max=5000){return String(v??'').trim().slice(0,max);}
export function cleanProduct(input, existingId){
  const id=cleanText(existingId||input.id||`p-${Date.now()}`,120).replace(/[^a-zA-Z0-9_-]/g,'');
  return {
    id,
    price:Math.max(0,Number(input.price)||0),
    oldPrice:Math.max(0,Number(input.oldPrice)||0),
    brand:cleanText(input.brand,120),
    category:['iron','vacuum','kitchen','hair','board'].includes(input.category)?input.category:'kitchen',
    inStock:input.inStock!==false,
    visible:input.visible!==false,
    images:Array.isArray(input.images)?input.images.slice(0,6).map(x=>cleanText(x,1000)).filter(Boolean):[],
    title:{uz:cleanText(input.title?.uz,200),ru:cleanText(input.title?.ru,200),en:cleanText(input.title?.en,200)},
    description:{uz:cleanText(input.description?.uz),ru:cleanText(input.description?.ru),en:cleanText(input.description?.en)},
    updatedAt:new Date().toISOString()
  };
}
export function cleanSettings(input){
  return {
    phone1:cleanText(input.phone1,80), phone2:cleanText(input.phone2,80), telegram:cleanText(input.telegram,120).replace(/^@/,''),
    location:cleanText(input.location,200), delivery:cleanText(input.delivery,300), deliveryNote:cleanText(input.deliveryNote,700),
    about:{uz:cleanText(input.about?.uz),ru:cleanText(input.about?.ru),en:cleanText(input.about?.en)}
  };
}
