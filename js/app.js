/* Nova Nook Essence — app.js
   Cart + filters + animations + Web3Forms checkout
*/
const PRODUCTS = window.PRODUCTS || [];
const CURRENCY = '$';
const WEB3FORMS_KEY = window.WEB3FORMS_KEY || 'YOUR_WEB3FORMS_KEY_HERE';
const NOTIFY_EMAIL = 'shawnmarun@gmail.com';

/* -------- helpers -------- */
const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => Array.from(p.querySelectorAll(s));
const money = n => CURRENCY + Number(n).toFixed(2);
const getProduct = id => PRODUCTS.find(p => String(p.id) === String(id));

/* -------- cart store -------- */
const CART_KEY = 'nne_cart_v1';
function loadCart(){ try{ return JSON.parse(localStorage.getItem(CART_KEY)) || []; }catch(e){return []} }
function saveCart(c){ localStorage.setItem(CART_KEY, JSON.stringify(c)); updateCartBadge(); renderDrawer(); renderCheckoutSummary(); }
function addToCart(id, qty=1){
  const c = loadCart();
  const found = c.find(i => String(i.id) === String(id));
  if (found) found.qty += qty;
  else c.push({ id, qty });
  saveCart(c);
  const p = getProduct(id);
  toast(`<b>${p?.name || 'Item'}</b> added to bag`);
}
function setQty(id, qty){
  let c = loadCart();
  c = c.map(i => String(i.id) === String(id) ? {...i, qty:Math.max(1, qty)} : i);
  saveCart(c);
}
function removeFromCart(id){
  saveCart(loadCart().filter(i => String(i.id) !== String(id)));
}
function cartTotals(){
  const c = loadCart();
  const items = c.map(i => ({...i, p:getProduct(i.id)})).filter(x => x.p);
  const subtotal = items.reduce((s,i)=>s + i.p.price * i.qty, 0);
  const count = items.reduce((s,i)=>s + i.qty, 0);
  return { items, subtotal, count };
}

/* -------- header / nav -------- */
function initHeader(){
  const h = $('header.nav');
  if (!h) return;
  const onScroll = () => h.classList.toggle('scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive:true });
  const t = $('.menu-toggle');
  const n = $('nav.primary');
  if (t && n) t.addEventListener('click', () => n.classList.toggle('open'));
}

function updateCartBadge(){
  const el = $('.cart-count');
  if (!el) return;
  const { count } = cartTotals();
  el.textContent = count;
  el.dataset.empty = count === 0;
}

/* -------- drawer -------- */
function openDrawer(){
  $('.drawer')?.classList.add('open');
  $('.drawer-overlay')?.classList.add('show');
  renderDrawer();
}
function closeDrawer(){
  $('.drawer')?.classList.remove('open');
  $('.drawer-overlay')?.classList.remove('show');
}
function renderDrawer(){
  const body = $('.drawer-body');
  const foot = $('.drawer-foot');
  if (!body) return;
  const { items, subtotal, count } = cartTotals();
  if (!count){
    body.innerHTML = `<div class="empty-cart"><p>Your bag is empty.</p><a href="shop.html" class="btn ghost">Browse fragrances</a></div>`;
    if (foot) foot.style.display = 'none';
    return;
  }
  if (foot) foot.style.display = 'flex';
  body.innerHTML = items.map(i => `
    <div class="cart-item">
      <img src="${i.p.image}" alt="${i.p.name}">
      <div class="ci-info">
        <span class="ci-brand">${i.p.brand}</span>
        <span class="ci-name">${i.p.name}</span>
        <div class="qty">
          <button data-act="dec" data-id="${i.id}">−</button>
          <span>${i.qty}</span>
          <button data-act="inc" data-id="${i.id}">+</button>
        </div>
      </div>
      <div class="ci-side">
        <span class="price">${money(i.p.price * i.qty)}</span>
        <button class="remove" data-act="rm" data-id="${i.id}">Remove</button>
      </div>
    </div>`).join('');
  if (foot){
    foot.innerHTML = `
      <div class="totals"><span>Subtotal</span><span>${money(subtotal)}</span></div>
      <div class="totals"><span>Items</span><span>${count}</span></div>
      <div class="totals"><span>Total</span><span class="grand">${money(subtotal)}</span></div>
      <a href="cart.html" class="btn solid">Checkout</a>
      <button class="btn ghost" data-act="close">Continue shopping</button>`;
  }
}
function bindDrawer(){
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-drawer]');
    if (t) { e.preventDefault(); openDrawer(); }
    const c = e.target.closest('.drawer-overlay, [data-act="close"], .drawer-close');
    if (c) closeDrawer();
    const act = e.target.closest('[data-act]');
    if (act){
      const id = act.dataset.id;
      const a = act.dataset.act;
      const c = loadCart();
      const it = c.find(i => String(i.id) === String(id));
      if (a === 'inc' && it) setQty(id, it.qty+1);
      else if (a === 'dec' && it) setQty(id, it.qty-1);
      else if (a === 'rm') removeFromCart(id);
    }
  });
}

