import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const products=[
 {name:'طلوع طلایی',price:3850000,color:0xb68b43,liquid:0xc58b32,cap:0xceb071},
 {name:'شب مخملی',price:4250000,color:0x5d4733,liquid:0x3c2118,cap:0x9b7844},
 {name:'سکوت سپید',price:3490000,color:0xc7c4b8,liquid:0xd8d1bd,cap:0xd7c9a6}
];
const fa=n=>new Intl.NumberFormat('fa-IR').format(n);
const root=document.getElementById('three-root');
let scene,camera,renderer,bottles=[],active=0,raf,dragging=false,lastX=0,dragVelocity=0;

function makeBottle(p,index){
 const group=new THREE.Group();
 const glass=new THREE.MeshPhysicalMaterial({color:0xe8dfcc,metalness:.05,roughness:.12,transmission:.82,thickness:.65,transparent:true,opacity:.62,ior:1.45,clearcoat:1,clearcoatRoughness:.08});
 const liquidMat=new THREE.MeshPhysicalMaterial({color:p.liquid,metalness:.18,roughness:.2,transmission:.18,transparent:true,opacity:.9});
 const gold=new THREE.MeshStandardMaterial({color:p.cap,metalness:.82,roughness:.2});
 const dark=new THREE.MeshStandardMaterial({color:0x17130d,metalness:.35,roughness:.35});
 const profile=[new THREE.Vector2(0,.1),new THREE.Vector2(.55,.1),new THREE.Vector2(.68,.16),new THREE.Vector2(.72,.28),new THREE.Vector2(.72,1.65),new THREE.Vector2(.67,1.82),new THREE.Vector2(.42,1.98),new THREE.Vector2(.36,2.04),new THREE.Vector2(.36,2.23),new THREE.Vector2(0,2.23)];
 const body=new THREE.Mesh(new THREE.LatheGeometry(profile,72),glass);body.castShadow=true;body.receiveShadow=true;group.add(body);
 const liquidProfile=[new THREE.Vector2(0,.13),new THREE.Vector2(.54,.13),new THREE.Vector2(.65,.2),new THREE.Vector2(.65,1.18),new THREE.Vector2(0,1.18)];
 const liquid=new THREE.Mesh(new THREE.LatheGeometry(liquidProfile,64),liquidMat);liquid.position.y=0;group.add(liquid);
 const neck=new THREE.Mesh(new THREE.CylinderGeometry(.28,.31,.22,48),glass);neck.position.y=2.22;group.add(neck);
 const collar=new THREE.Mesh(new THREE.CylinderGeometry(.39,.39,.12,64),gold);collar.position.y=2.34;group.add(collar);
 const cap=new THREE.Mesh(new THREE.CylinderGeometry(.34,.37,.55,64,1),gold);cap.position.y=2.67;cap.castShadow=true;group.add(cap);
 const capTop=new THREE.Mesh(new THREE.CylinderGeometry(.31,.34,.035,64),dark);capTop.position.y=2.96;group.add(capTop);
 const label=new THREE.Mesh(new THREE.PlaneGeometry(.88,.58),new THREE.MeshStandardMaterial({color:0x15120d,metalness:.25,roughness:.48,side:THREE.DoubleSide}));label.position.set(0,1.02,.697);group.add(label);
 const labelLine=new THREE.Mesh(new THREE.PlaneGeometry(.68,.008),new THREE.MeshBasicMaterial({color:p.cap,side:THREE.DoubleSide}));labelLine.position.set(0,1.21,.704);group.add(labelLine);
 const labelLine2=labelLine.clone();labelLine2.position.y=.83;group.add(labelLine2);
 const emblem=new THREE.Mesh(new THREE.CircleGeometry(.105,48),new THREE.MeshStandardMaterial({color:p.cap,metalness:.8,roughness:.2,side:THREE.DoubleSide}));emblem.position.set(0,1.02,.706);group.add(emblem);
 group.scale.setScalar(index===0?1.03:0.001);group.position.set(0,-.2,0);group.rotation.y=-.22;group.userData={baseY:-.2,drag:0};scene.add(group);return group;
}
function init3D(){
 scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x090907,.055);
 camera=new THREE.PerspectiveCamera(34,innerWidth/innerHeight,.1,100);camera.position.set(0,1.5,9.4);
 renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;root.appendChild(renderer.domElement);
 scene.add(new THREE.AmbientLight(0xffffff,.85));const key=new THREE.DirectionalLight(0xffe2b0,3.2);key.position.set(4,6,5);scene.add(key);const rim=new THREE.PointLight(0xc58d42,32,12);rim.position.set(-3,2,3);scene.add(rim);const back=new THREE.PointLight(0xffdca0,22,10);back.position.set(2,1,-3);scene.add(back);
 products.forEach((p,i)=>bottles.push(makeBottle(p,i)));
 const floor=new THREE.Mesh(new THREE.CircleGeometry(2.1,80),new THREE.MeshBasicMaterial({color:0x9a7138,transparent:true,opacity:.045}));floor.rotation.x=-Math.PI/2;floor.position.y=-1.45;scene.add(floor);
 const resize=()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));};addEventListener('resize',resize);
 const canvas=renderer.domElement;
 canvas.style.pointerEvents='auto';canvas.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;canvas.setPointerCapture(e.pointerId)});canvas.addEventListener('pointermove',e=>{if(!dragging)return;const dx=e.clientX-lastX;lastX=e.clientX;bottles[active].userData.drag+=dx*.012;dragVelocity=dx*.0008});canvas.addEventListener('pointerup',()=>dragging=false);canvas.addEventListener('pointercancel',()=>dragging=false);
 const tick=()=>{raf=requestAnimationFrame(tick);if(!dragging){bottles[active].userData.drag+=dragVelocity;dragVelocity*=.92}bottles.forEach((b,i)=>{if(i!==active&&b.scale.x<.002)return;b.rotation.y+=i===active?.0012:0;b.rotation.y+=i===active?0:0;b.rotation.y=b.rotation.y;});renderer.render(scene,camera)};tick();
}
function showBottle(index,progress=0){if(!bottles.length)return;active=index;bottles.forEach((b,i)=>{const on=i===index;gsap.to(b.scale,{x:on?1.03:.001,y:on?1.03:.001,z:on?1.03:.001,duration:.9,ease:'power3.inOut',overwrite:true});gsap.to(b.position,{y:on?-.25:1.4,duration:.9,ease:'power3.inOut',overwrite:true});if(on){gsap.fromTo(b.rotation,{y:b.rotation.y+1.15},{y:b.rotation.y+.05,duration:1.15,ease:'power3.out',overwrite:true});}});}
function bindScroll(){if(!window.gsap||!window.ScrollTrigger)return;gsap.registerPlugin(ScrollTrigger);document.querySelectorAll('.product-panel').forEach((panel,i)=>{ScrollTrigger.create({trigger:panel,start:'top 68%',end:'bottom 32%',onEnter:()=>showBottle(i),onEnterBack:()=>showBottle(i),onUpdate:self=>{if(i===active&&!dragging){const b=bottles[i];b.rotation.y=(i%2?-.3:.25)+(self.progress-.5)*1.5+b.userData.drag;gsap.to(b.position,{y:-.28+Math.sin(self.progress*Math.PI)*.18,duration:.2,overwrite:true});}}});});}
init3D();showBottle(0);bindScroll();

