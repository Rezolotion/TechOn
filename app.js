/**
 * TechOn Platform - High-Performance Client Application
 * Features:
 * 1. Dark/Light Theme System
 * 2. Strict Role-Based Access Control (RBAC) & 1-Click Role Switcher Bottom Sheet
 * 3. Flow Separation (Coworking Space vs Conference Hall) - Big Papa's UX
 * 4. Multi-Slot Hourly Basket & Daily Range / Custom Schedulers - Reza Sr's UX
 * 5. Interactive Persian Jalali Calendar
 * 6. Collapsible Catering & Add-ons
 * 7. Live Real-Time Invoice Breakdown & Modal Receipt
 * 8. Responsive Desktop & Mobile Adaptive Layout
 */

// Demo Users Configuration
const DEMO_ACCOUNTS = [
  {
    id: 'user-cust',
    username: 'customer',
    password: 'cust123',
    name: 'مریم رضایی',
    phone: '09124444444',
    role: 'CUSTOMER',
    title: 'مشتری / کاربر عادی',
    avatar: '👩‍💼',
    color: 'badge-primary',
    desc: 'دسترسی فقط به رزرواسیون، منوی کافه و پیگیری رزروهای خود'
  },
  {
    id: 'user-cowork',
    username: 'cowork_op',
    password: 'cowork123',
    name: 'علی کاظمی',
    phone: '09122222222',
    role: 'COWORKING_OPERATOR',
    title: 'اپراتور فضای کار اشتراکی',
    avatar: '🏢',
    color: 'badge-warning',
    desc: 'دسترسی به مدیریت صندلی‌ها، اتاق‌ها و ثبت دستی مراجعین'
  },
  {
    id: 'user-cafe',
    username: 'cafe_op',
    password: 'cafe123',
    name: 'سارا تهرانی',
    phone: '09123333333',
    role: 'CAFE_OPERATOR',
    title: 'اپراتور سالن همایش و کافه',
    avatar: '☕',
    color: 'badge-success',
    desc: 'دسترسی به بررسی و تأیید رویدادهای سالن و مدیریت منوی کافه'
  },
  {
    id: 'user-admin',
    username: 'admin',
    password: 'admin123',
    name: 'مهندس نیامنش',
    phone: '09121111111',
    role: 'SUPER_ADMIN',
    title: 'سوپرادمین (مدیریت کل)',
    avatar: '👑',
    color: 'badge-danger',
    desc: 'دسترسی نامحدود به تمامی بخش‌ها، ایجاد کوپن و گزارشات مالی سهم درآمد'
  }
];

// Space Visual Icons Map
const SPACE_ICONS = {
  CONFERENCE_HALL: '🎤',
  MEETING_ROOM: '🤝',
  PRIVATE_OFFICE: '💼',
  SHARED_DESK: '💻'
};

// Catering Category Icons & Persian Labels
const CATEGORY_META = {
  PACKAGE: { label: 'پکیج پذیرایی', icon: '🎁' },
  BEVERAGE_HOT: { label: 'نوشیدنی گرم', icon: '☕' },
  BEVERAGE_COLD: { label: 'نوشیدنی سرد', icon: '🧃' },
  SNACK: { label: 'اسنک و فینگرفود', icon: '🥐' },
  MEAL: { label: 'میان‌وعده و وعده غذایی', icon: '🥪' }
};

// Persian Digits Helper
function toPersianDigits(n) {
  if (n === null || n === undefined) return '';
  const map = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
  return String(n).replace(/[0-9]/g, d => map[d]);
}

// Currency Formatter
function formatCurrency(amount) {
  if (!amount && amount !== 0) return '۰ تومان';
  return Number(amount).toLocaleString('fa-IR') + ' تومان';
}

// Date Formatter
function formatPersianDate(dateStr) {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      return d.toLocaleDateString('fa-IR', { month: 'long', day: 'numeric', weekday: 'short' });
    }
    return new Date(dateStr).toLocaleDateString('fa-IR', { month: 'long', day: 'numeric', weekday: 'short' });
  } catch (e) {
    return dateStr;
  }
}

// Application State
const state = {
  theme: 'dark',
  currentUser: DEMO_ACCOUNTS[0],
  spaces: [],
  cateringMenu: [],
  selectedCategoryFilter: 'ALL',
  selectedFlow: 'COWORKING', // 'COWORKING' or 'HALL'
  selectedSpaceKey: 'SHARED_DESK',
  bookingType: 'HOURLY', // 'HOURLY' or 'DAILY'
  rateViewMode: 'HOURLY',
  deskCount: 1,
  selectedCalendarDate: new Date().toISOString().slice(0, 10),
  selectedCalendarLabel: 'امروز',
  hourlySlots: [], // Array of { id, date, dateLabel, startTime, endTime, startTimeStr, endTimeStr, hours, label }
  dailyMode: 'RANGE', // 'RANGE' or 'CUSTOM'
  dailyStartDate: new Date().toISOString().slice(0, 10),
  dailyEndDate: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10),
  customDailyDates: [], // Array of string dates 'YYYY-MM-DD'
  cateringOrders: {}, // itemId -> count
  cateringAddonOpen: true,
  appliedPromo: null,
  reservations: []
};

