import Shop from '@/app/shop';
export default async function ProductPage({params}:{params:Promise<{id:string}>}){const {id}=await params;return <Shop productId={id}/>}