/* -------- toast -------- */
let toastTimer;
function toast(msg){
  let t = $('.toast');
  if (!t){ t = document.createElement('div'); t.className='toast'; document.body.appendChild(t); }
  t.innerHTML = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.remove('show'), 2600);
}

/* -------- product cards -------- */
function productCard(p){
  const sale = p.tags?.includes('Sale');
  const lux  = p.tags?.includes('Luxury');
  const best = p.tags?.includes('Best Seller');
  const tag  = sale ? `<span class="product-tag sale">Sale</span>` :
               lux  ? `<span class="product-tag">Luxury</span>` :
               best ? `<span class="product-tag">Best Seller</span>` : '';
  const alt = p.image2 || p.image;
  return `<article class="product-card" data-id="${p.id}" tabindex="0">
    <a class="product-media" href="product.html?id=${p.id}" aria-label="${p.name}">
      ${tag}
      <img class="main" src="${p.image}" alt="${p.name}" loading="lazy">
      <img class="alt" src="${alt}" alt="${p.name} alternate view" loading="lazy">
      <button class="quick-add" data-add="${p.id}" aria-label="Add ${p.name} to bag">+ Quick Add</button>
    </a>
    <div class="product-info">
      <span class="brand">${p.brand || 'Niche'}</span>
      <h3><a href="product.html?id=${p.id}">${p.name}</a></h3>
      <span class="price"><b>${money(p.price)}</b></span>
    </div>
  </article>`;
}

/* tap-to-flip second image on touch devices */
document.addEventListener('click', e => {
  const card = e.target.closest('.product-card');
  if (!card) return;
  if (e.target.closest('a, button')) return;
  card.classList.toggle('flip');
});
function renderProducts(container, list){
  container.innerHTML = list.map(productCard).join('') || `<p class="empty-cart" style="grid-column:1/-1">No fragrances match those filters.</p>`;
  observeIn(container.querySelectorAll('.product-card'));
}
function bindAdd(){
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-add]');
    if (!b) return;
    e.preventDefault();
    addToCart(b.dataset.add, 1);
  });
}

