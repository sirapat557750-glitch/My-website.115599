import { featured, allMenu, addons } from './data.js';

const state = {
  bill: [], // {id, name, duration, price}
  selectedDuration: {}, // id -> 60|90
};

const el = {
  featuredGrid: document.getElementById('featuredGrid'),
  itemCount: document.getElementById('itemCount'),
  totalPrice: document.getElementById('totalPrice'),
  menuSheet: document.getElementById('menuSheet'),
  menuSheetBackdrop: document.getElementById('menuSheetBackdrop'),
  closeMenuSheetBtn: document.getElementById('closeMenuSheetBtn'),
  openAllMenuBtn: document.getElementById('openAllMenuBtn'),
  allMenuList: document.getElementById('allMenuList'),
  billSheet: document.getElementById('billSheet'),
  billSheetBackdrop: document.getElementById('billSheetBackdrop'),
  closeBillSheetBtn: document.getElementById('closeBillSheetBtn'),
  openBillBtn: document.getElementById('openBillBtn'),
  billItems: document.getElementById('billItems'),
  billTotal: document.getElementById('billTotal'),
  checkoutBtn: document.getElementById('checkoutBtn'),
};

function fmt(n){ return Number(n).toLocaleString('th-TH'); }

function renderFeatured(){
  el.featuredGrid.innerHTML = '';
  featured.forEach(item=>{
    const card = document.createElement('div');
    card.className='card';

    const title = document.createElement('div');
    title.className='title';
    title.textContent = item.name;

    const desc = document.createElement('div');
    desc.className='desc';
    desc.textContent = item.desc;

    const priceRow = document.createElement('div');
    priceRow.className='price-row';

    ['60','90'].forEach(d=>{
      const chip = document.createElement('button');
      chip.className = 'chip' + ((state.selectedDuration[item.id] || '60') === d ? ' active':'');
      chip.textContent = `${d} นาที • ฿${fmt(item.prices[d])}`;
      chip.addEventListener('click', ()=>{
        state.selectedDuration[item.id] = d;
        renderFeatured(); // re-render to update active state
      });
      priceRow.appendChild(chip);
    });

    const actions = document.createElement('div');
    actions.className='actions';

    const addBtn = document.createElement('button');
    addBtn.className='btn add';
    addBtn.textContent='เพิ่มลงบิล';
    addBtn.addEventListener('click', ()=>{
      const d = state.selectedDuration[item.id] || '60';
      pushToBill({
        id: `${item.id}-${d}-${Date.now()}`,
        name: `${item.name} (${d} นาที)`,
        duration: d,
        price: item.prices[d],
      });
    });

    const moreBtn = document.createElement('button');
    moreBtn.className='btn more';
    moreBtn.textContent='รายละเอียด';
    moreBtn.addEventListener('click', ()=>openMenuSheet(item.id));

    actions.append(addBtn, moreBtn);

    card.append(title, desc, priceRow, actions);
    el.featuredGrid.appendChild(card);
  });
}

function pushToBill(entry){
  state.bill.push(entry);
  updateBillUI();
}

function removeFromBill(id){
  state.bill = state.bill.filter(x=>x.id!==id);
  updateBillUI();
}

function updateBillUI(){
  el.itemCount.textContent = state.bill.length;
  const total = state.bill.reduce((sum,x)=>sum+x.price,0);
  el.totalPrice.textContent = fmt(total);
  el.billItems.innerHTML = '';
  state.bill.forEach(x=>{
    const row = document.createElement('div');
    row.className='list-item';
    const left = document.createElement('div');
    left.innerHTML = `<div class=\"name\">${x.name}</div><div class=\"small\">฿${fmt(x.price)}</div>`;
    const right = document.createElement('div');
    right.className='inline';
    const rm = document.createElement('button');
    rm.className='sheet-btn remove';
    rm.textContent='ลบ';
    rm.addEventListener('click', ()=>removeFromBill(x.id));
    right.appendChild(rm);
    row.append(left,right);
    el.billItems.appendChild(row);
  });
  el.billTotal.textContent = fmt(total);
}

