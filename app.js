/**
 * TechOn Platform - Mobile-First Client Application
 * Features: PersianLabs UI Jalali Calendar, App-style Bottom Navigation,
 * Touch-optimized Steppers, Real-time Pricing & Invoicing.
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
    desc: 'رزرواسیون فضا، منوی کافه و پیگیری فاکتورها'
  },
  {
    id: 'user-cowork',
    username: 'cowork_op',
    password: 'cowork123',
    name: 'علی کاظمی',
    phone: '09122222222',
    role: 'COWORKING_OPERATOR',
    title: 'اپراتور کار اشتراکی',
    avatar: '🏢',
    desc: 'مدیریت صندلی‌ها و ثبت دستی مراجعین'
  },
  {
    id: 'user-cafe',
    username: 'cafe_op',
    password: 'cafe123',
    name: 'سارا تهرانی',
    phone: '09123333333',
    role: 'CAFE_OPERATOR',
    title: 'اپراتور سالن و کافه',
    avatar: '☕',
    desc: 'تأیید رویدادهای همایش و مدیریت منوی کافه'
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
    desc: 'دسترسی نامحدود به تمامی بخش‌ها و گزارشات مالی سهم ۱۰-۱۵٪'
  }
];

const SPACE_VISUALS = {
  CONFERENCE_HALL: { icon: '🏛️', tag: 'سالن همایش و رویداد', desc: 'ظرفیت ۷۰ نفر با استیج و سیستم صوتی' },
  PRIVATE_OFFICE: { icon: '💼', tag: 'اتاق اختصاصی تیم', desc: 'تیم‌های ۴ الی ۶ نفره با میز کنفرانس' },
  DEDICATED_DESK: { icon: '🪑', tag: 'صندلی اختصاصی', desc: 'رزرو ماهانه و روزانه با کمد کلیددار' },
  SHARED_DESK: { icon: '💻', tag: 'صندلی اشتراکی', desc: 'فضای عمومی پر انرژی با اینترنت پرسرعت' }
};

const CATEGORY_META = {
  PACKAGE: { label: 'پکیج تشریفات', icon: '🎁' },
  BEVERAGE_HOT: { label: 'نوشیدنی گرم', icon: '☕' },
  BEVERAGE_COLD: { label: 'نوشیدنی سرد', icon: '🧃' },
  SNACK: { label: 'اسنک و فینگرفود', icon: '🥐' },
  MEAL: { label: 'میان‌وعده ویژه', icon: '🥪' }
};

const PERSIAN_MONTH_NAMES = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

const PERSIAN_WEEKDAY_NAMES = [
  'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'
];

const FALLBACK_SPACES = [
  {
    key: 'CONFERENCE_HALL',
    id: 'hall-main',
    name: 'سالن همایش و رویداد تکان',
    capacity: 70,
    hourlyRate: 1500000,
    dailyRate: 10000000,
    features: ['پروژکتور 4K', 'سیستم صوتی استودیویی', 'استیج و تریبون', 'نورپردازی تخصصی', 'اینترنت فیبر نوری']
  },
  {
    key: 'PRIVATE_OFFICE',
    id: 'office-private',
    name: 'اتاق کار اختصاصی تیم ۴-۶ نفره',
    capacity: 6,
    hourlyRate: 350000,
    dailyRate: 2400000,
    features: ['تخته وایت‌برد', 'میز کنفرانس کوچک', 'کمد اختصاصی']
  },
  {
    key: 'DEDICATED_DESK',
    id: 'desk-dedicated',
    name: 'صندلی اختصاصی (ماهانه/روزانه)',
    capacity: 1,
    hourlyRate: 60000,
    dailyRate: 400000,
    features: ['پریز اختصاصی', 'صندلی ارگونومیک', 'کمد کلیددار']
  },
  {
    key: 'SHARED_DESK',
    id: 'desk-shared',
    name: 'صندلی اشتراکی (فلکسیبل)',
    capacity: 1,
    hourlyRate: 40000,
    dailyRate: 250000,
    features: ['فضای عمومی خلاق', 'اینترنت پرسرعت', 'چای و قهوه رایگان']
  }
];

const FALLBACK_CATERING = [
  { id: 'cat-pkg-standard', name: 'پکیج استاندارد همایش (چای، نسکافه، آبمیوه، کیک تازه)', category: 'PACKAGE', price: 45000 },
  { id: 'cat-pkg-vip', name: 'پکیج تشریفات VIP (قهوه دمی تخصصی، فینگرفود، آبمیوه طبیعی)', category: 'PACKAGE', price: 95000 },
  { id: 'cat-bev-espresso', name: 'اسپرسو دبل شات ۱۰۰٪ عربیکا', category: 'BEVERAGE_HOT', price: 38000 },
  { id: 'cat-bev-latte', name: 'کافه لاته با شیر تازه محلی', category: 'BEVERAGE_HOT', price: 48000 },
  { id: 'cat-bev-coldbrew', name: 'کلد برو (دم‌سرد تخصصی اتیوپی)', category: 'BEVERAGE_COLD', price: 55000 },
  { id: 'cat-snack-croissant', name: 'کروسان فرانسوی با شکلات فندقی', category: 'SNACK', price: 42000 }
];

// Jalali Calendar Algorithm (Accurate conversion)
function gregorianToJalali(gy, gm, gd) {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let gy2 = (gm > 2) ? (gy + 1) : gy;
  let days = 355666 + (365 * gy) + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400) + gd + g_d_m[gm - 1];
  let jy = -1595 + (33 * Math.floor(days / 12053));
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  let jm = (days < 186) ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
  let jd = 1 + ((days < 186) ? (days % 31) : ((days - 186) % 30));
  return { jy, jm, jd };
}

function jalaliToGregorian(jy, jm, jd) {
  let sal_a = [0, 31, 62, 93, 124, 155, 186, 216, 246, 276, 306, 336];
  let jy2 = jy + 1595;
  let days = -355668 + (365 * jy2) + Math.floor(jy2 / 33) * 8 + Math.floor(((jy2 % 33) + 3) / 4) + jd + sal_a[jm - 1];
  let gy = 400 * Math.floor(days / 146097);
  days %= 146097;
  if (days > 36524) {
    gy += 100 * Math.floor(--days / 36524);
    days %= 36524;
    if (days >= 365) days++;
  }
  gy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    gy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  let gd = days + 1;
  const sal_g = [0, 31, ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let gm = 0;
  for (gm = 0; gm < 13; gm++) {
    let v = sal_g[gm];
    if (gd <= v) break;
    gd -= v;
  }
  return { gy, gm, gd };
}

// LocalStore Utility
function getLocalStore(key, defaultValue) {
  try {
    const raw = localStorage.getItem(`techon_${key}`);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

function setLocalStore(key, value) {
  try {
    localStorage.setItem(`techon_${key}`, JSON.stringify(value));
  } catch (e) {}
}

// Application State
const nowG = new Date();
const initialJalali = gregorianToJalali(nowG.getFullYear(), nowG.getMonth() + 1, nowG.getDate());

const state = {
  theme: 'dark',
  currentUser: DEMO_ACCOUNTS[0],
  spaces: [],
  cateringMenu: [],
  rateMode: 'HOURLY',
  selectedSpaceKey: 'CONFERENCE_HALL',
  selectedCateringFilter: 'ALL',
  cateringOrders: {}, // itemId -> quantity
  appliedPromo: null,
  reservations: [],
  calendar: {
    viewYear: initialJalali.jy,
    viewMonth: initialJalali.jm, // 1 - 12
    selectedYear: initialJalali.jy,
    selectedMonth: initialJalali.jm,
    selectedDay: initialJalali.jd,
    timeSlotStart: '09:00',
    timeSlotEnd: '11:00'
  }
};

// Currency Formatter
function formatCurrency(amount) {
  if (!amount && amount !== 0) return '۰ تومان';
  return Number(amount).toLocaleString('fa-IR') + ' تومان';
}

function toPersianDigits(n) {
  const f = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
  return String(n).replace(/[0-9]/g, w => f[+w]);
}

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
  }, 3500);
}

// API Request Wrapper with Graceful Offline Simulation
async function apiRequest(endpoint, method = 'GET', body = null) {
  const headers = {
    'Content-Type': 'application/json',
    'X-User-Role': state.currentUser.role
  };

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  try {
    const res = await fetch(endpoint, options);
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {}

  // Client-Side Fallback Handler
  const url = new URL(endpoint, window.location.origin);
  const path = url.pathname;

  if (path.includes('/api/spaces') && method === 'GET') {
    return { success: true, spaces: FALLBACK_SPACES };
  }

  if (path.includes('/api/catering/menu') && method === 'GET') {
    const customMenu = getLocalStore('catering_menu', FALLBACK_CATERING);
    return { success: true, menu: customMenu };
  }

  if (path.includes('/api/promo/validate') && method === 'POST') {
    const code = (body?.code || '').trim().toUpperCase();
    const subtotal = Number(body?.subtotal) || 0;
    if (code === 'TECHON2026' || code === 'SPRING2026' || code === 'OFF20') {
      const discount = Math.min((subtotal * 20) / 100, 500000);
      return {
        valid: true,
        code,
        discountType: 'PERCENTAGE',
        discountValue: 20,
        maxDiscount: 500000,
        discountAmount: discount,
        subtotal,
        finalTotal: subtotal - discount
      };
    }
    return { valid: false, reason: 'کد تخفیف نامعتبر یا منقضی است.' };
  }

  if (path.includes('/api/reservations') && method === 'POST') {
    const space = FALLBACK_SPACES.find(s => s.key === body.spaceKey) || FALLBACK_SPACES[0];
    const spaceSubtotal = (body.bookingType === 'DAILY' ? space.dailyRate : space.hourlyRate) * (body.duration || 1);
    let equipFee = 0;
    (body.equipment || []).forEach(e => {
      if (e === 'recording') equipFee += 300000;
      if (e === 'sound_system') equipFee += 200000;
    });

    const menu = getLocalStore('catering_menu', FALLBACK_CATERING);
    let cateringSubtotal = 0;
    const cateringDetails = (body.cateringOrders || []).map(o => {
      const it = menu.find(m => m.id === o.itemId);
      const sub = (it ? it.price : 0) * o.quantity;
      cateringSubtotal += sub;
      return { itemId: o.itemId, name: it?.name || 'آیتم کافه', quantity: o.quantity, unitPrice: it?.price || 0, subtotal: sub };
    });

    const gross = spaceSubtotal + equipFee + cateringSubtotal;
    let discount = 0;
    if (body.promoCode === 'TECHON2026') discount = Math.min((gross * 20) / 100, 500000);

    const finalTotal = Math.max(0, gross - discount);
    const id = `RES-${Date.now().toString().slice(-6)}`;
    const invoiceNumber = `INV-${Date.now().toString().slice(-8)}`;

    const reservation = {
      id,
      invoiceNumber,
      spaceKey: body.spaceKey,
      spaceName: space.name,
      bookingType: body.bookingType,
      duration: body.duration,
      startTime: body.startTime,
      endTime: body.endTime,
      customer: { name: body.customerName, phone: body.customerPhone, email: body.customerEmail },
      eventDetails: { topic: body.eventTopic, targetAudienceCount: body.targetAudienceCount },
      equipment: (body.equipment || []).map(e => ({ type: e, name: e === 'recording' ? 'ضبط فیلمبرداری مراسم' : 'سیستم صوتی استیج', fee: e === 'recording' ? 300000 : 200000 })),
      catering: cateringDetails,
      status: body.spaceKey === 'CONFERENCE_HALL' ? 'PENDING_REVIEW' : 'CONFIRMED',
      pricing: { spaceSubtotal, equipmentFee: equipFee, cateringSubtotal, subtotal: gross, discountAmount: discount, finalTotal }
    };

    const invoice = {
      invoiceNumber,
      reservationId: id,
      customer: reservation.customer,
      items: [
        { title: `رزرو ${space.name} (${body.duration} ${body.bookingType === 'DAILY' ? 'روز' : 'ساعت'})`, amount: spaceSubtotal },
        ...reservation.equipment.map(e => ({ title: e.name, amount: e.fee })),
        ...cateringDetails.map(c => ({ title: `${c.name} (${c.quantity} عدد)`, amount: c.subtotal }))
      ],
      subtotal: gross,
      discountAmount: discount,
      finalTotal
    };

    const all = getLocalStore('reservations', []);
    all.unshift(reservation);
    setLocalStore('reservations', all);

    return { success: true, reservation, invoice };
  }

  if (path.includes('/api/my-reservations') && method === 'GET') {
    const all = getLocalStore('reservations', []);
    return { success: true, reservations: all };
  }

  if (path.includes('/api/admin/reservations') && method === 'GET') {
    const all = getLocalStore('reservations', []);
    return { success: true, reservations: all };
  }

  if (path.includes('/api/admin/reservations/') && path.includes('/approve') && method === 'POST') {
    const all = getLocalStore('reservations', []);
    const parts = path.split('/');
    const resId = parts[parts.indexOf('reservations') + 1];
    const target = all.find(r => r.id === resId);
    if (target) target.status = 'CONFIRMED';
    setLocalStore('reservations', all);
    return { success: true, reservation: target };
  }

  if (path.includes('/api/admin/analytics') && method === 'GET') {
    const all = getLocalStore('reservations', []);
    const totalRev = all.reduce((acc, r) => acc + (r.pricing?.finalTotal || 0), 12500000);
    const catRev = all.reduce((acc, r) => acc + (r.pricing?.cateringSubtotal || 0), 1850000);
    const discRev = all.reduce((acc, r) => acc + (r.pricing?.discountAmount || 0), 900000);

    return {
      success: true,
      financials: {
        totalRevenue: totalRev,
        spaceRevenue: totalRev - catRev,
        cateringRevenue: catRev,
        totalDiscountsGiven: discRev,
        breakdownBySpace: {
          CONFERENCE_HALL: { revenue: Math.round(totalRev * 0.65), count: 3 },
          PRIVATE_OFFICE: { revenue: Math.round(totalRev * 0.2), count: 2 },
          SHARED_DESK: { revenue: Math.round(totalRev * 0.15), count: 4 }
        }
      },
      revenueShare: {
        totalRevenue: totalRev,
        contractorShare10: Math.round(totalRev * 0.10),
        contractorShare15: Math.round(totalRev * 0.15)
      },
      auditLogs: [
        { action: 'CONFIRM_HALL_EVENT', resource: 'RES-948123', userId: 'user-admin', timestamp: new Date().toISOString() },
        { action: 'CREATE_PROMO', resource: 'TECHON2026', userId: 'user-admin', timestamp: new Date().toISOString() }
      ]
    };
  }

  return { success: true };
}

// 1. Theme Engine (Dark / Light)
function setupThemeEngine() {
  const savedTheme = localStorage.getItem('techon_theme') || 'dark';
  setTheme(savedTheme);

  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const next = state.theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    showToast(next === 'dark' ? '🌙 حالت شب فعال شد' : '☀️ حالت روز فعال شد');
  });
}

function setTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('techon_theme', theme);
  const icon = document.getElementById('theme-icon');
  if (icon) icon.innerText = theme === 'dark' ? '☀️' : '🌙';
}

// 2. User Roles & Bottom Sheet Modal
function setupUserMenu() {
  const modal = document.getElementById('user-role-modal');
  const btnOpen = document.getElementById('btn-open-user-menu');
  const btnClose = document.getElementById('btn-close-role-modal');
  const listContainer = document.getElementById('roles-modal-list');

  btnOpen?.addEventListener('click', () => {
    modal?.classList.remove('hidden');
  });

  btnClose?.addEventListener('click', () => {
    modal?.classList.add('hidden');
  });

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
  setupUserMenu();
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
      bannerEl.innerHTML = `<strong>دیدگاه اپراتور فضای کار (${user.name}):</strong> دسترسی به مدیریت ظرفیت صندلی‌ها و ثبت دستی.`;
    } else if (user.role === 'CAFE_OPERATOR') {
      bannerEl.innerHTML = `<strong>دیدگاه اپراتور سالن و کافه (${user.name}):</strong> بررسی و تأیید همایش‌ها و ویرایش منوی کافه.`;
    } else if (user.role === 'SUPER_ADMIN') {
      bannerEl.innerHTML = `<strong>دیدگاه سوپرادمین (${user.name}):</strong> دسترسی نامحدود به تمامی ماژول‌ها و گزارشات مالی سهم درآمد (۱۰٪ - ۱۵٪).`;
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

  // Pre-fill inputs
  const nameInput = document.getElementById('cust-name');
  const phoneInput = document.getElementById('cust-phone');
  if (nameInput && user.role === 'CUSTOMER') nameInput.value = user.name;
  if (phoneInput && user.role === 'CUSTOMER') phoneInput.value = user.phone;

  // Refresh active tab
  const activeTab = document.querySelector('.mobile-nav-item.active')?.dataset.tab;
  if (activeTab === 'my-bookings') loadMyBookings();
  if (activeTab === 'admin') loadAdminData();
  if (activeTab === 'analytics') loadAnalyticsData();
}

// 4. Synchronized Desktop & Mobile Navigation
function setupNavigation() {
  const desktopTabs = document.querySelectorAll('.nav-tab-btn');
  const mobileTabs = document.querySelectorAll('.mobile-nav-item');

  desktopTabs.forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  mobileTabs.forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });
}

function switchTab(tabId) {
  // Update Desktop
  document.querySelectorAll('.nav-tab-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === tabId);
  });

  // Update Mobile
  document.querySelectorAll('.mobile-nav-item').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === tabId);
  });

  // Update Views
  document.querySelectorAll('.view-panel').forEach(v => {
    v.classList.toggle('active', v.id === `tab-${tabId}`);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (tabId === 'my-bookings') loadMyBookings();
  if (tabId === 'admin') loadAdminData();
  if (tabId === 'analytics') loadAnalyticsData();
}

// 5. PersianLabs UI Jalali Calendar Component
function setupJalaliCalendar() {
  document.getElementById('btn-cal-prev')?.addEventListener('click', () => {
    state.calendar.viewMonth--;
    if (state.calendar.viewMonth < 1) {
      state.calendar.viewMonth = 12;
      state.calendar.viewYear--;
    }
    renderCalendar();
  });

  document.getElementById('btn-cal-next')?.addEventListener('click', () => {
    state.calendar.viewMonth++;
    if (state.calendar.viewMonth > 12) {
      state.calendar.viewMonth = 1;
      state.calendar.viewYear++;
    }
    renderCalendar();
  });

  // Quick Time Slots
  document.querySelectorAll('.time-slot-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.time-slot-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.calendar.timeSlotStart = pill.dataset.start;
      state.calendar.timeSlotEnd = pill.dataset.end;
      updateSyncDateTimes();
      updatePriceBreakdown();
    });
  });

  renderCalendar();
}

function renderCalendar() {
  const { viewYear, viewMonth, selectedYear, selectedMonth, selectedDay } = state.calendar;

  // Header month title
  const titleEl = document.getElementById('cal-month-title');
  if (titleEl) {
    titleEl.innerText = `${PERSIAN_MONTH_NAMES[viewMonth - 1]} ${toPersianDigits(viewYear)}`;
  }

  // Days count in Jalali month
  const totalDays = (viewMonth <= 6) ? 31 : (viewMonth <= 11 ? 30 : 29);

  // Day of week for first day of Jalali month
  const firstG = jalaliToGregorian(viewYear, viewMonth, 1);
  const firstDateObj = new Date(firstG.gy, firstG.gm - 1, firstG.gd);
  // Gregorian: 0 is Sunday. In Persian calendar: Saturday is 0, Sunday is 1 ... Friday is 6
  const gDay = firstDateObj.getDay();
  const jalaliFirstDayIndex = (gDay + 1) % 7;

  const matrixEl = document.getElementById('cal-days-matrix');
  if (!matrixEl) return;

  let html = '';
  // Empty padding cells before first day
  for (let i = 0; i < jalaliFirstDayIndex; i++) {
    html += `<div class="cal-day-cell disabled" style="visibility:hidden;"></div>`;
  }

  // Day cells
  for (let d = 1; d <= totalDays; d++) {
    const isSelected = (viewYear === selectedYear && viewMonth === selectedMonth && d === selectedDay);
    const isToday = (viewYear === initialJalali.jy && viewMonth === initialJalali.jm && d === initialJalali.jd);

    html += `
      <button type="button" class="cal-day-cell ${isSelected ? 'active-day' : ''} ${isToday ? 'today-marker' : ''}" onclick="selectJalaliDate(${d})">
        ${toPersianDigits(d)}
      </button>
    `;
  }

  matrixEl.innerHTML = html;
  updateSelectedDateText();
}

window.selectJalaliDate = function(day) {
  state.calendar.selectedYear = state.calendar.viewYear;
  state.calendar.selectedMonth = state.calendar.viewMonth;
  state.calendar.selectedDay = day;
  renderCalendar();
  updateSyncDateTimes();
  showToast(`تاریخ ${toPersianDigits(day)} ${PERSIAN_MONTH_NAMES[state.calendar.selectedMonth - 1]} انتخاب شد.`);
};

function updateSelectedDateText() {
  const { selectedYear, selectedMonth, selectedDay } = state.calendar;
  const g = jalaliToGregorian(selectedYear, selectedMonth, selectedDay);
  const dateObj = new Date(g.gy, g.gm - 1, g.gd);
  const weekday = PERSIAN_WEEKDAY_NAMES[dateObj.getDay()];

  const textEl = document.getElementById('selected-jalali-date-text');
  if (textEl) {
    textEl.innerText = `${weekday} ${toPersianDigits(selectedDay)} ${PERSIAN_MONTH_NAMES[selectedMonth - 1]} ${toPersianDigits(selectedYear)}`;
  }
}

function updateSyncDateTimes() {
  const { selectedYear, selectedMonth, selectedDay, timeSlotStart, timeSlotEnd } = state.calendar;
  const g = jalaliToGregorian(selectedYear, selectedMonth, selectedDay);

  const startISO = `${g.gy}-${String(g.gm).padStart(2, '0')}-${String(g.gd).padStart(2, '0')}T${timeSlotStart}:00`;
  const endISO = `${g.gy}-${String(g.gm).padStart(2, '0')}-${String(g.gd).padStart(2, '0')}T${timeSlotEnd}:00`;

  const startEl = document.getElementById('start-datetime');
  const endEl = document.getElementById('end-datetime');
  if (startEl) startEl.value = startISO;
  if (endEl) endEl.value = endISO;
}

// 6. Spaces Showcase Grid
async function loadSpaces() {
  try {
    const data = await apiRequest('/api/spaces');
    state.spaces = data.spaces || FALLBACK_SPACES;
  } catch (err) {
    state.spaces = FALLBACK_SPACES;
  }
  renderSpacesShowcase();
}

function renderSpacesShowcase() {
  const container = document.getElementById('spaces-cards-grid');
  if (!container) return;

  container.innerHTML = state.spaces.map(s => {
    const v = SPACE_VISUALS[s.key] || { icon: '🏢', tag: 'فضای کار' };
    const isSelected = s.key === state.selectedSpaceKey ? 'selected' : '';
    const isDaily = state.rateMode === 'DAILY';
    const rateText = isDaily ? formatCurrency(s.dailyRate) : formatCurrency(s.hourlyRate);
    const suffix = isDaily ? '/ روز' : '/ ساعت';

    return `
      <div class="space-card-item ${isSelected}" data-key="${s.key}" onclick="selectSpace('${s.key}')">
        <div>
          <div class="space-card-top-row">
            <div class="space-card-icon">${v.icon}</div>
            <span class="capacity-tag">ظرفیت ${toPersianDigits(s.capacity)} نفر</span>
          </div>
          <h3 class="space-card-title">${s.name}</h3>
          <div class="space-card-price">${rateText} <small>${suffix}</small></div>
          <div class="space-features-chips">
            ${(s.features || []).slice(0, 3).map(f => `<span class="feature-pill">${f}</span>`).join('')}
          </div>
        </div>
        <button type="button" class="btn-select-space">
          ${isSelected ? 'فضا انتخاب شد ✓' : 'انتخاب فضا'}
        </button>
      </div>
    `;
  }).join('');
}

window.selectSpace = function(key) {
  state.selectedSpaceKey = key;
  renderSpacesShowcase();
  toggleHallFields();
  updatePriceBreakdown();
};

function toggleHallFields() {
  const hallBox = document.getElementById('hall-extra-fields');
  if (!hallBox) return;
  hallBox.classList.toggle('hidden', state.selectedSpaceKey !== 'CONFERENCE_HALL');
}

function setupRateToggle() {
  const btnHourly = document.getElementById('rate-view-hourly');
  const btnDaily = document.getElementById('rate-view-daily');
  const selectType = document.getElementById('booking-type');

  btnHourly?.addEventListener('click', () => {
    btnHourly.classList.add('active');
    btnDaily?.classList.remove('active');
    state.rateMode = 'HOURLY';
    if (selectType) selectType.value = 'HOURLY';
    renderSpacesShowcase();
    updatePriceBreakdown();
  });

  btnDaily?.addEventListener('click', () => {
    btnDaily.classList.add('active');
    btnHourly?.classList.remove('active');
    state.rateMode = 'DAILY';
    if (selectType) selectType.value = 'DAILY';
    renderSpacesShowcase();
    updatePriceBreakdown();
  });

  selectType?.addEventListener('change', (e) => {
    state.rateMode = e.target.value;
    if (state.rateMode === 'DAILY') {
      btnDaily?.classList.add('active');
      btnHourly?.classList.remove('active');
    } else {
      btnHourly?.classList.add('active');
      btnDaily?.classList.remove('active');
    }
    renderSpacesShowcase();
    updatePriceBreakdown();
  });
}

// 7. Catering & Café Showcase
async function loadCateringMenu() {
  try {
    const data = await apiRequest('/api/catering/menu');
    state.cateringMenu = data.menu || FALLBACK_CATERING;
  } catch (err) {
    state.cateringMenu = FALLBACK_CATERING;
  }
  renderCateringBookingList();
  renderCateringCatalogGrid();
  setupCateringFilters();
}

function renderCateringBookingList() {
  const container = document.getElementById('catering-booking-list');
  if (!container) return;

  container.innerHTML = state.cateringMenu.map(item => {
    const qty = state.cateringOrders[item.id] || 0;
    const cat = CATEGORY_META[item.category] || { icon: '☕', label: item.category };
    return `
      <div class="catering-row-item">
        <div class="cat-details">
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

function setupCateringFilters() {
  const filterBtns = document.querySelectorAll('.filter-pill-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.selectedCateringFilter = btn.dataset.filter;
      renderCateringCatalogGrid();
    });
  });
}

function renderCateringCatalogGrid() {
  const container = document.getElementById('catering-catalog-grid');
  if (!container) return;

  const filtered = state.selectedCateringFilter === 'ALL'
    ? state.cateringMenu
    : state.cateringMenu.filter(i => i.category === state.selectedCateringFilter);

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

// 8. Live Pricing Engine
function updatePriceBreakdown() {
  const space = state.spaces.find(s => s.key === state.selectedSpaceKey);
  const bookingType = document.getElementById('booking-type')?.value || 'HOURLY';
  const duration = Number(document.getElementById('duration')?.value) || 1;

  const suffixEl = document.getElementById('duration-suffix');
  if (suffixEl) suffixEl.innerText = bookingType === 'DAILY' ? 'روز' : 'ساعت';

  let spaceSubtotal = 0;
  if (space) {
    const rate = bookingType === 'DAILY' ? space.dailyRate : space.hourlyRate;
    spaceSubtotal = rate * duration;
  }

  let equipFee = 0;
  if (state.selectedSpaceKey === 'CONFERENCE_HALL') {
    if (document.getElementById('equip-recording')?.checked) equipFee += 300000;
    if (document.getElementById('equip-sound')?.checked) equipFee += 200000;
  }

  let cateringSubtotal = 0;
  for (const [itemId, count] of Object.entries(state.cateringOrders)) {
    const item = state.cateringMenu.find(i => i.id === itemId);
    if (item && count > 0) {
      cateringSubtotal += item.price * count;
    }
  }

  const subtotal = spaceSubtotal + equipFee + cateringSubtotal;

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

  // Update Desktop Card
  const spaceNameEl = document.getElementById('summary-space-name');
  const spaceFeeEl = document.getElementById('summary-space-fee');
  const equipFeeEl = document.getElementById('summary-equip-fee');
  const cateringFeeEl = document.getElementById('summary-catering-fee');
  const discRow = document.getElementById('summary-discount-row');
  const discAmountEl = document.getElementById('summary-discount-amount');
  const finalTotalEl = document.getElementById('summary-final-total');

  if (spaceNameEl && space) spaceNameEl.innerText = `رزرو ${space.name}:`;
  if (spaceFeeEl) spaceFeeEl.innerText = formatCurrency(spaceSubtotal);
  if (equipFeeEl) equipFeeEl.innerText = formatCurrency(equipFee);
  if (cateringFeeEl) cateringFeeEl.innerText = formatCurrency(cateringSubtotal);

  if (discRow && discAmountEl) {
    if (discountAmount > 0) {
      discRow.classList.remove('hidden');
      discAmountEl.innerText = `- ${formatCurrency(discountAmount)}`;
    } else {
      discRow.classList.add('hidden');
    }
  }

  if (finalTotalEl) finalTotalEl.innerText = formatCurrency(finalTotal);

  // Update Mobile Floating Bar
  const mobileTotalEl = document.getElementById('mobile-bottom-total-price');
  if (mobileTotalEl) mobileTotalEl.innerText = formatCurrency(finalTotal);
}

// 9. Promo Engine
function setupPromoEngine() {
  const btnApply = document.getElementById('btn-apply-promo');
  const promoInput = document.getElementById('promo-input');
  const feedback = document.getElementById('promo-feedback');

  btnApply?.addEventListener('click', async () => {
    const code = promoInput?.value.trim();
    if (!code) {
      if (feedback) {
        feedback.innerText = 'لطفاً کد تخفیف را وارد فرمایید.';
        feedback.className = 'promo-feedback-msg text-danger';
      }
      return;
    }

    try {
      const space = state.spaces.find(s => s.key === state.selectedSpaceKey);
      const bookingType = document.getElementById('booking-type')?.value || 'HOURLY';
      const duration = Number(document.getElementById('duration')?.value) || 1;
      const baseRate = bookingType === 'DAILY' ? (space?.dailyRate || 0) : (space?.hourlyRate || 0);
      let subtotal = baseRate * duration;
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
        if (feedback) {
          feedback.innerText = `✅ کد تخفیف "${code}" با موفقیت اعمال شد.`;
          feedback.className = 'promo-feedback-msg text-success';
        }
        updatePriceBreakdown();
      } else {
        state.appliedPromo = null;
        if (feedback) {
          feedback.innerText = `❌ ${result.reason || 'کد نامعتبر است'}`;
          feedback.className = 'promo-feedback-msg text-danger';
        }
        updatePriceBreakdown();
      }
    } catch (err) {
      state.appliedPromo = null;
      if (feedback) {
        feedback.innerText = `❌ ${err.message}`;
        feedback.className = 'promo-feedback-msg text-danger';
      }
      updatePriceBreakdown();
    }
  });
}

// 10. Booking Submission & Official Invoice Modal
function setupBookingSubmission() {
  const submitDesktop = document.getElementById('btn-submit-booking');
  const submitMobile = document.getElementById('btn-mobile-checkout-action');

  const handleBooking = async () => {
    const custName = document.getElementById('cust-name')?.value.trim();
    const custPhone = document.getElementById('cust-phone')?.value.trim();
    const custEmail = document.getElementById('cust-email')?.value.trim();
    const bookingType = document.getElementById('booking-type')?.value || 'HOURLY';
    const duration = Number(document.getElementById('duration')?.value) || 1;

    updateSyncDateTimes();
    const startTime = document.getElementById('start-datetime')?.value;
    const endTime = document.getElementById('end-datetime')?.value;

    if (!custName || !custPhone) {
      showToast('لطفاً نام و شماره همراه متقاضی را در مرحله ۴ وارد کنید.', 'error');
      // Scroll to step 4 on mobile
      document.getElementById('cust-name')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    const equipment = [];
    if (document.getElementById('equip-recording')?.checked) equipment.push('recording');
    if (document.getElementById('equip-sound')?.checked) equipment.push('sound_system');

    const cateringOrders = Object.entries(state.cateringOrders).map(([itemId, quantity]) => ({
      itemId,
      quantity
    }));

    const payload = {
      spaceKey: state.selectedSpaceKey,
      bookingType,
      duration,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      customerName: custName,
      customerPhone: custPhone,
      customerEmail: custEmail,
      eventTopic: document.getElementById('event-topic')?.value.trim() || undefined,
      targetAudienceCount: Number(document.getElementById('audience-count')?.value) || undefined,
      equipment,
      cateringOrders,
      promoCode: state.appliedPromo?.code
    };

    if (submitDesktop) submitDesktop.disabled = true;
    if (submitMobile) submitMobile.disabled = true;

    try {
      const response = await apiRequest('/api/reservations', 'POST', payload);
      showToast('رزرو با موفقیت ثبت شد!');
      displayInvoiceModal(response.invoice, response.reservation);
      state.cateringOrders = {};
      state.appliedPromo = null;
      renderCateringBookingList();
      updatePriceBreakdown();
    } catch (err) {
      showToast(`خطا: ${err.message}`, 'error');
    } finally {
      if (submitDesktop) submitDesktop.disabled = false;
      if (submitMobile) submitMobile.disabled = false;
    }
  };

  submitDesktop?.addEventListener('click', handleBooking);
  submitMobile?.addEventListener('click', handleBooking);
}

function displayInvoiceModal(invoice, reservation) {
  const modal = document.getElementById('invoice-modal');
  const content = document.getElementById('invoice-content');
  if (!modal || !content) return;

  const { selectedYear, selectedMonth, selectedDay } = state.calendar;

  content.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:0.75rem;">
      <div style="display:flex; justify-content:space-between; font-size:0.82rem;">
        <div><strong>شماره فاکتور:</strong> <code>${invoice.invoiceNumber}</code></div>
        <div><strong>شناسه رزرو:</strong> <code>${invoice.reservationId}</code></div>
      </div>
      <div style="display:flex; justify-content:space-between; font-size:0.82rem;">
        <div><strong>متقاضی:</strong> ${invoice.customer.name}</div>
        <div><strong>تلفن:</strong> ${toPersianDigits(invoice.customer.phone)}</div>
      </div>
      <div style="font-size:0.82rem;">
        <strong>تاریخ رزرو:</strong> ${toPersianDigits(selectedDay)} ${PERSIAN_MONTH_NAMES[selectedMonth - 1]} ${toPersianDigits(selectedYear)}
      </div>

      <table class="styled-table" style="margin:0.5rem 0;">
        <thead>
          <tr>
            <th>شرح خدمت</th>
            <th>مبلغ</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.items.map(it => `
            <tr>
              <td>${it.title}</td>
              <td><strong>${formatCurrency(it.amount)}</strong></td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="display:flex; justify-content:space-between; font-size:0.88rem;">
        <span>جمع کل ناخالص:</span>
        <strong>${formatCurrency(invoice.subtotal)}</strong>
      </div>
      ${invoice.discountAmount > 0 ? `
        <div style="display:flex; justify-content:space-between; font-size:0.88rem; color:var(--emerald);">
          <span>تخفیف ویژه:</span>
          <strong>- ${formatCurrency(invoice.discountAmount)}</strong>
        </div>
      ` : ''}
      <div class="invoice-divider-line"></div>
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span style="font-size:1rem; font-weight:800;">مبلغ نهایی پرداخت:</span>
        <strong class="final-total-amount" style="font-size:1.3rem;">${formatCurrency(invoice.finalTotal)}</strong>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  document.getElementById('btn-close-invoice').onclick = () => modal.classList.add('hidden');
  document.getElementById('btn-done-invoice').onclick = () => modal.classList.add('hidden');
}

// 11. Customer: My Orders Tab
async function loadMyBookings() {
  const tbody = document.getElementById('my-reservations-tbody');
  if (!tbody) return;

  try {
    const data = await apiRequest('/api/my-reservations');
    const list = data.reservations || [];

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:1.25rem; color:var(--text-dim);">هنوز سفارشی ثبت نکرده‌اید.</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(r => `
      <tr>
        <td><strong>${r.id}</strong></td>
        <td>${r.spaceName}</td>
        <td>${new Date(r.startTime).toLocaleDateString('fa-IR')} (${toPersianDigits(r.duration)} ${r.bookingType === 'DAILY' ? 'روز' : 'ساعت'})</td>
        <td><strong>${formatCurrency(r.pricing?.finalTotal)}</strong></td>
        <td>
          <span class="capacity-tag">
            ${r.status === 'PENDING_REVIEW' ? 'در انتظار تایید' : (r.status === 'CONFIRMED' ? 'تأیید شده' : r.status)}
          </span>
        </td>
        <td>
          <button class="btn-sm-action" onclick="viewExistingInvoice('${r.id}')">🧾 رسید</button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    showToast(err.message, 'error');
  }
}

window.viewExistingInvoice = async function(id) {
  try {
    const data = await apiRequest('/api/my-reservations');
    const r = (data.reservations || []).find(x => x.id === id);
    if (r) {
      displayInvoiceModal({
        invoiceNumber: r.invoiceNumber,
        reservationId: r.id,
        customer: r.customer,
        items: [
          { title: `رزرو ${r.spaceName}`, amount: r.pricing.spaceSubtotal },
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

// 12. Admin CMS Panel
async function loadAdminData() {
  try {
    const data = await apiRequest('/api/admin/reservations');
    state.reservations = data.reservations || [];
    renderAdminTable();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function renderAdminTable() {
  const tbody = document.getElementById('reservations-tbody');
  if (!tbody) return;

  if (state.reservations.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:1.25rem; color:var(--text-dim);">هنوز سفارشی در این بخش وجود ندارد.</td></tr>`;
    return;
  }

  const role = state.currentUser.role;

  tbody.innerHTML = state.reservations.map(r => {
    const isHall = r.spaceKey === 'CONFERENCE_HALL';
    const isPending = r.status === 'PENDING_REVIEW';
    const canApprove = (role === 'SUPER_ADMIN' || role === 'CAFE_OPERATOR') && isPending && isHall;

    return `
      <tr>
        <td><strong>${r.id}</strong></td>
        <td>${r.spaceName}</td>
        <td>${r.customer.name}<br><small style="color:var(--text-dim);">${toPersianDigits(r.customer.phone)}</small></td>
        <td>${isHall ? (r.eventDetails?.topic || 'همایش') : r.bookingType}</td>
        <td><strong>${formatCurrency(r.pricing?.finalTotal)}</strong></td>
        <td>
          <span class="capacity-tag">
            ${r.status === 'PENDING_REVIEW' ? 'در انتظار تایید' : (r.status === 'CONFIRMED' ? 'تأیید شده' : r.status)}
          </span>
        </td>
        <td>
          ${canApprove ? `
            <button class="btn-sm-action" style="background:var(--emerald); color:white;" onclick="approveReservation('${r.id}')">تأیید</button>
          ` : ''}
        </td>
      </tr>
    `;
  }).join('');
}

window.approveReservation = async function(id) {
  try {
    await apiRequest(`/api/admin/reservations/${id}/approve`, 'POST');
    showToast(`رویداد سالن همایش (${id}) تأیید گردید.`);
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
      showToast('آیتم جدید به منوی کافه اضافه شد.');
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

    try {
      await apiRequest('/api/admin/promos', 'POST', { code, type, value });
      showToast(`کد تخفیف ${code} ایجاد شد.`);
      e.target.reset();
    } catch (err) {
      showToast(err.message, 'error');
    }
  });
}

// 13. Financial Dashboard
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
  setupUserMenu();
  setupNavigation();
  setupRateToggle();
  setupJalaliCalendar();
  await loadSpaces();
  await loadCateringMenu();
  setupPromoEngine();
  setupBookingSubmission();
  setupAdminForms();
  toggleHallFields();
  updatePriceBreakdown();

  document.getElementById('duration')?.addEventListener('input', updatePriceBreakdown);
  document.getElementById('equip-recording')?.addEventListener('change', updatePriceBreakdown);
  document.getElementById('equip-sound')?.addEventListener('change', updatePriceBreakdown);
});
