import {env} from 'cloudflare:workers';
import type {Product} from './catalog';
import {defaultSettings,type ShopSettings} from './settings';

const PRODUCTS_KEY='abdu:products:restored:v1';
const SETTINGS_KEY='abdu:settings:restored:v1';

function store(){
  if(!env.STORE)throw new Error('Catalog storage unavailable');
  return env.STORE;
}

export async function products():Promise<Product[]>{
  return (await store().get<Product[]>(PRODUCTS_KEY,'json')) || [];
}

export async function saveProduct(product:Product){
  const all=await products();
  const i=all.findIndex(x=>x.id===product.id);
  if(i>=0)all[i]=product;
  else all.unshift(product);
  await store().put(PRODUCTS_KEY,JSON.stringify(all));
}

export async function settings():Promise<ShopSettings>{
  return (await store().get<ShopSettings>(SETTINGS_KEY,'json')) || defaultSettings;
}

export async function saveSettings(value:ShopSettings){
  await store().put(SETTINGS_KEY,JSON.stringify(value));
}
