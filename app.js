const panels = Array.from(document.querySelectorAll('.panel'));
const navbtns = Array.from(document.querySelectorAll('.navbtn'));
const sheet = document.getElementById('sheet');
const sheetContent = document.getElementById('sheetContent');
const toast = document.getElementById('toast');

function showPanel(name){
  panels.forEach(p=>p.classList.toggle('active', p.dataset.panel===name));
  navbtns.forEach(b=>b.classList.toggle('active', b.dataset.tab===name));
}
navbtns.forEach(btn=>btn.addEventListener('click', ()=>showPanel(btn.dataset.tab)));

document.querySelectorAll('[data-open]').forEach(el=>{
  el.addEventListener('click', ()=>showPanel(el.dataset.open));
});

document.getElementById('quickBookBtn').addEventListener('click', ()=>showPanel('booking'));

function openSheet(html){ sheetContent.innerHTML = html; sheet.classList.add('open'); }
function closeSheet(){ sheet.classList.remove('open'); }
sheet.addEventListener('click', (e)=>{ if(e.target===sheet) closeSheet(); });

function formatPrice(service){
  switch(service){
    case 'thai': return '฿400 / 60 นาที';
    case 'oil': return '฿650 / 90 นาที';
    case 'foot': return '฿350 / 60 นาที';
    case 'shoulder': return '฿300 / 45 นาที';
    default: return '';
  }
}

function serviceDetail(service){
  const nameMap = {
    thai:'นวดไทย', oil:'นวดน้ำมันอโรม่า', foot:'นวดเท้า รีเฟล็กซ์', shoulder:'คอ บ่า ไหล่'
  };
  return `
    <h3 style="margin:4px 0">${nameMap[service]}</h3>
    <div style="color:#6b665f;font-size:14px;margin-bottom:10px">${formatPrice(service)}</div>
    <p style="line-height:1.5">
      เทคนิคมืออาชีพ เน้นความปลอดภัยและสุขอนามัย อบอุ่น ผ่อนคลาย เหมาะสำหรับทุกคน
    </p>
    <div style="display:flex;gap:8px;margin-top:12px">
      <button class="btn" id="closeSheetBtn">ปิด</button>
      <button class="btn primary" id="bookServiceBtn">จองบริการนี้</button>
    </div>
  `;
}

document.querySelectorAll('[data-service]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const s = btn.dataset.service;
    openSheet(serviceDetail(s));
    sheetContent.querySelector('#closeSheetBtn').addEventListener('click', closeSheet);
    sheetContent.querySelector('#bookServiceBtn').addEventListener('click', ()=>{
      closeSheet();
      showPanel('booking');
      const sel = document.querySelector('select[name="service"]');
      sel.value = s;
      showToast('เลือกบริการแล้ว');
    });
  });
});

function therapistDetail(id){
  const data = {
    aom:{ name:'อ้อม', skill:'นวดไทยลึก | คอ บ่า ไหล่', img:'./assets/therapist1.png' },
    mike:{ name:'ไมค์', skill:'น้ำมันอโรม่า | สปอร์ต', img:'./assets/therapist2.png' },
  }[id];
  return `
    <div style="display:flex;gap:10px;align-items:center">
      <img src="${data.img}" alt="${data.name}" style="width:84px;height:84px;object-fit:cover;border-radius:10px" />
      <div>
        <div style="font-weight:700">${data.name}</div>
        <div style="color:#6b665f">${data.skill}</div>
      </div>
    </div>
    <div style="margin-top:12px">
      <p style="line-height:1.5">ประสบการณ์ 5+ ปี ใส่ใจรายละเอียด ปรับแรงตามต้องการ</p>
    </div>
    <div style="display:flex;gap:8px;margin-top:12px">
      <button class="btn" id="closeSheetBtn">ปิด</button>
      <button class="btn primary" id="pickTherapistBtn">จองกับ${data.name}</button>
    </div>
  `;
}
document.querySelectorAll('[data-therapist]').forEach(card=>{
  card.addEventListener('click', ()=>{
    const id = card.dataset.therapist;
    openSheet(therapistDetail(id));
    sheetContent.querySelector('#closeSheetBtn').addEventListener('click', closeSheet);
    sheetContent.querySelector('#pickTherapistBtn').addEventListener('click', ()=>{
      closeSheet();
      showPanel('booking');
      const sel = document.querySelector('select[name="therapist"]');
      sel.value = id;
      showToast('เลือกหมอนวดแล้ว');
    });
  });
});

document.getElementById('openMapBtn').addEventListener('click', ()=>{
  openSheet(`
    <h3 style="margin:4px 0">แผนที่ร้าน</h3>
    <div style="color:#6b665f;font-size:14px;margin-bottom:10px">ซอยสุขภาพ 9, บางกอก</div>
    <div style="height:200px;border-radius:12px;overflow:hidden;border:1px solid #e6dfd6;background:#eee;display:grid;place-items:center;color:#6b665f">
      ใส่แผนที่ Google Map ได้ที่นี่
    </div>
    <div style="display:flex;gap:8px;margin-top:12px">
      <button class="btn" id="closeSheetBtn">ปิด</button>
      <a class="btn primary" href="https://maps.google.com" target="_blank">เปิดในแผนที่</a>
    </div>
  `);
  sheetContent.querySelector('#closeSheetBtn').addEventListener('click', closeSheet);
});

function showToast(msg){
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(()=>toast.classList.remove('show'), 1800);
}

document.getElementById('bookingForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  const summary = `
    <h3 style="margin:4px 0">ยืนยันการจอง</h3>
    <div style="color:#6b665f">${data.name}</div>
    <div style="margin-top:8px">บริการ: <strong>${document.querySelector('select[name="service"] option:checked').textContent}</strong></div>
    <div>วันที่: <strong>${data.date || '-'}</strong>, เวลา: <strong>${data.time || '-'}</strong></div>
    <div>หมอนวด: <strong>${(data.therapist && (data.therapist==='aom'?'อ้อม':'ไมค์')) || 'ไม่ระบุ'}</strong></div>
    <div style="display:flex;gap:8px;margin-top:12px">
      <button class="btn" id="closeSheetBtn">แก้ไข</button>
      <button class="btn primary" id="confirmBtn">ยืนยัน</button>
    </div>
  `;
  openSheet(summary);
  sheetContent.querySelector('#closeSheetBtn').addEventListener('click', closeSheet);
  sheetContent.querySelector('#confirmBtn').addEventListener('click', ()=>{
    closeSheet();
    e.target.reset();
    showPanel('home');
    showToast('จองคิวสำเร็จ ทางร้านจะติดต่อยืนยัน');
  });
});

// Start at home
showPanel('home');