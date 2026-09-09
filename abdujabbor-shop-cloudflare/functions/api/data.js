import {json,getProducts,getSettings} from '../_lib.js';
export async function onRequestGet({env}){
  const [products,settings]=await Promise.all([getProducts(env),getSettings(env)]);
  return json({products,settings,configured:!!env.STORE});
}
