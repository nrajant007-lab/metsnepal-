import assert from 'node:assert/strict';
const base='http://127.0.0.1:5173';const auth='__sites_local_auth=1';let cookie=auth;
async function call(path,body,method='POST',extra={}){const r=await fetch(base+path,{method:body?method:'GET',headers:{cookie,origin:base,'Content-Type':'application/json',...extra},body:body?JSON.stringify(body):undefined});const c=r.headers.get('set-cookie');if(c?.includes('met_cart='))cookie=auth+'; '+c.split(';')[0];let data;try{data=await r.json()}catch{data=null}return{r,data}}
let checks=0;function ok(v,label){assert.ok(v,label);checks++;console.log('PASS '+label)}
const anon=await fetch(base+'/api/admin');ok(anon.status===403,'anonymous admin denied');
const admin=await call('/api/admin');ok(admin.r.ok&&admin.data.products.length===5,'authenticated admin and draft catalogue');
const published=await fetch(base+'/api/products');ok((await published.json()).length===0,'anonymous catalogue excludes drafts');
const list=await call('/api/products');ok(list.data.length===5,'private signed-in preview catalogue');
const invalid=await call('/api/cart',{productId:'visionaire',quantity:-1});ok(invalid.r.status===400,'cart quantity validation');
const csrf=await call('/api/cart',{productId:'visionaire',quantity:1},'POST',{origin:'https://untrusted.example'});ok([400,403].includes(csrf.r.status),'cross-origin write rejected');
let cart=await call('/api/cart',{productId:'visionaire',quantity:2});ok(cart.r.ok&&cart.data.items[0].quantity===2&&cart.data.needsQuote,'persistent quote-only cart');
cart=await call('/api/cart');ok(cart.data.items[0].quantity===2,'cart survives separate request');
cart=await call('/api/cart',{productId:'visionaire',quantity:3},'PATCH');ok(cart.data.items[0].quantity===3,'quantity update');
const seed={name:'QA Test Customer',phone:'9800000000',email:'',website:''};
const key=crypto.randomUUID();const payload={...seed,whatsapp:'',province:'Bagmati',district:'Lalitpur',municipality:'Lalitpur',address:'QA test address only',instructions:'Automated local test',delivery:'Pickup',payment:'Arrange with team',accepted:true};
const order=await call('/api/submit/checkout',payload,'POST',{'Idempotency-Key':key});ok(order.r.status===201,'checkout saves order');
const retry=await call('/api/submit/checkout',payload,'POST',{'Idempotency-Key':key});ok(retry.data.id===order.data.id,'duplicate checkout is idempotent');
const confirm=await fetch(base+'/order-confirmation/'+order.data.id,{headers:{cookie}});ok(confirm.status===200&&(await confirm.text()).includes('QA Test Customer'),'order confirmation restricted to owner session');
const stranger=await fetch(base+'/order-confirmation/'+order.data.id);ok(stranger.status===404,'another session cannot read order');
cart=await call('/api/cart');ok(cart.data.items.length===0,'cart clears after checkout');
for(const[kind,details]of Object.entries({quote:{organization:'QA',product:'Test Equipment',quantity:1,message:'Local QA'},service:{equipment:'Test Device',brand:'Test',model:'',serial:'',date:'',problem:'Local QA service test only',address:'Local QA test address'},contact:{subject:'Local QA test',message:'Local QA inquiry test only'}})){const res=await call('/api/submit/'+kind,{...seed,...details},'POST',{'Idempotency-Key':crypto.randomUUID()});ok(res.r.status===201,kind+' request persisted')}
const invalidForm=await call('/api/submit/quote',{...seed,name:'',product:'',quantity:0},'POST',{'Idempotency-Key':crypto.randomUUID()});ok(invalidForm.r.status===400,'invalid public form rejected');
const example=admin.data.products[0];const temp={...example,id:'qa-only-product',name:'QA temporary product',slug:'qa-temporary-product',published:true,verified:true,price:1200,salePrice:1000,stock:5};
ok((await call('/api/admin',{action:'product',value:{...temp,verified:false}})).r.status===400,'unverified publishing blocked');
ok((await call('/api/admin',{action:'product',value:temp})).r.ok,'product CRUD publish');
const review=await call('/api/submit/review',{name:'QA Review',rating:4,review:'Local automated review test',productId:temp.id,website:''},'POST',{'Idempotency-Key':crypto.randomUUID()});ok(review.r.status===201,'review saved pending approval');
const data=(await call('/api/admin')).data;ok(data.reviews.some(r=>r.id===review.data.id&&!r.approved),'review not auto-published');
ok((await call('/api/admin',{action:'review',id:review.data.id,approved:true})).r.ok,'admin review moderation');
ok((await call('/api/cart',{productId:temp.id,quantity:6})).r.status===400,'stock validation');
cart=await call('/api/cart',{productId:temp.id,quantity:2});ok(cart.data.subtotal===2000&&!cart.data.needsQuote,'priced cart uses server sale price');
await call('/api/cart',{productId:temp.id,quantity:0},'PATCH');ok((await call('/api/admin',{action:'delete-product',id:temp.id})).r.ok,'product deletion');
ok((await call('/api/admin')).data.products.every(p=>p.id!==temp.id),'deleted record does not reseed');
for(const p of['/','/products','/products/visionaire-oxygen-concentrator','/categories','/categories/sleep-therapy','/brands','/services','/service-request','/request-quote','/about','/contact','/cart','/checkout','/account','/privacy-policy','/terms-and-conditions','/shipping-policy','/return-refund-policy','/warranty-policy','/medical-product-disclaimer','/admin','/sitemap.xml','/robots.txt']){const r=await fetch(base+p,{headers:{cookie}});ok(r.status===200,'route '+p)}
console.log('TOTAL '+checks+' checks passed');