function openMenuSheet(focusId){
  el.menuSheet.setAttribute('aria-hidden','false');
  renderAllMenu(focusId);
}

function closeMenuSheet(){
  el.menuSheet.setAttribute('aria-hidden','true');
}

function renderAllMenu(focusId){
  el.allMenuList.innerHTML = '';
  const list = document.createElement('div');
  list.className='list';

  allMenu.forEach(item=>{
    const row = document.createElement('div');
    row.className='list-item';
    if (item.id===focusId) row.style.borderColor = 'var(--accent)';

    const info = document.createElement('div');
    info.innerHTML = `
      <div class=\"name\">${item.name}</div>
      <div class=\"small\">${item.desc}</div>
      <div class=\"small\">60 นาที ฿${fmt(item.prices['60'])} • 90 นาที ฿${fmt(item.prices['90'])}</div>
    `;

    const controls = document.createElement('div');
    controls.className='inline';

    const d60 = document.createElement('button');
    d60.className='chip' + ((state.selectedDuration[item.id]||'60')==='60'?' active':'');
    d60.textContent='60 นาที';
    d60.addEventListener('click', ()=>{
      state.selectedDuration[item.id]='60';
      renderAllMenu(focusId);
    });

    const d90 = document.createElement('button');
    d90.className='chip' + ((state.selectedDuration[item.id]||'60')==='90'?' active':'');
    d90.textContent='90 นาที';
    d90.addEventListener('click', ()=>{
      state.selectedDuration[item.id]='90';
      renderAllMenu(focusId);
    });

    const addBtn = document.createElement('button');
    addBtn.className='sheet-btn primary';
    addBtn.textContent='เพิ่ม';
    addBtn.addEventListener('click', ()=>{
      const d = state.selectedDuration[item.id] || '60';
      pushToBill({
        id: `${item.id}-${d}-${Date.now()}`,
        name: `${item.name} (${d} นาที)`,
        duration: d,
        price: item.prices[d],
      });
    });

    controls.append(d60,d90,addBtn);
    row.append(info,controls);
    list.appendChild(row);
  });

  // Add-ons section
  const addonsHeader = document.createElement('div');
  addonsHeader.style.marginTop='6px';
  addonsHeader.style.fontWeight='700';
  addonsHeader.textContent='รายการเสริม';
  list.appendChild(addonsHeader);

  addons.forEach(ad=>{
    const row = document.createElement('div');
    row.className='list-item';
    const info = document.createElement('div');
    info.innerHTML = `<div class=\"name\">${ad.name}</div><div class=\"small\">฿${fmt(ad.price)}</div>`;
    const addBtn = document.createElement('button');
    addBtn.className='sheet-btn primary';
    addBtn.textContent='เพิ่ม';
    addBtn.addEventListener('click', ()=>{
      pushToBill({
        id: `${ad.id}-${Date.now()}`,
        name: ad.name,
        duration: null,
        price: ad.price,
      });
    });
    row.append(info, addBtn);
    list.appendChild(row);
  });

  el.allMenuList.appendChild(list);
}

function openBillSheet(){
  el.billSheet.setAttribute('aria-hidden','false');
}
function closeBillSheet(){
  el.billSheet.setAttribute('aria-hidden','true');
}

// Wire UI
el.openAllMenuBtn.addEventListener('click', openMenuSheet);
el.menuSheetBackdrop.addEventListener('click', closeMenuSheet);
el.closeMenuSheetBtn.addEventListener('click', closeMenuSheet);

el.openBillBtn.addEventListener('click', openBillSheet);
el.billSheetBackdrop.addEventListener('click', closeBillSheet);
el.closeBillSheetBtn.addEventListener('click', closeBillSheet);

el.checkoutBtn.addEventListener('click', ()=>{
  // Simple feedback
  alert('บันทึกบิลเรียบร้อย');
  state.bill = [];
  updateBillUI();
  closeBillSheet();
});

// Init
renderFeatured();
updateBillUI();