// Persian number converter
const toFa = (n) => String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
const fmtPrice = (n) => toFa(n.toLocaleString('en-US')) + ' تومان';

// Product data
const products = [
  {id:1,cat:'mobile',catName:'موبایل',title:'گوشی هوشمند پرچمدار پرو مکس',price:48900000,old:54000000,icon:'fa-mobile-screen',rating:4.8,reviews:128,tag:'جدید'},
  {id:2,cat:'audio',catName:'صوتی',title:'هدفون بی‌سیم نویز کنسلینگ',price:2490000,old:3200000,icon:'fa-headphones',rating:4.9,reviews:256,tag:'٪۲۲-'},
  {id:3,cat:'laptop',catName:'لپ‌تاپ',title:'لپ‌تاپ گیمینگ ۱۶ اینچی RTX',price:78500000,old:0,icon:'fa-laptop',rating:4.7,reviews:89,tag:'پرفروش'},
  {id:4,cat:'watch',catName:'ساعت',title:'ساعت هوشمند سری ۹ اسپرت',price:14900000,old:17500000,icon:'fa-stopwatch',rating:4.6,reviews:174,tag:'٪۱۵-'},
  {id:5,cat:'audio',catName:'صوتی',title:'اسپیکر بلوتوث پرتابل قدرتمند',price:1890000,old:0,icon:'fa-volume-high',rating:4.5,reviews:92,tag:''},
  {id:6,cat:'mobile',catName:'موبایل',title:'گوشی میان‌رده با دوربین ۲۰۰ مگاپیکسل',price:18900000,old:21000000,icon:'fa-mobile',rating:4.4,reviews:201,tag:''},
  {id:7,cat:'laptop',catName:'لپ‌تاپ',title:'اولترابوک ۱۴ اینچی نازک و سبک',price:52000000,old:58000000,icon:'fa-laptop-code',rating:4.8,reviews:67,tag:'جدید'},
  {id:8,cat:'watch',catName:'ساعت',title:'ساعت هوشمند بند چرمی کلاسیک',price:8900000,old:0,icon:'fa-clock',rating:4.3,reviews:54,tag:''},
];

// Render products
const grid = document.getElementById('productsGrid');
function renderProducts(filter='all'){
  const list = filter==='all' ? products : products.filter(p=>p.cat===filter);
  grid.innerHTML = list.map(p=>`
    <div class="product fade-up" data-id="${p.id}">
      <div class="product-img">
        ${p.tag?`<span class="product-tag">${p.tag}</span>`:''}
        <button class="product-fav"><i class="fa-regular fa-heart"></i></button>
        <i class="fa-solid ${p.icon}"></i>
      </div>
      <div class="product-body">
        <div class="product-cat">${p.catName}</div>
        <div class="product-title">${p.title}</div>
        <div class="product-rating">
          ${'<i class="fa-solid fa-star"></i>'.repeat(Math.floor(p.rating))}
          <span>(${toFa(p.reviews)})</span>
        </div>
        <div class="product-foot">
          <div class="product-price">
            ${p.old?`<span class="price-old">${fmtPrice(p.old)}</span>`:''}
            <span class="price-new">${fmtPrice(p.price)}</span>
          </div>
          <button class="add-cart" data-id="${p.id}"><i class="fa-solid fa-plus"></i></button>
        </div>
      </div>
    </div>
  `).join('');
  observeFade();
  bindAddCart();
}
renderProducts();

// Tabs
document.getElementById('tabs').addEventListener('click', e=>{
  const btn = e.target.closest('.tab');
  if(!btn) return;
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  btn.classList.add('active');
  renderProducts(btn.dataset.filter);
});

// Mobile menu
document.getElementById('menuToggle').addEventListener('click', ()=>{
  document.getElementById('nav').classList.toggle('open');
});
document.querySelectorAll('#nav a').forEach(a=>a.addEventListener('click',()=>document.getElementById('nav').classList.remove('open')));

// Search toggle
document.getElementById('searchBtn').addEventListener('click', ()=>{
  document.getElementById('searchBar').classList.toggle('open');
});

// Cart
let cart = [];
const cartDrawer = document.getElementById('cartDrawer');
const overlay = document.getElementById('overlay');
const cartItemsEl = document.getElementById('cartItems');
const cartCountEl = document.getElementById('cartCount');
const cartTotalEl = document.getElementById('cartTotal');