// Toast Notifier
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast-item toast-${type}`;
  toast.innerText = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 4000);
}

// Default Data Specifications for Client-Side Standalone Fallback (GitHub Pages Mode)
const DEFAULT_SPACES = [
  {
    key: 'SHARED_DESK',
    name: 'صندلی کار اشتراکی (۶۰ صندلی)',
    hourlyRate: 40000,
    dailyRate: 250000,
    capacity: 60,
    totalUnits: 60,
    unitLabel: 'صندلی',
    description: 'فضای کار اشتراکی آرام، اینترنت فیبر نوری پرسرعت، صندلی ارگونومیک، پریز اختصاصی و چای نامحدود.',
    features: ['اینترنت پرسرعت ۱ Gbps', 'صندلی ارگونومیک استاندارد', 'پریز برق اختصاصی', 'پذیرایی پایه (چای و آب)']
  },
  {
    key: 'PRIVATE_OFFICE',
    name: 'اتاق کار اختصاصی تیم (۴ اتاق)',
    hourlyRate: 350000,
    dailyRate: 2400000,
    capacity: 4,
    totalUnits: 4,
    unitLabel: 'اتاق',
    description: 'اتاق دربسته ۴ نفره مجهز به میز اختصاصی، وایت‌برد و محیطی کاملاً آکوستیک برای تمرکز تیمی.',
    features: ['محیط کاملاً آکوستیک و مستقل', 'ظرفیت تا ۴ نفر', 'وایت‌برد شیشه‌ای و تلویزیون', 'تهویه مطبوع مجزا']
  },
  {
    key: 'MEETING_ROOM',
    name: 'اتاق جلسه و ویدیوکنفرانس (۱ اتاق)',
    hourlyRate: 250000,
    dailyRate: 1800000,
    capacity: 12,
    totalUnits: 1,
    unitLabel: 'اتاق',
    description: 'اتاق جلسه ۱۲ نفره مجهز به نمایشگر ۶۵ اینچ 4K، سیستم صوتی و وبکم کنفرانس هوشمند.',
    features: ['نمایشگر ۶۵ اینچ 4K', 'تجهیزات وبکم و میکروفون کنفرانس', 'وایت‌برد شیشه‌ای بزرگ', 'عایق صوتی پیشرفته']
  },
  {
    key: 'CONFERENCE_HALL',
    name: 'سالن همایش و رویداد تکـان (۱ سالن)',
    hourlyRate: 1500000,
    dailyRate: 12000000,
    capacity: 70,
    totalUnits: 1,
    unitLabel: 'سالن',
    description: 'سالن همایش حرفه‌ای با ظرفیت ۷۰ نفر، استیج اختصاصی، پروژکتور 4K، سیستم صوتی استودیویی و نورپردازی.',
    features: ['ظرفیت ۷۰ نفر صندلی سینمایی', 'ویدیو پروژکتور لیزری 4K و پرده عریض', 'سیستم صوت و میکروفون بی‌سیم', 'استیج اختصاصی و نورپردازی تئاتری', 'امکان ضبط چنددوربینه و لایواستریم']
  }
];

const DEFAULT_CATERING = [
  { id: 'pkg-basic', name: 'پکیج پایه تکان (چای/قهوه + بیسکوییت)', category: 'PACKAGE', price: 45000, description: 'چای تازه‌دم لاهیجان یا قهوه فرانسه به همراه بیسکوییت پذیرایی' },
  { id: 'pkg-vip', name: 'پکیج VIP تکان (قهوه دمی + کروسان + فینگر)', category: 'PACKAGE', price: 120000, description: 'قهوه تخصصی دمی + کروسان فرانسوی تازه + اسنک مغزدار' },
  { id: 'pkg-meeting', name: 'پکیج تشریفات جلسه (پذیرایی VIP + آبمیوه طبیعی)', category: 'PACKAGE', price: 160000, description: 'پذیرایی کامل جلسات شرکتی با میوه فصل و نوشیدنی تازه' },
  { id: 'bev-espresso', name: 'اسپرسو دوبل تخصصی', category: 'BEVERAGE_HOT', price: 55000, description: '۱۰۰٪ عربیکا با رست مدیوم' },
  { id: 'bev-latte', name: 'لاته آرت', category: 'BEVERAGE_HOT', price: 65000, description: 'شیر تازه با کف مخملی و اسپرسو سینگل' },
  { id: 'bev-tea', name: 'چای لاهیجان با هل و دارچین', category: 'BEVERAGE_HOT', price: 35000, description: 'سرو در قوری سنتی با نبات' },
  { id: 'bev-smoothie', name: 'اسموتی بری و پشن‌فروت طبیعی', category: 'BEVERAGE_COLD', price: 85000, description: 'بدون شکر افزوده با میوه‌های ارگانیک' },
  { id: 'bev-coldbrew', name: 'کلدبرو مخصوص کافه تکان', category: 'BEVERAGE_COLD', price: 75000, description: 'عصاره‌گیری سرد ۱۸ ساعته' },
  { id: 'snack-croissant', name: 'کروسان بادام فرانسوی تازه', category: 'SNACK', price: 60000, description: 'پخت روزانه در کافه تکان' },
  { id: 'meal-club', name: 'کلاب ساندویچ بیکن بوقلمون', category: 'MEAL', price: 110000, description: 'نان تست هفت‌غله با سس خردل دیژون' }
];

function getStoredCateringMenu() {
  try {
    const raw = localStorage.getItem('techon_standalone_catering');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return DEFAULT_CATERING;
}

function getStoredReservations() {
  try {
    const raw = localStorage.getItem('techon_standalone_reservations');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [];
}

function saveStoredReservations(list) {
  try {
    localStorage.setItem('techon_standalone_reservations', JSON.stringify(list));
  } catch (e) {}
}

function getStoredPromos() {
  const defaults = {
    'TECHON2026': { type: 'PERCENT', value: 20, maxDiscount: 500000 },
    'STARTUP50': { type: 'PERCENT', value: 50, maxDiscount: 1000000 },
    'EVENTVIP': { type: 'PERCENT', value: 15, maxDiscount: 1500000 }
  };
  try {
    const raw = localStorage.getItem('techon_standalone_promos');
    if (raw) return { ...defaults, ...JSON.parse(raw) };
  } catch (e) {}
  return defaults;
}

// Check if running on GitHub Pages or static host
const isStaticHost = window.location.hostname.includes('github.io') || window.location.protocol === 'file:';

// API Request Wrapper with Auto Standalone Fallback
async function apiRequest(endpoint, method = 'GET', body = null) {
  // If not static host, try network fetch first
  if (!isStaticHost) {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'X-User-Role': state.currentUser.role
      };
      const options = { method, headers };
      if (body) options.body = JSON.stringify(body);

      const res = await fetch(endpoint, options);
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (netErr) {
      console.warn('[TechOn] Network fetch failed, falling back to standalone client engine:', netErr);
    }
  }

  // --- Standalone Fallback Engine ---
  if (endpoint === '/api/health' && method === 'GET') {
    return { status: 'UP', platform: 'TechOn (Standalone/GitHub Pages)', timestamp: new Date().toISOString() };
  }

  if (endpoint === '/api/spaces' && method === 'GET') {
    return { success: true, spaces: DEFAULT_SPACES };
  }

  if (endpoint === '/api/catering/menu' && method === 'GET') {
    return { success: true, menu: getStoredCateringMenu() };
  }

  if (endpoint === '/api/promo/validate' && method === 'POST') {
    const code = (body?.code || '').trim().toUpperCase();
    const subtotal = Number(body?.subtotal) || 0;
    const promos = getStoredPromos();
    const promo = promos[code];

    if (!promo) {
      return { valid: false, message: 'کد تخفیف وارد شده معتبر نمی‌باشد.' };
    }

    let discount = 0;
    if (promo.type === 'PERCENT') {
      discount = Math.round((subtotal * promo.value) / 100);
      if (promo.maxDiscount && discount > promo.maxDiscount) {
        discount = promo.maxDiscount;
      }
    } else {
      discount = Math.min(subtotal, promo.value || 0);
    }

    return {
      valid: true,
      code,
      discountAmount: discount,
      finalTotal: Math.max(0, subtotal - discount),
      message: `کد تخفیف با موفقیت اعمال شد (${promo.value}% تخفیف)`
    };
  }

  if (endpoint === '/api/reservations' && method === 'POST') {
    const resList = getStoredReservations();
    const space = DEFAULT_SPACES.find(s => s.key === body.spaceKey) || DEFAULT_SPACES[0];
    const duration = Number(body.duration) || 1;
    const bookingType = body.bookingType || 'HOURLY';
    const rate = bookingType === 'DAILY' ? space.dailyRate : space.hourlyRate;
    const spaceSubtotal = Math.round(rate * duration);

    // Calculate catering
    let cateringSubtotal = 0;
    const detailedCatering = [];
    if (Array.isArray(body.catering)) {
      const menu = getStoredCateringMenu();
      for (const item of body.catering) {
        const menuItem = menu.find(m => m.id === item.id);
        if (menuItem) {
          const itemSub = menuItem.price * item.quantity;
          cateringSubtotal += itemSub;
          detailedCatering.push({ name: menuItem.name, quantity: item.quantity, subtotal: itemSub });
        }
      }
    }

    const subtotal = spaceSubtotal + (body.equipmentFee || 0) + cateringSubtotal;
    const discountAmount = body.appliedPromo?.discountAmount || 0;
    const finalTotal = Math.max(0, subtotal - discountAmount);

    const resId = `RES-${Date.now().toString().slice(-6)}`;
    const invoiceNum = `INV-${Date.now().toString().slice(-6)}`;

    const newReservation = {
      id: resId,
      spaceKey: space.key,
      spaceName: space.name,
      bookingType,
      duration,
      scheduleDescription: body.scheduleDescription || `${duration} ${bookingType === 'DAILY' ? 'روز' : 'ساعت'}`,
      timeSlots: body.timeSlots || [],
      dailySchedule: body.dailySchedule || null,
      startTime: body.startTime || new Date().toISOString(),
      endTime: body.endTime || new Date().toISOString(),
      status: space.key === 'CONFERENCE_HALL' ? 'PENDING_REVIEW' : 'CONFIRMED',
      customer: {
        name: body.customerName || state.currentUser.name,
        phone: body.customerPhone || state.currentUser.phone,
        email: body.customerEmail || ''
      },
      equipment: body.selectedEquipment || [],
      catering: detailedCatering,
      pricing: {
        spaceSubtotal,
        equipmentFee: body.equipmentFee || 0,
        cateringSubtotal,
        discountAmount,
        finalTotal
      },
      createdAt: new Date().toISOString()
    };

    const newInvoice = {
      invoiceNumber: invoiceNum,
      reservationId: resId,
      customer: newReservation.customer,
      scheduleDescription: newReservation.scheduleDescription,
      items: [
        { title: `رزرو ${space.name} (${newReservation.scheduleDescription})`, amount: spaceSubtotal },
        ...(body.selectedEquipment || []).map(e => ({ title: e.name, amount: e.fee })),
        ...detailedCatering.map(c => ({ title: `${c.name} (تعداد: ${c.quantity})`, amount: c.subtotal }))
      ],
      subtotal,
      discountAmount,
      finalTotal,
      paymentStatus: 'PAID',
      paidAt: new Date().toISOString()
    };

    resList.unshift(newReservation);
    saveStoredReservations(resList);

    return {
      success: true,
      reservation: newReservation,
      invoice: newInvoice
    };
  }

  if (endpoint.startsWith('/api/my-reservations') && method === 'GET') {
    const list = getStoredReservations();
    const urlObj = new URL(endpoint, 'http://dummy.local');
    const phone = urlObj.searchParams.get('phone');
    const filtered = phone ? list.filter(r => r.customer?.phone === phone) : list;
    return { success: true, reservations: filtered };
  }

  if (endpoint === '/api/admin/reservations' && method === 'GET') {
    const list = getStoredReservations();
    return { success: true, reservations: list };
  }

  if (endpoint.includes('/approve') && method === 'POST') {
    const match = endpoint.match(/\/api\/admin\/reservations\/([^/]+)\/approve/);
    const resId = match ? match[1] : null;
    const list = getStoredReservations();
    const target = list.find(r => r.id === resId);
    if (target) {
      target.status = 'CONFIRMED';
      saveStoredReservations(list);
      return { success: true, reservation: target };
    }
    return { success: false, error: 'رزرو یافت نشد' };
  }

  if (endpoint.includes('/cancel') && method === 'POST') {
    const match = endpoint.match(/\/api\/admin\/reservations\/([^/]+)\/cancel/);
    const resId = match ? match[1] : null;
    const list = getStoredReservations();
    const target = list.find(r => r.id === resId);
    if (target) {
      target.status = 'CANCELLED';
      target.cancellationReason = body?.reason || 'لغو توسط مدیر';
      saveStoredReservations(list);
      return { success: true, reservation: target };
    }
    return { success: false, error: 'رزرو یافت نشد' };
  }

  if (endpoint === '/api/admin/catering/items' && method === 'POST') {
    const list = getStoredCateringMenu();
    const newItem = {
      id: `custom-${Date.now()}`,
      name: body.name,
      category: body.category || 'SNACK',
      price: Number(body.price) || 0,
      description: body.description || ''
    };
    list.push(newItem);
    localStorage.setItem('techon_standalone_catering', JSON.stringify(list));
    return { success: true, item: newItem };
  }

  if (endpoint === '/api/admin/promos' && method === 'POST') {
    const promos = getStoredPromos();
    const code = (body.code || '').trim().toUpperCase();
    promos[code] = {
      type: body.type || 'PERCENT',
      value: Number(body.value) || 0,
      maxDiscount: Number(body.maxDiscount) || 500000
    };
    localStorage.setItem('techon_standalone_promos', JSON.stringify(promos));
    return { success: true, promo: { code, ...promos[code] } };
  }

  if (endpoint === '/api/admin/analytics' && method === 'GET') {
    const list = getStoredReservations();
    let totalRevenue = 0;
    let spaceRevenue = 0;
    let cateringRevenue = 0;

    for (const r of list) {
      if (r.status !== 'CANCELLED') {
        totalRevenue += r.pricing?.finalTotal || 0;
        spaceRevenue += r.pricing?.spaceSubtotal || 0;
        cateringRevenue += r.pricing?.cateringSubtotal || 0;
      }
    }

    const contractorShare10 = Math.round(totalRevenue * 0.10);
    const contractorShare15 = Math.round(totalRevenue * 0.15);

    return {
      success: true,
      financials: {
        totalRevenue,
        spaceRevenue,
        cateringRevenue,
        totalReservations: list.length,
        activeReservations: list.filter(r => r.status === 'CONFIRMED').length,
        pendingReviewCount: list.filter(r => r.status === 'PENDING_REVIEW').length
      },
      revenueShare: {
        rateMinPercentage: 10,
        rateMaxPercentage: 15,
        contractorShare10,
        contractorShare15,
        clientShare85: totalRevenue - contractorShare15,
        clientShare90: totalRevenue - contractorShare10
      },
      auditLogs: []
    };
  }

  return { success: false, error: 'Endpoint not supported' };
}

// 1. Dark Mode / Light Mode
function setupThemeEngine() {
  const savedTheme = localStorage.getItem('techon_theme') || 'dark';
  setTheme(savedTheme);

  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const nextTheme = state.theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    showToast(nextTheme === 'dark' ? '🌙 حالت شب فعال شد' : '☀️ حالت روز فعال شد');
  });
}

function setTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('techon_theme', theme);

  const iconEl = document.getElementById('theme-icon');
  if (iconEl) iconEl.innerText = theme === 'dark' ? '☀️' : '🌙';
}

// 2. Authentication & Role Switcher
function setupAuthSystem() {
  const modal = document.getElementById('user-role-modal');
  const btnOpen = document.getElementById('btn-open-user-menu');
  const btnClose = document.getElementById('btn-close-role-modal');
  const listContainer = document.getElementById('roles-modal-list');

  btnOpen?.addEventListener('click', () => modal?.classList.remove('hidden'));
  btnClose?.addEventListener('click', () => modal?.classList.add('hidden'));

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
  });

  if (listContainer) {
    listContainer.innerHTML = DEMO_ACCOUNTS.map(u => `
      <div class="role-option-card ${u.id === state.currentUser.id ? 'active-role' : ''}" onclick="switchUserRole('${u.username}')">
        <div style="display:flex; align-items:center; gap:0.65rem;">
          <span style="font-size:1.5rem;">${u.avatar}</span>
          <div>
            <strong style="font-size:0.88rem; display:block;">${u.name}</strong>
            <small style="font-size:0.72rem; color:var(--text-dim);">${u.title}</small>
          </div>
        </div>
        <span style="font-size:0.76rem; color:var(--primary); font-weight:800;">${u.id === state.currentUser.id ? 'فعال ✓' : 'انتخاب'}</span>
      </div>
    `).join('');
  }

  applyRoleVisibility();
}

window.switchUserRole = function(username) {
  const target = DEMO_ACCOUNTS.find(u => u.username === username);
  if (!target) return;
  state.currentUser = target;
  document.getElementById('user-role-modal')?.classList.add('hidden');
  setupAuthSystem();
  applyRoleVisibility();
  showToast(`نقش به "${target.name}" (${target.title}) تغییر یافت.`);
};

// 3. Strict Scoping per Role
function applyRoleVisibility() {
  const user = state.currentUser;

  // Header profile sync
  const avatarEl = document.getElementById('current-user-avatar');
  const nameEl = document.getElementById('current-user-name');
  const roleBadge = document.getElementById('current-user-role-badge');
  if (avatarEl) avatarEl.innerText = user.avatar;
  if (nameEl) nameEl.innerText = user.name;
  if (roleBadge) roleBadge.innerText = user.title;

  // Alert banner sync
  const bannerEl = document.getElementById('role-context-text');
  if (bannerEl) {
    if (user.role === 'CUSTOMER') {
      bannerEl.innerHTML = `<strong>دیدگاه مشتری (${user.name}):</strong> دسترسی به رزرواسیون فضا، منوی کافه و پیگیری سفارش‌ها.`;
    } else if (user.role === 'COWORKING_OPERATOR') {
      bannerEl.innerHTML = `<strong>دیدگاه اپراتور فضای کار (${user.name}):</strong> دسترسی به مدیریت ۶۰ صندلی، ۴ اتاق اختصاصی و ثبت دستی.`;
    } else if (user.role === 'CAFE_OPERATOR') {
      bannerEl.innerHTML = `<strong>دیدگاه اپراتور سالن و کافه (${user.name}):</strong> بررسی و تأیید همایش‌ها و ویرایش منوی کافه.`;
    } else if (user.role === 'SUPER_ADMIN') {
      bannerEl.innerHTML = `<strong>دیدگاه سوپرادمین (${user.name}):</strong> دسترسی کامل به تمامی بخش‌ها و گزارشات مالی سهم درآمد (۱۰٪ - ۱۵٪).`;
    }
  }

  // Desktop & Mobile Tabs Scoping
  const dAdmin = document.getElementById('d-tab-admin');
  const dAnalytics = document.getElementById('d-tab-analytics');
  const dMyBookings = document.getElementById('d-tab-my-bookings');

  const mAdmin = document.getElementById('m-tab-admin');
  const mAnalytics = document.getElementById('m-tab-analytics');
  const mMyBookings = document.getElementById('m-tab-my-bookings');

  if (user.role === 'CUSTOMER') {
    dAdmin?.classList.add('hidden');
    dAnalytics?.classList.add('hidden');
    dMyBookings?.classList.remove('hidden');

    mAdmin?.classList.add('hidden');
    mAnalytics?.classList.add('hidden');
    mMyBookings?.classList.remove('hidden');

    const activeTab = document.querySelector('.mobile-nav-item.active')?.dataset.tab;
    if (activeTab === 'admin' || activeTab === 'analytics') switchTab('booking');
  }

  if (user.role === 'COWORKING_OPERATOR' || user.role === 'CAFE_OPERATOR') {
    dAdmin?.classList.remove('hidden');
    dAnalytics?.classList.add('hidden');
    dMyBookings?.classList.add('hidden');

    mAdmin?.classList.remove('hidden');
    mAnalytics?.classList.add('hidden');
    mMyBookings?.classList.add('hidden');

    const adminTitle = document.getElementById('d-tab-admin-title');
    if (adminTitle) adminTitle.innerText = user.role === 'CAFE_OPERATOR' ? 'پنل سالن و کافه' : 'پنل فضای کار';

    document.getElementById('admin-catering-box')?.classList.toggle('hidden', user.role !== 'CAFE_OPERATOR');
    document.getElementById('admin-promo-box')?.classList.add('hidden');

    const activeTab = document.querySelector('.mobile-nav-item.active')?.dataset.tab;
    if (activeTab === 'analytics' || activeTab === 'my-bookings') switchTab('admin');
  }

  if (user.role === 'SUPER_ADMIN') {
    dAdmin?.classList.remove('hidden');
    dAnalytics?.classList.remove('hidden');
    dMyBookings?.classList.remove('hidden');

    mAdmin?.classList.remove('hidden');
    mAnalytics?.classList.remove('hidden');
    mMyBookings?.classList.remove('hidden');

    const adminTitle = document.getElementById('d-tab-admin-title');
    if (adminTitle) adminTitle.innerText = 'پنل مدیریت کل';

    document.getElementById('admin-catering-box')?.classList.remove('hidden');
    document.getElementById('admin-promo-box')?.classList.remove('hidden');
  }

  const nameInput = document.getElementById('cust-name');
  const phoneInput = document.getElementById('cust-phone');
  if (nameInput && user.role === 'CUSTOMER') nameInput.value = user.name;
  if (phoneInput && user.role === 'CUSTOMER') phoneInput.value = user.phone;

  const activeTab = document.querySelector('.mobile-nav-item.active')?.dataset.tab;
  if (activeTab === 'my-bookings') loadMyBookings();
  if (activeTab === 'admin') loadAdminData();
  if (activeTab === 'analytics') loadAnalyticsData();
}

// 4. Synchronized Navigation
function setupNavigation() {
  const desktopTabs = document.querySelectorAll('.nav-tab-btn');
  const mobileTabs = document.querySelectorAll('.mobile-nav-item');

  desktopTabs.forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.tab)));
  mobileTabs.forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.tab)));
}

function switchTab(tabId) {
  document.querySelectorAll('.nav-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tabId));
  document.querySelectorAll('.mobile-nav-item').forEach(b => b.classList.toggle('active', b.dataset.tab === tabId));
  document.querySelectorAll('.view-panel').forEach(v => v.classList.toggle('active', v.id === `tab-${tabId}`));

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (tabId === 'my-bookings') loadMyBookings();
  if (tabId === 'admin') loadAdminData();
  if (tabId === 'analytics') loadAnalyticsData();
}

// 5. Service Flow Switcher (Coworking vs Hall Separation - Big Papa's UX)
function setupServiceFlowSwitcher() {
  const btnCowork = document.getElementById('btn-flow-cowork');
  const btnHall = document.getElementById('btn-flow-hall');

  btnCowork?.addEventListener('click', () => {
    state.selectedFlow = 'COWORKING';
    btnCowork.classList.add('active');
    btnHall?.classList.remove('active');

    if (state.selectedSpaceKey === 'CONFERENCE_HALL') {
      state.selectedSpaceKey = 'SHARED_DESK';
    }

    const heading = document.getElementById('space-section-heading');
    const sub = document.getElementById('space-section-subheading');
    if (heading) heading.innerText = 'انتخاب صندلی یا اتاق کار اشتراکی';
    if (sub) sub.innerText = 'موجودی تکان: ۶۰ صندلی کار اشتراکی، ۴ اتاق اختصاصی و ۱ اتاق جلسه';

    renderSpacesCatalog();
    toggleHallFields();
    updatePriceBreakdown();
  });

  btnHall?.addEventListener('click', () => {
    state.selectedFlow = 'HALL';
    btnHall.classList.add('active');
    btnCowork?.classList.remove('active');

    state.selectedSpaceKey = 'CONFERENCE_HALL';

    const heading = document.getElementById('space-section-heading');
    const sub = document.getElementById('space-section-subheading');
    if (heading) heading.innerText = 'سالن همایش و رویدادهای تکـان';
    if (sub) sub.innerText = 'سالن مجهز ۷۰ نفره با استیج، ضبط استودیویی و تجهیزات حرفه‌ای صوت و تصویر';

    renderSpacesCatalog();
    toggleHallFields();
    updatePriceBreakdown();
  });
}

// 6. Fetch & Render Spaces
async function loadSpaces() {
  try {
    const data = await apiRequest('/api/spaces');
    state.spaces = data.spaces || [];
    renderSpacesCatalog();
  } catch (err) {
    showToast('خطا در دریافت لیست فضاها', 'error');
  }
}

function renderSpacesCatalog() {
  const container = document.getElementById('spaces-cards-grid');
  if (!container) return;

  let filteredSpaces = state.spaces;
  if (state.selectedFlow === 'COWORKING') {
    filteredSpaces = state.spaces.filter(s => s.key !== 'CONFERENCE_HALL');
  } else if (state.selectedFlow === 'HALL') {
    filteredSpaces = state.spaces.filter(s => s.key === 'CONFERENCE_HALL');
  }

  container.innerHTML = filteredSpaces.map(s => {
    const isSelected = s.key === state.selectedSpaceKey ? 'active' : '';
    const icon = SPACE_ICONS[s.key] || '🏢';
    const rateDisplay = state.rateViewMode === 'DAILY'
      ? `${formatCurrency(s.dailyRate)} <small>/ روز</small>`
      : `${formatCurrency(s.hourlyRate)} <small>/ ساعت</small>`;

    return `
      <div class="space-card ${isSelected}" data-key="${s.key}">
        <div class="space-card-top">
          <div class="space-icon-box">${icon}</div>
          <span class="capacity-tag">ظرفیت: ${toPersianDigits(s.capacity)} نفر</span>
        </div>
        <h4 class="space-name-title">${s.name}</h4>
        <div class="space-rate-price">${rateDisplay}</div>
        <div class="space-tags-row">
          ${(s.features || []).slice(0, 3).map(f => `<span class="spec-tag">${f}</span>`).join('')}
        </div>
        <button type="button" class="btn-select-space">
          <span>${isSelected ? 'انتخاب شده ✓' : 'انتخاب فضا'}</span>
        </button>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.space-card').forEach(card => {
    card.addEventListener('click', () => {
      state.selectedSpaceKey = card.dataset.key;
      renderSpacesCatalog();
      toggleHallFields();
      toggleDeskQuantity();
      updatePriceBreakdown();
    });
  });
}