/* -------- scroll reveal -------- */
const io = ('IntersectionObserver' in window) ? new IntersectionObserver((ents) => {
  ents.forEach(en => { if (en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
}, { rootMargin:'-40px' }) : null;
function observeIn(els){
  if (!io){ els.forEach(e => e.classList.add('in')); return; }
  els.forEach(e => io.observe(e));
}

/* -------- hero slideshow -------- */
function initHero(){
  const slides = $$('.hero-bg .slide');
  if (slides.length < 2) return;
  let i = 0;
  setInterval(() => {
    slides[i].classList.remove('on');
    i = (i+1) % slides.length;
    slides[i].classList.add('on');
  }, 5000);
}

/* -------- page: index -------- */
function pageIndex(){
  const feat = $('#featured-carousel');
  if (feat){
    const best = PRODUCTS.filter(p => p.tags?.includes('Best Seller')).slice(0,10);
    const pool = best.length ? best : PRODUCTS.slice(0,10);
    feat.innerHTML = pool.map(productCard).join('');
  }
  const womenC = PRODUCTS.filter(p => p.gender==='women').length;
 const menC   = PRODUCTS.filter(p => p.gender==='men').length;
  $('#women-count') && ($('#women-count').textContent = `${womenC} fragrances`);
  $('#men-count') && ($('#men-count').textContent = `${menC} fragrances`);
  const uniC = PRODUCTS.filter(p => p.gender==='unisex').length;
  $('#unisex-count') && ($('#unisex-count').textContent = `${uniC} fragrances`);
  const newC = $('#new-grid');
  if (newC){
    const newest = [...PRODUCTS].sort((a,b)=>b.id-a.id).slice(0,8);
    renderProducts(newC, newest);
  }
}

/* -------- page: shop -------- */
function pageShop(){
  const grid = $('#shop-grid');
  if (!grid) return;
  const params = new URLSearchParams(location.search);
  const state = {
    gender: params.get('gender') || 'all',
    tag: params.get('tag') || 'all',
    brand: 'all',
    q: '',
    sort: 'featured',
  };
  function apply(){
    let list = PRODUCTS.slice();
    if (state.gender !== 'all') list = list.filter(p => p.gender === state.gender);
    if (state.tag === 'sale') list = list.filter(p => p.tags?.includes('Sale') || p.onSale);
    else if (state.tag === 'luxury') list = list.filter(p => p.tags?.includes('Luxury'));
    else if (state.tag === 'best') list = list.filter(p => p.tags?.includes('Best Seller'));
    if (state.brand !== 'all') list = list.filter(p => p.brand === state.brand);
    if (state.q) {
      const q = state.q.toLowerCase();
      list = list.filter(p => (p.name+' '+p.brand+' '+p.description).toLowerCase().includes(q));
    }
    if (state.sort === 'price-asc') list.sort((a,b)=>a.price-b.price);
    else if (state.sort === 'price-desc') list.sort((a,b)=>b.price-a.price);
    else if (state.sort === 'name') list.sort((a,b)=>a.name.localeCompare(b.name));
    $('#results-count').textContent = `${list.length} fragrance${list.length===1?'':'s'}`;
    renderProducts(grid, list);
  }
  // brand dropdown
  const brandSel = $('#brand-select');
  if (brandSel){
    const brands = Array.from(new Set(PRODUCTS.map(p=>p.brand).filter(Boolean))).sort();
    brandSel.innerHTML = `<option value="all">All houses</option>` + brands.map(b=>`<option value="${b}">${b}</option>`).join('');
    brandSel.addEventListener('change', ()=>{state.brand=brandSel.value;apply();});
  }
  $$('[data-gender]').forEach(b => {
    if (b.dataset.gender === state.gender) b.classList.add('active');
    b.addEventListener('click', () => {
      state.gender = b.dataset.gender;
      $$('[data-gender]').forEach(x=>x.classList.toggle('active', x.dataset.gender===state.gender));
      apply();
    });
  });
  $$('[data-tag]').forEach(b => {
    if (b.dataset.tag === state.tag) b.classList.add('active');
    b.addEventListener('click', () => {
      state.tag = b.dataset.tag;
      $$('[data-tag]').forEach(x=>x.classList.toggle('active', x.dataset.tag===state.tag));
      apply();
    });
  });
  const search = $('#search-input');
  if (search) search.addEventListener('input', () => { state.q = search.value; apply(); });
  const sort = $('#sort-select');
  if (sort) sort.addEventListener('change', () => { state.sort = sort.value; apply(); });
  apply();
}

/* -------- page: product -------- */
function pageProduct(){
  const wrap = $('#pdp');
  if (!wrap) return;
  const id = new URLSearchParams(location.search).get('id');
  const p = getProduct(id);
  if (!p){ wrap.innerHTML = '<p style="padding:140px 24px;text-align:center">Fragrance not found.</p>'; return; }
  document.title = `${p.name} — Nova Nook Essence`;
  wrap.innerHTML = `
    <div class="pdp-media"><img src="${p.image}" alt="${p.name}"></div>
    <div>
      <div class="brand">${p.brand || 'Niche'}</div>
      <h1 class="serif">${p.name}</h1>
      <div class="price">${money(p.price)}</div>
      <p class="desc">${p.description || p.short || ''}</p>
      <div class="pdp-cta">
        <button class="btn solid" data-add="${p.id}">Add to Bag</button>
        <a class="btn ghost" href="cart.html">Checkout</a>
      </div>
      <div class="meta">
        <span>For <b>${p.gender}</b></span>
        ${p.tags?.length ? `<span>Tagged <b>${p.tags.join(' · ')}</b></span>` : ''}
        <span>Free shipping over $200</span>
        <span>Authentic & sealed</span>
      </div>
    </div>`;
  // related
  const rel = $('#related-grid');
  if (rel){
    const related = PRODUCTS.filter(x => x.id !== p.id && (x.brand === p.brand || x.gender === p.gender)).slice(0,4);
    renderProducts(rel, related);
  }
}

/* -------- page: cart / checkout -------- */
function renderCheckoutSummary(){
  const wrap = $('#checkout-summary');
  if (!wrap) return;
  const { items, subtotal, count } = cartTotals();
  if (!count){
    wrap.innerHTML = `<h3 class="serif">Your bag is empty</h3><p style="color:var(--ink-dim);margin-top:12px">Add a fragrance to begin.</p><a href="shop.html" class="btn ghost" style="margin-top:18px">Browse fragrances</a>`;
    $('#checkout-form-wrap') && ($('#checkout-form-wrap').style.display = 'none');
    return;
  }
  $('#checkout-form-wrap') && ($('#checkout-form-wrap').style.display = 'block');
  const ship = subtotal >= 200 ? 0 : 15;
  const total = subtotal + ship;
  wrap.innerHTML = `
    <h3 class="serif">Order Summary</h3>
    ${items.map(i => `
      <div class="summary-item">
        <span class="n">${i.p.name}</span>
        <span class="q">× ${i.qty}</span>
        <span>${money(i.p.price * i.qty)}</span>
      </div>`).join('')}
    <div class="summary-totals">
      <div class="summary-item"><span class="n">Subtotal</span><span>${money(subtotal)}</span></div>
      <div class="summary-item"><span class="n">Shipping</span><span>${ship === 0 ? 'Free' : money(ship)}</span></div>
      <div class="grand"><span>Total</span><span>${money(total)}</span></div>
    </div>`;
  // sync hidden field
  const sum = JSON.stringify(items.map(i=>({name:i.p.name, qty:i.qty, price:i.p.price, total:i.p.price*i.qty})));
  $('input[name="cart_json"]') && ($('input[name="cart_json"]').value = sum);
  $('input[name="cart_total"]') && ($('input[name="cart_total"]').value = money(total));
  $('input[name="cart_items_count"]') && ($('input[name="cart_items_count"]').value = String(count));
  // human-readable summary
  const lines = items.map(i => `${i.qty}× ${i.p.name} — ${money(i.p.price * i.qty)}`).join('\n');
  $('textarea[name="order_summary"]') && ($('textarea[name="order_summary"]').value =
    `${lines}\n\nSubtotal: ${money(subtotal)}\nShipping: ${ship === 0 ? 'Free' : money(ship)}\nTotal: ${money(total)}`);
}
function bindCheckout(){
  const form = $('#checkout-form');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const { count } = cartTotals();
    if (!count){ toast('Your bag is empty'); return; }
    const fd = new FormData(form);
    fd.set('access_key', WEB3FORMS_KEY);
    fd.set('subject', `New Order — Nova Nook Essence (${fd.get('name')})`);
    fd.set('from_name', 'Nova Nook Essence');
    fd.set('to', NOTIFY_EMAIL);
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true; btn.textContent = 'Placing order…';
    try{
      if (!WEB3FORMS_KEY || WEB3FORMS_KEY.startsWith('YOUR_')){
        // No key configured — store locally and forward to thank-you.
        console.warn('Web3Forms key missing — order not emailed.');
      } else {
        const res = await fetch('https://api.web3forms.com/submit', { method:'POST', body: fd });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || 'Submit failed');
      }
      localStorage.setItem('nne_last_order', JSON.stringify({
        name: fd.get('name'), email: fd.get('email'), total: fd.get('cart_total'), at: Date.now()
      }));
      saveCart([]);
      location.href = 'thank-you.html';
    } catch(err){
      console.error(err);
      btn.disabled = false; btn.textContent = 'Place Order';
      toast('Could not place order. Try again.');
    }
  });
}

