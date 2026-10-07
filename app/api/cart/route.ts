import { z } from 'zod';
import { sessionId, cartView, CartItem } from '@/lib/cart';
import { getProducts, database } from '@/lib/db';
import { protectMutation, readJson, rateLimit, errorResponse } from '@/lib/security';
export const dynamic = 'force-dynamic';
const schema = z.object({productId:z.string().min(1).max(100), quantity:z.number().int().min(0).max(100)});
export async function GET(){try{return Response.json(await cartView(await sessionId()),{headers:{'Cache-Control':'no-store'}})}catch(e){return errorResponse(e)}}
async function mutate(req:Request,add:boolean){
 try {
  await protectMutation(req); await rateLimit(req,'cart');
  const parsed=schema.safeParse(await readJson(req));
  if(!parsed.success)return Response.json({error:'Please choose a valid product and quantity.'},{status:400});
  const {productId,quantity}=parsed.data; const id=(await sessionId(true))!;
  const product=quantity>0?(await getProducts()).find(p=>p.id===productId):undefined;
  if(quantity>0&&!product)throw new Error('Product is unavailable or unpublished');
  const db=database();
  await db.prepare('INSERT OR IGNORE INTO carts (id,data,updated_at) VALUES (?,?,?)').bind(id,'[]',new Date().toISOString()).run();
  // Compare and swap prevents concurrent additions from overwriting each other.
  for(let attempt=0;attempt<5;attempt++){
   const row=await db.prepare('SELECT data FROM carts WHERE id=?').bind(id).first<{data:string}>();
   if(!row)throw new Error('Cart unavailable. Please try again.');
   const items:CartItem[]=JSON.parse(row.data),old=items.find(i=>i.productId===productId);
   const qty=add?(old?.quantity??0)+quantity:quantity;
   if(qty>100)throw new Error('Cart quantity must be 100 or less');
   if(product&&(product.availability==='Out of stock'||product.stock!==null&&qty>product.stock))throw new Error('Requested quantity exceeds current stock');
   const next=items.filter(i=>i.productId!==productId); if(qty)next.push({productId,quantity:qty});
   if(next.length>50)throw new Error('Cart can contain up to 50 products');
   const result=await db.prepare('UPDATE carts SET data=?,updated_at=? WHERE id=? AND data=?').bind(JSON.stringify(next),new Date().toISOString(),id,row.data).run();
   if(result.meta.changes)return Response.json(await cartView(id),{headers:{'Cache-Control':'no-store'}});
  }
  throw new Error('Cart is busy. Please try again.');
 } catch(e){return errorResponse(e)}
}
export const POST=(r:Request)=>mutate(r,true);
export const PATCH=(r:Request)=>mutate(r,false);