function toggleHallFields() {
  const hallBox = document.getElementById('hall-extra-fields');
  if (!hallBox) return;
  hallBox.classList.toggle('hidden', state.selectedSpaceKey !== 'CONFERENCE_HALL');
}

function toggleDeskQuantity() {
  const deskBox = document.getElementById('desk-quantity-box');
  if (!deskBox) return;
  deskBox.classList.toggle('hidden', state.selectedSpaceKey !== 'SHARED_DESK');
}

function setupRateToggle() {
  const btnHourly = document.getElementById('rate-view-hourly');
  const btnDaily = document.getElementById('rate-view-daily');

  btnHourly?.addEventListener('click', () => {
    state.rateViewMode = 'HOURLY';
    btnHourly.classList.add('active');
    btnDaily?.classList.remove('active');
    renderSpacesCatalog();
  });

  btnDaily?.addEventListener('click', () => {
    state.rateViewMode = 'DAILY';
    btnDaily.classList.add('active');
    btnHourly?.classList.remove('active');
    renderSpacesCatalog();
  });

  // Desk stepper
  document.getElementById('btn-desk-minus')?.addEventListener('click', () => {
    state.deskCount = Math.max(1, state.deskCount - 1);
    document.getElementById('desk-count-display').innerText = toPersianDigits(state.deskCount);
    updatePriceBreakdown();
  });

  document.getElementById('btn-desk-plus')?.addEventListener('click', () => {
    state.deskCount = Math.min(60, state.deskCount + 1);
    document.getElementById('desk-count-display').innerText = toPersianDigits(state.deskCount);
    updatePriceBreakdown();
  });
}