/* -------- newsletter -------- */
function bindNewsletter(){
  $$('.newsletter').forEach(f => {
    f.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = f.querySelector('input[type="email"]').value.trim();
      if (!email) return;
      const fd = new FormData();
      fd.set('access_key', WEB3FORMS_KEY);
      fd.set('subject', 'New newsletter signup — Nova Nook Essence');
      fd.set('email', email);
      fd.set('to', NOTIFY_EMAIL);
      fd.set('from_name','Nova Nook Essence');
      try{
        if (WEB3FORMS_KEY && !WEB3FORMS_KEY.startsWith('YOUR_'))
          await fetch('https://api.web3forms.com/submit',{method:'POST',body:fd});
      } catch(e){}
      f.reset();
      toast('Subscribed. Welcome to the list.');
    });
  });
}

/* -------- thank you -------- */
function pageThanks(){
  const wrap = $('#thanks');
  if (!wrap) return;
  try{
    const o = JSON.parse(localStorage.getItem('nne_last_order') || 'null');
    if (o && o.name) $('#thanks-name').textContent = o.name;
    if (o && o.total) $('#thanks-total').textContent = o.total;
  } catch(e){}
}

/* -------- boot -------- */
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  updateCartBadge();
  initHero();
  bindDrawer();
  bindAdd();
  bindCheckout();
  bindNewsletter();
  pageIndex();
  pageShop();
  pageProduct();
  pageThanks();
  renderCheckoutSummary();
  // reveal generic .reveal-on-scroll elements
  observeIn(document.querySelectorAll('.product-card, .reveal-on-scroll'));
});
