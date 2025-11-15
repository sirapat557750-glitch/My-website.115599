export const featured = [
  { id: 'thai', name: 'นวดไทย', desc: 'กดจุด ยืดเส้น', prices: {60: 300, 90: 450} },
  { id: 'oil', name: 'นวดน้ำมัน', desc: 'ผ่อนคลายลึก', prices: {60: 450, 90: 650} },
  { id: 'foot', name: 'นวดเท้า', desc: 'รีเฟล็กซ์ปลายเท้า', prices: {60: 250, 90: 380} },
  { id: 'head', name: 'นวดคอ บ่า ไหล่', desc: 'แก้ปวดตึง', prices: {60: 300, 90: 450} },
];

export const allMenu = [
  ...featured,
  { id: 'aroma', name: 'อโรมาเธอราพี', desc: 'น้ำมันหอมระเหย', prices: {60: 550, 90: 750} },
  { id: 'hotstone', name: 'นวดหินร้อน', desc: 'อบอุ่นลึก', prices: {60: 650, 90: 850} },
  { id: 'herbal', name: 'ประคบสมุนไพร', desc: 'เพิ่มความผ่อนคลาย', prices: {60: 350, 90: 500} },
];

export const addons = [
  { id: 'salve', name: 'ยาหม่องสมุนไพร', price: 50 },
  { id: 'scrub', name: 'สครับมือ/เท้า', price: 120 },
];