const cartKey='rayehno-cart-v1';let cart=JSON.parse(localStorage.getItem(cartKey)||'[]');const cartDrawer=document.getElementById('cart-drawer'),backdrop=document.getElementById('cart-backdrop');
function saveCart(){localStorage.setItem(cartKey,JSON.stringify(cart));renderCart()}
function renderCart(){const count=cart.reduce((s,x)=>s+x.qty,0);document.getElementById('cart-count').textContent=fa(count);const items=document.getElementById('cart-items');if(!cart.length){items.innerHTML='<div class="empty-cart">سبد خرید شما هنوز خالی است.</div>'}else{items.innerHTML=cart.map(x=>`<div class="cart-item"><div><strong>${products[x.id].name}</strong><small>${fa(products[x.id].price)} تومان</small></div><div class="qty-controls"><button data-minus="${x.id}" aria-label="کم کردن">−</button><span>${fa(x.qty)}</span><button data-plus="${x.id}" aria-label="زیاد کردن">＋</button></div></div>`).join('')};const total=cart.reduce((s,x)=>s+products[x.id].price*x.qty,0);document.getElementById('cart-total').textContent=fa(total)+' تومان';document.getElementById('checkout-button').disabled=!cart.length;}
function openCart(){cartDrawer.classList.add('open');cartDrawer.setAttribute('aria-hidden','false');backdrop.classList.add('show')};function closeCart(){cartDrawer.classList.remove('open');cartDrawer.setAttribute('aria-hidden','true');backdrop.classList.remove('show')}
document.getElementById('open-cart').onclick=openCart;document.getElementById('close-cart').onclick=closeCart;backdrop.onclick=closeCart;
document.querySelectorAll('[data-add]').forEach(btn=>btn.addEventListener('click',()=>{const id=Number(btn.dataset.add),found=cart.find(x=>x.id===id);if(found)found.qty++;else cart.push({id,qty:1});saveCart();toast('به سبد خرید اضافه شد');}));
document.getElementById('cart-items').addEventListener('click',e=>{const plus=e.target.closest('[data-plus]'),minus=e.target.closest('[data-minus]');if(plus){const x=cart.find(x=>x.id===Number(plus.dataset.plus));x.qty++}if(minus){const id=Number(minus.dataset.minus),x=cart.find(x=>x.id===id);x.qty--;if(x.qty<=0)cart=cart.filter(x=>x.id!==id)}saveCart()});
const checkout=document.getElementById('checkout-modal');document.getElementById('checkout-button').onclick=()=>{closeCart();checkout.classList.add('show')};document.getElementById('close-checkout').onclick=()=>checkout.classList.remove('show');checkout.addEventListener('click',e=>{if(e.target===checkout)checkout.classList.remove('show')});
document.getElementById('checkout-form').addEventListener('submit',e=>{e.preventDefault();if(!e.currentTarget.reportValidity())return;checkout.classList.remove('show');document.getElementById('success-screen').classList.add('show');document.getElementById('success-screen').setAttribute('aria-hidden','false')});document.getElementById('finish-order').onclick=()=>{document.getElementById('success-screen').classList.remove('show');document.getElementById('success-screen').setAttribute('aria-hidden','true');cart=[];saveCart();document.getElementById('checkout-form').reset();window.scrollTo({top:0,behavior:'smooth'})};
let toastTimer;function toast(msg){const el=document.getElementById('toast');el.textContent=msg;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),1900)}renderCart();