function openCart(){cartDrawer.classList.add('open');overlay.classList.add('open')}
function closeCart(){cartDrawer.classList.remove('open');overlay.classList.remove('open')}
document.getElementById('cartBtn').addEventListener('click', openCart);
document.getElementById('closeCart').addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);

function bindAddCart(){
  document.querySelectorAll('.add-cart').forEach(btn=>{
    btn.addEventListener('click', e=>{
      e.stopPropagation();
      const id = +btn.dataset.id;
      const p = products.find(x=>x.id===id);
      const existing = cart.find(x=>x.id===id);
      if(existing) existing.qty++;
      else cart.push({...p, qty:1});
      renderCart();
      openCart();
    });
  });
}

function renderCart(){
  cartCountEl.textContent = toFa(cart.reduce((s,i)=>s+i.qty,0));
  if(!cart.length){
    cartItemsEl.innerHTML = '<div class="cart-empty"><i class="fa-solid fa-bag-shopping"></i><p>سبد خرید شما خالی است</p></div>';
    cartTotalEl.textContent = fmtPrice(0);
    return;
  }
  cartItemsEl.innerHTML = cart.map(i=>`
    <div class="cart-item">
      <div class="cart-item-img"><i class="fa-solid ${i.icon}"></i></div>
      <div class="cart-item-info">
        <div class="cart-item-title">${i.title}</div>
        <div class="cart-item-price">${fmtPrice(i.price*i.qty)}</div>
        <div class="cart-item-controls">
          <button class="qty-btn" data-act="dec" data-id="${i.id}"><i class="fa-solid fa-minus"></i></button>
          <span class="qty-val">${toFa(i.qty)}</span>
          <button class="qty-btn" data-act="inc" data-id="${i.id}"><i class="fa-solid fa-plus"></i></button>
          <button class="remove-item" data-act="rm" data-id="${i.id}"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>
    </div>
  `).join('');
  cartTotalEl.textContent = fmtPrice(cart.reduce((s,i)=>s+i.price*i.qty,0));
}
cartItemsEl.addEventListener('click', e=>{
  const btn = e.target.closest('[data-act]');
  if(!btn) return;
  const id = +btn.dataset.id;
  const item = cart.find(x=>x.id===id);
  if(btn.dataset.act==='inc') item.qty++;
  if(btn.dataset.act==='dec'){item.qty--; if(item.qty<=0) cart = cart.filter(x=>x.id!==id);}
  if(btn.dataset.act==='rm') cart = cart.filter(x=>x.id!==id);
  renderCart();
});
renderCart();

// Countdown
const target = Date.now() + 5*24*60*60*1000;
function tick(){
  const diff = Math.max(0, target - Date.now());
  const d = Math.floor(diff/86400000);
  const h = Math.floor(diff/3600000)%24;
  const m = Math.floor(diff/60000)%60;
  const s = Math.floor(diff/1000)%60;
  document.getElementById('d').textContent = toFa(String(d).padStart(2,'0'));
  document.getElementById('h').textContent = toFa(String(h).padStart(2,'0'));
  document.getElementById('m').textContent = toFa(String(m).padStart(2,'0'));
  document.getElementById('s').textContent = toFa(String(s).padStart(2,'0'));
}
tick(); setInterval(tick,1000);

// Scroll top
const scrollTop = document.getElementById('scrollTop');
window.addEventListener('scroll', ()=>{
  scrollTop.classList.toggle('show', window.scrollY>400);
});
scrollTop.addEventListener('click', ()=>window.scrollTo({top:0,behavior:'smooth'}));

// Fade-in observer
function observeFade(){
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('in'); obs.unobserve(en.target);} });
  },{threshold:.1});
  document.querySelectorAll('.fade-up').forEach(el=>obs.observe(el));
}
document.querySelectorAll('.section, .feature, .cat-card, .testimonial').forEach(el=>el.classList.add('fade-up'));
observeFade();

// Active nav on scroll
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', ()=>{
  let cur = '';
  sections.forEach(s=>{
    if(window.scrollY >= s.offsetTop - 120) cur = s.id;
  });
  document.querySelectorAll('.nav a').forEach(a=>{
    a.classList.toggle('active', a.getAttribute('href')==='#'+cur);
  });
});