// 7. Interactive Persian Jalali Calendar
function setupJalaliCalendar() {
  const matrix = document.getElementById('cal-days-matrix');
  if (!matrix) return;

  const daysInMonth = 31;
  const startDayOffset = 3; // Example offset for month view

  let daysHtml = '';
  for (let i = 0; i < startDayOffset; i++) {
    daysHtml += `<div class="cal-day-cell disabled-cell"></div>`;
  }

  const today = new Date();
  const currentDayNum = 28; // Default active demo day

  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = d === currentDayNum;
    const isPast = d < currentDayNum - 2;
    const classes = ['cal-day-cell'];
    if (isPast) classes.push('past-cell');
    if (isToday) classes.push('active-day-cell');

    daysHtml += `
      <div class="${classes.join(' ')}" data-day="${d}">
        <span class="day-num">${toPersianDigits(d)}</span>
      </div>
    `;
  }

  matrix.innerHTML = daysHtml;

  matrix.querySelectorAll('.cal-day-cell:not(.disabled-cell):not(.past-cell)').forEach(cell => {
    cell.addEventListener('click', () => {
      matrix.querySelectorAll('.cal-day-cell').forEach(c => c.classList.remove('active-day-cell'));
      cell.classList.add('active-day-cell');

      const dayNum = Number(cell.dataset.day);
      const formattedDateStr = `1405-05-${dayNum < 10 ? '0' + dayNum : dayNum}`;
      state.selectedCalendarDate = formattedDateStr;
      state.selectedCalendarLabel = `${toPersianDigits(dayNum)} مرداد ۱۴۰۵`;

      const labelEl = document.getElementById('selected-jalali-date-text');
      if (labelEl) labelEl.innerText = state.selectedCalendarLabel;

      const customInput = document.getElementById('custom-single-date');
      if (customInput) customInput.value = formattedDateStr;

      showToast(`تاریخ فعال: ${state.selectedCalendarLabel}`);
    });
  });
}

// 8. Smart Scheduling Engine (Daily Range/Custom & Hourly Multi-Slots - Reza Sr's UX)
function setupSchedulingEngine() {
  // Mode Switcher (Hourly vs Daily)
  const btnHourly = document.getElementById('btn-mode-hourly');
  const btnDaily = document.getElementById('btn-mode-daily');
  const hourlySection = document.getElementById('hourly-scheduler-section');
  const dailySection = document.getElementById('daily-scheduler-section');

  btnHourly?.addEventListener('click', () => {
    state.bookingType = 'HOURLY';
    btnHourly.classList.add('active');
    btnDaily?.classList.remove('active');
    hourlySection?.classList.remove('hidden');
    dailySection?.classList.add('hidden');
    updatePriceBreakdown();
  });

  btnDaily?.addEventListener('click', () => {
    state.bookingType = 'DAILY';
    btnDaily.classList.add('active');
    btnHourly?.classList.remove('active');
    dailySection?.classList.remove('hidden');
    hourlySection?.classList.add('hidden');
    updatePriceBreakdown();
  });

  // Populate Start and End Time Selects
  const startSelect = document.getElementById('time-start-select');
  const endSelect = document.getElementById('time-end-select');

  if (startSelect && endSelect) {
    const hours = [];
    for (let h = 8; h <= 23; h++) {
      const hStr = h < 10 ? `0${h}:00` : `${h}:00`;
      hours.push(hStr);
    }

    startSelect.innerHTML = hours.slice(0, -1).map(h => `<option value="${h}">${toPersianDigits(h)}</option>`).join('');
    endSelect.innerHTML = hours.slice(1).map(h => `<option value="${h}">${toPersianDigits(h)}</option>`).join('');

    startSelect.value = '13:00';
    endSelect.value = '18:00';
  }

  // Time Chips Logic
  const timeChips = document.querySelectorAll('.time-chip');
  const customTimeBox = document.getElementById('custom-time-selectors');
  timeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      timeChips.forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      
      const start = chip.dataset.start;
      const end = chip.dataset.end;
      
      if (start === 'custom') {
        customTimeBox.style.display = 'block';
      } else {
        customTimeBox.style.display = 'none';
        if (startSelect) startSelect.value = start;
        if (endSelect) endSelect.value = end;
      }
    });
  });

  // Add Time Slot to Basket
  const btnAddSlot = document.getElementById('btn-add-time-slot');
  btnAddSlot?.addEventListener('click', () => {
    const startTimeInput = document.getElementById('time-start-select')?.value || '13:00';
    const endTimeInput = document.getElementById('time-end-select')?.value || '18:00';
    const dateStr = state.selectedCalendarDate || new Date().toISOString().slice(0, 10);
    const dateLabel = state.selectedCalendarLabel || formatPersianDate(dateStr);

    const startH = Number(startTimeInput.split(':')[0]);
    const endH = Number(endTimeInput.split(':')[0]);

    if (endH <= startH) {
      showToast('ساعت پایان باید بعد از ساعت شروع باشد.', 'error');
      return;
    }

    const hours = endH - startH;
    const label = `${dateLabel} | ساعت ${toPersianDigits(startTimeInput)} الی ${toPersianDigits(endTimeInput)} (${toPersianDigits(hours)} ساعت)`;

    const startDT = new Date();
    startDT.setHours(startH, 0, 0, 0);
    const endDT = new Date();
    endDT.setHours(endH, 0, 0, 0);

    const slotObj = {
      id: `slot-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      date: dateStr,
      dateLabel,
      startTime: startDT.toISOString(),
      endTime: endDT.toISOString(),
      startTimeStr: startTimeInput,
      endTimeStr: endTimeInput,
      hours,
      label
    };

    state.hourlySlots.push(slotObj);
    renderSelectedSlots();
    updatePriceBreakdown();
    showToast(`بازه زمانی (${toPersianDigits(hours)} ساعت) به سبد اضافه شد.`);
  });

  // Daily Submode Switcher
  const rangeRadio = document.getElementById('daily-submode-range');
  const customRadio = document.getElementById('daily-submode-custom');
  const rangeBox = document.getElementById('daily-range-box');
  const customBox = document.getElementById('daily-custom-box');
  const lblRange = document.getElementById('lbl-range');
  const lblCustom = document.getElementById('lbl-custom');

  rangeRadio?.addEventListener('change', () => {
    if (rangeRadio.checked) {
      state.dailyMode = 'RANGE';
      rangeBox?.classList.remove('hidden');
      customBox?.classList.add('hidden');
      lblRange?.classList.add('active');
      lblCustom?.classList.remove('active');
      updatePriceBreakdown();
    }
  });

  customRadio?.addEventListener('change', () => {
    if (customRadio.checked) {
      state.dailyMode = 'CUSTOM';
      customBox?.classList.remove('hidden');
      rangeBox?.classList.add('hidden');
      lblCustom?.classList.add('active');
      lblRange?.classList.remove('active');
      updatePriceBreakdown();
    }
  });

  // Daily Range Inputs
  const startRangeInput = document.getElementById('daily-start-date');
  const endRangeInput = document.getElementById('daily-end-date');

  const onRangeChange = () => {
    state.dailyStartDate = startRangeInput?.value || '';
    state.dailyEndDate = endRangeInput?.value || '';
    if (state.dailyStartDate && state.dailyEndDate) {
      const s = new Date(state.dailyStartDate);
      const e = new Date(state.dailyEndDate);
      const diff = Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1;
      const days = Math.max(1, diff);
      const counterEl = document.getElementById('daily-range-days-count');
      if (counterEl) counterEl.innerText = `${toPersianDigits(days)} روز`;
    }
    updatePriceBreakdown();
  };

  startRangeInput?.addEventListener('change', onRangeChange);
  endRangeInput?.addEventListener('change', onRangeChange);

  // Custom Days Adder
  const btnAddCustomDate = document.getElementById('btn-add-custom-date');
  btnAddCustomDate?.addEventListener('click', () => {
    const singleDateInput = document.getElementById('custom-single-date');
    const val = singleDateInput?.value;
    if (!val) {
      showToast('لطفاً یک تاریخ از تقویم انتخاب کنید.', 'error');
      return;
    }
    if (state.customDailyDates.includes(val)) {
      showToast('این تاریخ قبلاً به لیست اضافه شده است.', 'error');
      return;
    }

    state.customDailyDates.push(val);
    state.customDailyDates.sort();
    renderCustomDateChips();
    updatePriceBreakdown();
    showToast(`روز ${formatPersianDate(val)} به لیست افزوده شد.`);
  });
}

// Preset button handler
window.setSlotPreset = function(start, end) {
  const startEl = document.getElementById('time-start-select');
  const endEl = document.getElementById('time-end-select');
  if (startEl) startEl.value = start;
  if (endEl) endEl.value = end;
  showToast(`بازه زمانی روی ${toPersianDigits(start)} تا ${toPersianDigits(end)} تنظیم شد.`);
};

// Render Selected Hourly Slots List
function renderSelectedSlots() {
  const container = document.getElementById('selected-slots-list');
  const totalBadge = document.getElementById('slots-total-badge');
  if (!container) return;

  const totalHours = state.hourlySlots.reduce((sum, s) => sum + s.hours, 0);
  if (totalBadge) totalBadge.innerText = `${toPersianDigits(totalHours)} ساعت (${toPersianDigits(state.hourlySlots.length)} بازه)`;

  if (state.hourlySlots.length === 0) {
    container.innerHTML = `<div class="empty-slot-msg">هنوز هیچ بازه ساعتی اضافه نشده است. لطفاً تاریخ و ساعت را انتخاب کرده و دکمه «افزودن این بازه» را بزنید.</div>`;
    return;
  }

  container.innerHTML = state.hourlySlots.map(s => `
    <div class="selected-slot-item">
      <div class="slot-item-info">
        <span class="slot-item-date">📅 ${s.dateLabel || formatPersianDate(s.date)}</span>
        <span class="slot-item-time">⏰ ${toPersianDigits(s.startTimeStr)} الی ${toPersianDigits(s.endTimeStr)}</span>
        <span class="slot-item-hours">${toPersianDigits(s.hours)} ساعت</span>
      </div>
      <button type="button" class="btn-delete-slot" onclick="removeHourlySlot('${s.id}')" title="حذف این بازه">🗑️</button>
    </div>
  `).join('');
}

window.removeHourlySlot = function(slotId) {
  state.hourlySlots = state.hourlySlots.filter(s => s.id !== slotId);
  renderSelectedSlots();
  updatePriceBreakdown();
};

// Render Custom Daily Date Chips
function renderCustomDateChips() {
  const container = document.getElementById('custom-dates-chips');
  const badge = document.getElementById('custom-days-badge');
  if (!container) return;

  if (badge) badge.innerText = `${toPersianDigits(state.customDailyDates.length)} روز`;

  if (state.customDailyDates.length === 0) {
    container.innerHTML = `<span class="empty-slot-msg">هنوز روزی اضافه نشده است.</span>`;
    return;
  }

  container.innerHTML = state.customDailyDates.map(d => `
    <div class="date-chip">
      <span>📅 ${formatPersianDate(d)}</span>
      <button type="button" class="date-chip-delete" onclick="removeCustomDate('${d}')" title="حذف">✕</button>
    </div>
  `).join('');
}

window.removeCustomDate = function(dateStr) {
  state.customDailyDates = state.customDailyDates.filter(d => d !== dateStr);
  renderCustomDateChips();
  updatePriceBreakdown();
};

// 9. Collapsible Catering Section & Filters
function setupCateringAddonToggle() {
  const header = document.getElementById('catering-toggle-header');
  const body = document.getElementById('catering-booking-body');
  const icon = document.getElementById('catering-toggle-icon');

  header?.addEventListener('click', () => {
    state.cateringAddonOpen = !state.cateringAddonOpen;
    if (state.cateringAddonOpen) {
      body?.classList.remove('hidden');
      icon?.classList.remove('rotated');
    } else {
      body?.classList.add('hidden');
      icon?.classList.add('rotated');
    }
  });
}

async function loadCateringMenu() {
  try {
    const data = await apiRequest('/api/catering/menu');
    state.cateringMenu = data.menu || [];
    renderCateringBookingSelector();
    renderCateringCatalogGrid();
    setupCateringFilters();
  } catch (err) {
    showToast('خطا در دریافت منوی پذیرایی', 'error');
  }
}

function setupCateringFilters() {
  const filterBtns = document.querySelectorAll('.filter-pill-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.selectedCategoryFilter = btn.dataset.filter;
      renderCateringCatalogGrid();
    });
  });
}

function renderCateringBookingSelector() {
  const container = document.getElementById('catering-booking-list');
  if (!container) return;

  container.innerHTML = state.cateringMenu.map(item => {
    const qty = state.cateringOrders[item.id] || 0;
    const cat = CATEGORY_META[item.category] || { icon: '☕', label: item.category };
    return `
      <div class="catering-select-card">
        <div class="cat-card-info">
          <strong>${cat.icon} ${item.name}</strong>
          <span>قیمت واحد: ${formatCurrency(item.price)}</span>
        </div>
        <div class="cat-stepper">
          <button type="button" class="btn-step" onclick="changeCateringQty('${item.id}', -1)">−</button>
          <span class="step-value" id="qty-${item.id}">${toPersianDigits(qty)}</span>
          <button type="button" class="btn-step" onclick="changeCateringQty('${item.id}', 1)">+</button>
        </div>
      </div>
    `;
  }).join('');
}

window.changeCateringQty = function(itemId, delta) {
  const current = state.cateringOrders[itemId] || 0;
  const next = Math.max(0, current + delta);
  if (next === 0) {
    delete state.cateringOrders[itemId];
  } else {
    state.cateringOrders[itemId] = next;
  }
  const qtyEl = document.getElementById(`qty-${itemId}`);
  if (qtyEl) qtyEl.innerText = toPersianDigits(next);
  updatePriceBreakdown();
};

function renderCateringCatalogGrid() {
  const container = document.getElementById('catering-catalog-grid');
  if (!container) return;

  const filtered = state.selectedCategoryFilter === 'ALL'
    ? state.cateringMenu
    : state.cateringMenu.filter(i => i.category === state.selectedCategoryFilter);

  container.innerHTML = filtered.map(item => {
    const cat = CATEGORY_META[item.category] || { icon: '☕', label: item.category };
    return `
      <div class="cat-item-card">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <h4>${cat.icon} ${item.name}</h4>
            <span class="capacity-tag">${cat.label}</span>
          </div>
          <div class="cat-price-row">${formatCurrency(item.price)}</div>
        </div>
        <button type="button" class="btn-select-space" onclick="addCateringFromCatalog('${item.id}')">
          ➕ افزودن به سفارش جاری
        </button>
      </div>
    `;
  }).join('');
}

window.addCateringFromCatalog = function(itemId) {
  window.changeCateringQty(itemId, 1);
  switchTab('booking');
  showToast('آیتم به سفارش جاری اضافه شد.');
};

// 10. Live Pricing Calculation Engine
function updatePriceBreakdown() {
  const space = state.spaces.find(s => s.key === state.selectedSpaceKey);
  const bookingType = state.bookingType;
  const units = state.selectedSpaceKey === 'SHARED_DESK' ? state.deskCount : 1;

  let duration = 1;
  let scheduleSummaryText = '';

  if (bookingType === 'HOURLY') {
    const totalHours = state.hourlySlots.reduce((sum, s) => sum + s.hours, 0);
    duration = totalHours > 0 ? totalHours : 2;
    scheduleSummaryText = totalHours > 0
      ? `${toPersianDigits(totalHours)} ساعت (${toPersianDigits(state.hourlySlots.length)} بازه زمانی)`
      : `تنظیم بازه‌های ساعتی`;
  } else {
    // DAILY
    if (state.dailyMode === 'RANGE') {
      const s = state.dailyStartDate ? new Date(state.dailyStartDate) : null;
      const e = state.dailyEndDate ? new Date(state.dailyEndDate) : null;
      if (s && e && !isNaN(s) && !isNaN(e)) {
        const diff = Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1;
        duration = Math.max(1, diff);
        scheduleSummaryText = `${toPersianDigits(duration)} روز پیوسته (${formatPersianDate(state.dailyStartDate)} تا ${formatPersianDate(state.dailyEndDate)})`;
      } else {
        duration = 1;
        scheduleSummaryText = `۱ روز پیوسته`;
      }
    } else {
      // CUSTOM DAYS
      duration = Math.max(1, state.customDailyDates.length);
      scheduleSummaryText = state.customDailyDates.length > 0
        ? `${toPersianDigits(state.customDailyDates.length)} روز انتخابی`
        : `انتخاب روزهای دلخواه`;
    }
  }

  // Space Base Calculation
  let spaceSubtotal = 0;
  if (space) {
    const rate = bookingType === 'DAILY' ? space.dailyRate : space.hourlyRate;
    spaceSubtotal = rate * duration * units;
  }

  // Equipment Fees
  let equipFee = 0;
  if (state.selectedSpaceKey === 'CONFERENCE_HALL') {
    if (document.getElementById('equip-recording')?.checked) equipFee += 300000;
    if (document.getElementById('equip-sound')?.checked) equipFee += 200000;
  }

  // Catering Subtotal
  let cateringSubtotal = 0;
  for (const [itemId, count] of Object.entries(state.cateringOrders)) {
    const item = state.cateringMenu.find(i => i.id === itemId);
    if (item && count > 0) {
      cateringSubtotal += item.price * count;
    }
  }

  const subtotal = spaceSubtotal + equipFee + cateringSubtotal;

  // Promo Code Calculation
  let discountAmount = 0;
  if (state.appliedPromo && state.appliedPromo.valid) {
    if (state.appliedPromo.discountType === 'PERCENTAGE') {
      discountAmount = (subtotal * state.appliedPromo.discountValue) / 100;
      if (state.appliedPromo.maxDiscount && discountAmount > state.appliedPromo.maxDiscount) {
        discountAmount = state.appliedPromo.maxDiscount;
      }
    } else {
      discountAmount = Math.min(state.appliedPromo.discountValue, subtotal);
    }
  }

  const finalTotal = Math.max(0, subtotal - discountAmount);

  // Update DOM elements
  const summarySpaceName = document.getElementById('summary-space-name');
  if (summarySpaceName && space) {
    summarySpaceName.innerText = `رزرو ${space.name} ${units > 1 ? `(${toPersianDigits(units)} صندلی)` : ''} (${scheduleSummaryText}):`;
  }

  const spaceFeeEl = document.getElementById('summary-space-fee');
  const equipFeeEl = document.getElementById('summary-equip-fee');
  const cateringFeeEl = document.getElementById('summary-catering-fee');
  const totalEl = document.getElementById('summary-final-total');
  const mobileTotalEl = document.getElementById('mobile-bottom-total-price');

  if (spaceFeeEl) spaceFeeEl.innerText = formatCurrency(spaceSubtotal);
  if (equipFeeEl) equipFeeEl.innerText = formatCurrency(equipFee);
  if (cateringFeeEl) cateringFeeEl.innerText = formatCurrency(cateringSubtotal);
  if (totalEl) totalEl.innerText = formatCurrency(finalTotal);
  if (mobileTotalEl) mobileTotalEl.innerText = formatCurrency(finalTotal);
  
  const discRow = document.getElementById('summary-discount-row');
  if (discountAmount > 0) {
    discRow?.classList.remove('hidden');
    const discAmtEl = document.getElementById('summary-discount-amount');
    if (discAmtEl) discAmtEl.innerText = `- ${formatCurrency(discountAmount)}`;
  } else {
    discRow?.classList.add('hidden');
  }
}

// 11. Promo Engine
function setupPromoEngine() {
  const btnApply = document.getElementById('btn-apply-promo');
  const promoInput = document.getElementById('promo-input');
  const feedback = document.getElementById('promo-feedback');

  btnApply?.addEventListener('click', async () => {
    const code = promoInput.value.trim();
    if (!code) {
      feedback.innerText = 'لطفاً کد تخفیف را وارد کنید.';
      feedback.className = 'promo-feedback-msg text-danger';
      return;
    }

    try {
      const space = state.spaces.find(s => s.key === state.selectedSpaceKey);
      const baseRate = state.bookingType === 'DAILY' ? (space?.dailyRate || 0) : (space?.hourlyRate || 0);
      let duration = 1;
      if (state.bookingType === 'HOURLY') {
        duration = state.hourlySlots.reduce((sum, s) => sum + s.hours, 0) || 1;
      } else if (state.dailyMode === 'CUSTOM') {
        duration = Math.max(1, state.customDailyDates.length);
      }
      
      const units = state.selectedSpaceKey === 'SHARED_DESK' ? state.deskCount : 1;
      let subtotal = baseRate * duration * units;
      for (const [itemId, count] of Object.entries(state.cateringOrders)) {
        const item = state.cateringMenu.find(i => i.id === itemId);
        if (item) subtotal += item.price * count;
      }

      const result = await apiRequest('/api/promo/validate', 'POST', {
        code,
        subtotal,
        spaceKey: state.selectedSpaceKey
      });

      if (result.valid) {
        state.appliedPromo = result;
        feedback.innerText = `✅ کد تخفیف "${code}" با مبلغ ${formatCurrency(result.discountAmount)} اعمال شد.`;
        feedback.className = 'promo-feedback-msg text-emerald';
        updatePriceBreakdown();
      } else {
        state.appliedPromo = null;
        feedback.innerText = `❌ ${result.reason || 'کد تخفیف نامعتبر است'}`;
        feedback.className = 'promo-feedback-msg text-danger';
        updatePriceBreakdown();
      }
    } catch (err) {
      state.appliedPromo = null;
      feedback.innerText = `❌ ${err.message}`;
      feedback.className = 'promo-feedback-msg text-danger';
      updatePriceBreakdown();
    }
  });
}

// 12. Booking Submission & Detailed Receipt Modal
function setupBookingSubmission() {
  const submitBtn = document.getElementById('btn-submit-booking');
  const mobileSubmitBtn = document.getElementById('btn-mobile-checkout-action');

  const handleSubmit = async () => {
    const custName = document.getElementById('cust-name')?.value.trim();
    const custPhone = document.getElementById('cust-phone')?.value.trim();
    const custEmail = document.getElementById('cust-email')?.value.trim();
    const bookingType = state.bookingType;

    if (!custName || !custPhone) {
      showToast('لطفاً نام و شماره همراه متقاضی را وارد کنید.', 'error');
      return;
    }

    let payload = {
      spaceKey: state.selectedSpaceKey,
      bookingType,
      customerName: custName,
      customerPhone: custPhone,
      customerEmail: custEmail,
      eventTopic: document.getElementById('event-topic')?.value.trim() || undefined,
      targetAudienceCount: Number(document.getElementById('audience-count')?.value) || undefined,
      equipment: [],
      cateringOrders: Object.entries(state.cateringOrders).map(([itemId, quantity]) => ({ itemId, quantity })),
      promoCode: state.appliedPromo?.code
    };

    if (document.getElementById('equip-recording')?.checked) payload.equipment.push('recording');
    if (document.getElementById('equip-sound')?.checked) payload.equipment.push('sound_system');

    // Build Scheduling parameters
    if (bookingType === 'HOURLY') {
      if (state.hourlySlots.length === 0) {
        showToast('لطفاً حداقل یک بازه زمانی ساعتی به سبد اضافه کنید.', 'error');
        return;
      }
      payload.timeSlots = state.hourlySlots;
      payload.duration = state.hourlySlots.reduce((sum, s) => sum + s.hours, 0);
      payload.startTime = state.hourlySlots[0].startTime;
      payload.endTime = state.hourlySlots[state.hourlySlots.length - 1].endTime;
    } else {
      // DAILY
      if (state.dailyMode === 'RANGE') {
        if (!state.dailyStartDate || !state.dailyEndDate) {
          showToast('لطفاً تاریخ شروع و پایان بازه روزانه را مشخص فرمایید.', 'error');
          return;
        }
        const s = new Date(state.dailyStartDate);
        const e = new Date(state.dailyEndDate);
        if (e < s) {
          showToast('تاریخ پایان بازه نمی‌تواند قبل از تاریخ شروع باشد.', 'error');
          return;
        }
        const days = Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1;
        payload.dailySchedule = {
          mode: 'RANGE',
          startDate: state.dailyStartDate,
          endDate: state.dailyEndDate,
          daysCount: days
        };
        payload.duration = days;
        payload.startTime = `${state.dailyStartDate}T08:00:00.000Z`;
        payload.endTime = `${state.dailyEndDate}T22:00:00.000Z`;
      } else {
        // CUSTOM DAYS
        if (state.customDailyDates.length === 0) {
          showToast('لطفاً حداقل یک روز دلخواه به لیست روزانه اضافه فرمایید.', 'error');
          return;
        }
        payload.dailySchedule = {
          mode: 'CUSTOM_DAYS',
          dates: state.customDailyDates,
          daysCount: state.customDailyDates.length
        };
        payload.duration = state.customDailyDates.length;
        payload.startTime = `${state.customDailyDates[0]}T08:00:00.000Z`;
        payload.endTime = `${state.customDailyDates[state.customDailyDates.length - 1]}T22:00:00.000Z`;
      }
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>⏳ در حال بررسی تداخل و ثبت سفارش...</span>';
    }

    try {
      const response = await apiRequest('/api/reservations', 'POST', payload);
      showToast('رزرو شما با موفقیت ثبت گردید!');
      displayInvoiceModal(response.invoice, response.reservation);
      state.cateringOrders = {};
      state.appliedPromo = null;
      renderCateringBookingSelector();
      updatePriceBreakdown();
    } catch (err) {
      showToast(`خطا در ثبت رزرو: ${err.message}`, 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>💳</span><span>ثبت نهایی و صدور فاکتور رسمی</span>';
      }
    }
  };

  submitBtn?.addEventListener('click', handleSubmit);
  mobileSubmitBtn?.addEventListener('click', handleSubmit);
}

function displayInvoiceModal(invoice, reservation) {
  const modal = document.getElementById('invoice-modal');
  const content = document.getElementById('invoice-content');

  // Format schedule slots
  let scheduleDetailsHtml = '';
  if (reservation.timeSlots && reservation.timeSlots.length > 0) {
    scheduleDetailsHtml = `
      <div style="background:var(--bg-surface-elevated); padding:0.65rem 0.85rem; border-radius:var(--radius-xs); margin:0.65rem 0; border:1px solid var(--border-subtle);">
        <strong style="display:block; margin-bottom:0.35rem; font-size:0.84rem;">⏰ بازه‌های زمانی رزرو شده:</strong>
        <ul style="padding-right:1.2rem; font-size:0.8rem; line-height:1.7;">
          ${reservation.timeSlots.map(s => `<li>${s.dateLabel || formatPersianDate(s.date)} | ساعت ${toPersianDigits(s.startTimeStr || 'ساعت رزرو')} (${toPersianDigits(s.hours)} ساعت)</li>`).join('')}
        </ul>
      </div>
    `;
  } else if (reservation.dailySchedule?.dates) {
    scheduleDetailsHtml = `
      <div style="background:var(--bg-surface-elevated); padding:0.65rem 0.85rem; border-radius:var(--radius-xs); margin:0.65rem 0; border:1px solid var(--border-subtle);">
        <strong style="display:block; margin-bottom:0.35rem; font-size:0.84rem;">📅 روزهای انتخابی رزرو شده:</strong>
        <div style="display:flex; flex-wrap:wrap; gap:0.35rem; margin-top:0.35rem;">
          ${reservation.dailySchedule.dates.map(d => `<span class="date-chip">📅 ${formatPersianDate(d)}</span>`).join('')}
        </div>
      </div>
    `;
  }

  content.innerHTML = `
    <div class="receipt-box-styled">
      <div class="receipt-row-meta">
        <div><strong>شماره فاکتور:</strong> <code>${invoice.invoiceNumber}</code></div>
        <div><strong>شماره رزرو:</strong> <code>${invoice.reservationId}</code></div>
      </div>
      <div class="receipt-row-meta">
        <div><strong>نام متقاضی:</strong> ${invoice.customer.name}</div>
        <div><strong>شماره همراه:</strong> ${invoice.customer.phone}</div>
      </div>
      <div class="receipt-row-meta">
        <div><strong>وضعیت فاکتور:</strong> 
          <span class="badge ${reservation.status === 'CONFIRMED' ? 'badge-success' : 'badge-warning'}">
            ${reservation.status === 'CONFIRMED' ? 'تأیید شده' : 'در انتظار تایید اپراتور سالن'}
          </span>
        </div>
      </div>

      ${scheduleDetailsHtml}

      <table class="receipt-items-table">
        <thead>
          <tr>
            <th>شرح خدمات و فضا</th>
            <th>مبلغ</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.items.map(it => `
            <tr>
              <td>${it.title}</td>
              <td>${formatCurrency(it.amount)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="summary-line" style="display:flex; justify-content:space-between; margin-top:0.65rem;">
        <span>جمع کل ناخالص:</span>
        <strong>${formatCurrency(invoice.subtotal)}</strong>
      </div>
      ${invoice.discountAmount > 0 ? `
        <div class="summary-line text-emerald" style="display:flex; justify-content:space-between;">
          <span>تخفیف کسر شده:</span>
          <strong>- ${formatCurrency(invoice.discountAmount)}</strong>
        </div>
      ` : ''}
      <div class="invoice-divider-line"></div>
      <div class="invoice-total-row" style="display:flex; justify-content:space-between; margin-top:0.5rem;">
        <span class="total-label">مبلغ نهایی پرداخت شده:</span>
        <strong class="final-total-amount" style="font-size:1.15rem;">${formatCurrency(invoice.finalTotal)}</strong>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  document.getElementById('btn-close-invoice').onclick = () => modal.classList.add('hidden');
  document.getElementById('btn-done-invoice').onclick = () => modal.classList.add('hidden');
}

// 13. Customer: My Bookings
async function loadMyBookings() {
  const tbody = document.getElementById('my-reservations-tbody');
  if (!tbody) return;

  try {
    const phone = state.currentUser.phone;
    const data = await apiRequest(`/api/my-reservations?phone=${phone}`);
    const list = data.reservations || [];

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:1.5rem; color:var(--text-dim);">شما در حال حاضر رزروی ثبت نکرده‌اید.</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(r => {
      const scheduleLabel = r.scheduleDescription || `${toPersianDigits(r.duration)} ${r.bookingType === 'DAILY' ? 'روز' : 'ساعت'}`;
      return `
        <tr>
          <td><strong>${r.id}</strong></td>
          <td>${r.spaceName}</td>
          <td>${scheduleLabel}</td>
          <td><strong>${formatCurrency(r.pricing?.finalTotal)}</strong></td>
          <td>
            <span class="badge ${r.status === 'CONFIRMED' ? 'badge-success' : (r.status === 'PENDING_REVIEW' ? 'badge-warning' : 'badge-danger')}">
              ${r.status === 'PENDING_REVIEW' ? 'در انتظار بررسی' : (r.status === 'CONFIRMED' ? 'تأیید شده' : r.status)}
            </span>
          </td>
          <td>
            <button class="btn-sm-action" onclick="viewExistingInvoice('${r.id}')">🧾 مشاهده رسید</button>
          </td>
        </tr>
      `;
    }).join('');
  } catch (err) {
    showToast(err.message, 'error');
  }
}

window.viewExistingInvoice = async function(reservationId) {
  try {
    const data = await apiRequest(`/api/my-reservations`);
    const r = (data.reservations || []).find(x => x.id === reservationId);
    if (r) {
      displayInvoiceModal({
        invoiceNumber: r.invoiceNumber,
        reservationId: r.id,
        customer: r.customer,
        items: [
          { title: `رزرو ${r.spaceName} (${r.scheduleDescription || ''})`, amount: r.pricing.spaceSubtotal },
          ...r.equipment.map(e => ({ title: e.name, amount: e.fee })),
          ...r.catering.map(c => ({ title: `${c.name} (${toPersianDigits(c.quantity)} عدد)`, amount: c.subtotal }))
        ],
        subtotal: r.pricing.subtotal,
        discountAmount: r.pricing.discountAmount,
        finalTotal: r.pricing.finalTotal
      }, r);
    }
  } catch (err) {
    showToast(err.message, 'error');
  }
};

// 14. Admin & Operator Panel
async function loadAdminData() {
  try {
    const data = await apiRequest('/api/admin/reservations');
    state.reservations = data.reservations || [];
    renderReservationsTable();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function renderReservationsTable() {
  const tbody = document.getElementById('reservations-tbody');
  if (!tbody) return;

  if (state.reservations.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:1.5rem; color:var(--text-dim);">هنوز رزروی در این بخش ثبت نشده است.</td></tr>`;
    return;
  }

  const role = state.currentUser.role;

  tbody.innerHTML = state.reservations.map(r => {
    const isHall = r.spaceKey === 'CONFERENCE_HALL';
    const isPending = r.status === 'PENDING_REVIEW';
    const canApprove = (role === 'SUPER_ADMIN' || role === 'CAFE_OPERATOR') && isPending && isHall;
    const scheduleLabel = r.scheduleDescription || `${toPersianDigits(r.duration)} ${r.bookingType === 'DAILY' ? 'روز' : 'ساعت'}`;

    return `
      <tr>
        <td><strong>${r.id}</strong></td>
        <td>${r.spaceName}</td>
        <td>${r.customer.name}<br><small>${r.customer.phone}</small></td>
        <td>${isHall ? (r.eventDetails?.topic || 'همایش') : scheduleLabel}</td>
        <td><strong>${formatCurrency(r.pricing?.finalTotal)}</strong></td>
        <td>
          <span class="badge ${r.status === 'CONFIRMED' ? 'badge-success' : (r.status === 'PENDING_REVIEW' ? 'badge-warning' : 'badge-danger')}">
            ${r.status === 'PENDING_REVIEW' ? 'در انتظار تأیید' : (r.status === 'CONFIRMED' ? 'تأیید شده' : r.status)}
          </span>
        </td>
        <td>
          ${canApprove ? `
            <button class="btn-sm-action" style="color:var(--emerald);" onclick="approveReservation('${r.id}')">تأیید رویداد</button>
          ` : ''}
          ${r.status !== 'CANCELLED' ? `
            <button class="btn-sm-action" style="color:var(--rose);" onclick="cancelReservation('${r.id}')">لغو</button>
          ` : ''}
        </td>
      </tr>
    `;
  }).join('');
}

window.approveReservation = async function(id) {
  try {
    await apiRequest(`/api/admin/reservations/${id}/approve`, 'POST');
    showToast(`رویداد سالن همایش (${id}) با موفقیت تأیید شد.`);
    loadAdminData();
  } catch (err) {
    showToast(err.message, 'error');
  }
};

window.cancelReservation = async function(id) {
  const reason = prompt('لطفاً دلیل لغو رزرو را وارد کنید:');
  if (reason === null) return;
  try {
    await apiRequest(`/api/admin/reservations/${id}/cancel`, 'POST', { reason });
    showToast(`رزرو ${id} لغو گردید.`);
    loadAdminData();
  } catch (err) {
    showToast(err.message, 'error');
  }
};

function setupAdminForms() {
  document.getElementById('btn-refresh-reservations')?.addEventListener('click', loadAdminData);

  document.getElementById('form-add-catering')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('new-cat-name').value.trim();
    const category = document.getElementById('new-cat-cat').value;
    const price = Number(document.getElementById('new-cat-price').value);

    try {
      await apiRequest('/api/admin/catering/items', 'POST', { name, category, price });
      showToast('آیتم جدید با موفقیت به منوی کافه اضافه شد.');
      e.target.reset();
      loadCateringMenu();
    } catch (err) {
      showToast(err.message, 'error');
    }
  });

  document.getElementById('form-add-promo')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const code = document.getElementById('new-promo-code').value.trim();
    const type = document.getElementById('new-promo-type').value;
    const value = Number(document.getElementById('new-promo-val').value);
    const maxDiscount = Number(document.getElementById('new-promo-max').value) || undefined;

    try {
      await apiRequest('/api/admin/promos', 'POST', { code, type, value, maxDiscount });
      showToast(`کد تخفیف ${code} ایجاد شد.`);
      e.target.reset();
    } catch (err) {
      showToast(err.message, 'error');
    }
  });
}

// 15. Financial Analytics & Revenue Share (Super Admin)
async function loadAnalyticsData() {
  try {
    const data = await apiRequest('/api/admin/analytics');
    const f = data.financials || {};
    const rev = data.revenueShare || {};

    const totalRevEl = document.getElementById('metric-total-rev');
    const contractorShareEl = document.getElementById('metric-contractor-share');
    const cateringRevEl = document.getElementById('metric-catering-rev');
    const discountsEl = document.getElementById('metric-discounts');

    if (totalRevEl) totalRevEl.innerText = formatCurrency(f.totalRevenue);
    if (contractorShareEl) contractorShareEl.innerText = `${formatCurrency(rev.contractorShare10)} الی ${formatCurrency(rev.contractorShare15)}`;
    if (cateringRevEl) cateringRevEl.innerText = formatCurrency(f.cateringRevenue);
    if (discountsEl) discountsEl.innerText = formatCurrency(f.totalDiscountsGiven);

    const breakdownEl = document.getElementById('space-revenue-breakdown');
    if (breakdownEl && f.breakdownBySpace) {
      breakdownEl.innerHTML = Object.entries(f.breakdownBySpace).map(([key, item]) => {
        const space = state.spaces.find(s => s.key === key);
        return `
          <div class="breakdown-row-item">
            <span><strong>${space?.name || key}</strong> (${toPersianDigits(item.count)} رزرو)</span>
            <strong>${formatCurrency(item.revenue)}</strong>
          </div>
        `;
      }).join('');
    }

    const auditEl = document.getElementById('audit-log-list');
    if (auditEl && data.auditLogs) {
      auditEl.innerHTML = data.auditLogs.map(log => `
        <div class="audit-item">
          <div><strong>عملیات:</strong> ${log.action} | <strong>منبع:</strong> ${log.resource}</div>
          <div><small>توسط: ${log.userId} در ${new Date(log.timestamp).toLocaleTimeString('fa-IR')}</small></div>
        </div>
      `).join('');
    }

  } catch (err) {
    showToast(err.message, 'error');
  }
}

// Bootstrap
document.addEventListener('DOMContentLoaded', async () => {
  setupThemeEngine();
  setupAuthSystem();
  setupNavigation();
  setupServiceFlowSwitcher();
  setupRateToggle();
  setupJalaliCalendar();
  setupSchedulingEngine();
  setupCateringAddonToggle();

  await loadSpaces();
  await loadCateringMenu();

  // Add initial smart default slot (13:00 to 18:00 on today)
  state.hourlySlots = [
    {
      id: `slot-default-1`,
      date: state.selectedCalendarDate,
      dateLabel: '۲۸ مرداد ۱۴۰۵',
      startTime: new Date(`${new Date().toISOString().slice(0, 10)}T13:00:00`).toISOString(),
      endTime: new Date(`${new Date().toISOString().slice(0, 10)}T18:00:00`).toISOString(),
      startTimeStr: '13:00',
      endTimeStr: '18:00',
      hours: 5,
      label: `۲۸ مرداد ۱۴۰۵ | ساعت ۱۳:۰۰ الی ۱۸:۰۰ (۵ ساعت)`
    }
  ];
  renderSelectedSlots();

  setupPromoEngine();
  setupBookingSubmission();
  setupAdminForms();
  toggleHallFields();
  toggleDeskQuantity();
  updatePriceBreakdown();

  document.getElementById('equip-recording')?.addEventListener('change', updatePriceBreakdown);
  document.getElementById('equip-sound')?.addEventListener('change', updatePriceBreakdown);
});
