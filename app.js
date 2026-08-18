/**
 * TechOn Platform - Core Client Application
 * Premium UI/UX Engine, Interactive Spaces & Catering Showcase,
 * Dual-Mode Standalone/Backend API Support.
 */

// Demo Accounts Scoped for Testing
const DEMO_ACCOUNTS = [
  {
    id: 'user-cust',
    username: 'customer',
    password: 'cust123',
    name: 'مریم رضایی',
    phone: '09124444444',
    role: 'CUSTOMER',
    title: 'مشتری',
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
  CONFERENCE_HALL: { icon: '🏛️', tag: 'ویژه رویداد و کارگاه', desc: 'سالن چندمنظوره با استیج مجهز و استودیو ضبط' },
  PRIVATE_OFFICE: { icon: '💼', tag: 'تیم‌های ۴ الی ۶ نفره', desc: 'اتاق اختصاصی آکوستیک با میز کنفرانس و کمد' },
  DEDICATED_DESK: { icon: '🪑', tag: 'رزرو ماهانه و روزانه', desc: 'صندلی ارگونومیک، پریز اختصاصی و کمد کلیددار' },
  SHARED_DESK: { icon: '💻', tag: 'فضای فلکسیبل و منعطف', desc: 'میزهای مشترک با اینترنت فیبر نوری پرسرعت' }
};

const CATEGORY_META = {
  PACKAGE: { label: 'پکیج تشریفات', icon: '🎁' },
  BEVERAGE_HOT: { label: 'نوشیدنی گرم', icon: '☕' },
  BEVERAGE_COLD: { label: 'نوشیدنی سرد', icon: '🧃' },
  SNACK: { label: 'اسنک و فینگرفود', icon: '🥐' },
  MEAL: { label: 'میان‌وعده ویژه', icon: '🥪' }
};

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
const state = {
  theme: 'dark',
  currentUser: DEMO_ACCOUNTS[0],
  spaces: [],
  cateringMenu: [],
  rateMode: 'HOURLY', // 'HOURLY' or 'DAILY'
  selectedSpaceKey: 'CONFERENCE_HALL',
  selectedCateringFilter: 'ALL',
  cateringOrders: {}, // itemId -> quantity
  appliedPromo: null,
  reservations: []
};

// Currency Formatter
function formatCurrency(amount) {
  if (!amount && amount !== 0) return '۰ تومان';
  return Number(amount).toLocaleString('fa-IR') + ' تومان';
}

// Toast Notifier
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast-msg toast-${type}`;
  toast.innerText = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 4000);
}

// API Request Wrapper with Auto Offline Simulation
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
  } catch (err) {
    // Network or static hosting - fallback to local simulation
  }

  // --- CLIENT-SIDE FALLBACK HANDLER ---
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
    return { valid: false, reason: 'کد تخفیف وارد شده نامعتبر است یا منقضی شده است.' };
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

  const toggleBtn = document.getElementById('theme-toggle');
  toggleBtn?.addEventListener('click', () => {
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
  if (iconEl) {
    iconEl.innerText = theme === 'dark' ? '☀️' : '🌙';
  }
}

// 2. User Menu & Role Switcher Popover
function setupUserMenu() {
  const btnOpen = document.getElementById('btn-open-user-menu');
  const popover = document.getElementById('user-menu-popover');
  const listContainer = document.getElementById('popover-users-list');

  btnOpen?.addEventListener('click', (e) => {
    e.stopPropagation();
    popover?.classList.toggle('hidden');
  });

  document.addEventListener('click', (e) => {
    if (!popover?.contains(e.target) && !btnOpen?.contains(e.target)) {
      popover?.classList.add('hidden');
    }
  });

  if (listContainer) {
    listContainer.innerHTML = DEMO_ACCOUNTS.map(u => `
      <div class="popover-user-row ${u.id === state.currentUser.id ? 'active-user' : ''}" onclick="switchRole('${u.username}')">
        <div style="display:flex; align-items:center; gap:0.5rem;">
          <span style="font-size:1.3rem;">${u.avatar}</span>
          <div style="text-align:right;">
            <strong style="font-size:0.84rem; display:block;">${u.name}</strong>
            <small style="color:var(--text-dim); font-size:0.72rem;">${u.title}</small>
          </div>
        </div>
        <span style="font-size:0.7rem; color:var(--primary); font-weight:700;">${u.id === state.currentUser.id ? 'فعال ✓' : 'انتخاب'}</span>
      </div>
    `).join('');
  }

  applyRoleScoping();
}

window.switchRole = function(username) {
  const target = DEMO_ACCOUNTS.find(u => u.username === username);
  if (!target) return;
  state.currentUser = target;
  document.getElementById('user-menu-popover')?.classList.add('hidden');
  setupUserMenu();
  applyRoleScoping();
  showToast(`نقش به "${target.name}" (${target.title}) تغییر یافت.`);
};

// 3. Strict Role-Based View Scoping
function applyRoleScoping() {
  const user = state.currentUser;

  // Update Header Pill
  const avatarEl = document.getElementById('current-user-avatar');
  const nameEl = document.getElementById('current-user-name');
  const roleBadge = document.getElementById('current-user-role-badge');
  if (avatarEl) avatarEl.innerText = user.avatar;
  if (nameEl) nameEl.innerText = user.name;
  if (roleBadge) roleBadge.innerText = user.title;

  // Role Context Banner
  const bannerTextEl = document.getElementById('role-context-text');
  if (bannerTextEl) {
    if (user.role === 'CUSTOMER') {
      bannerTextEl.innerHTML = `<strong>دیدگاه مشتری (${user.name}):</strong> دسترسی به رزرواسیون آنلاین فضا، منوی کافه و پیگیری فاکتورها.`;
    } else if (user.role === 'COWORKING_OPERATOR') {
      bannerTextEl.innerHTML = `<strong>دیدگاه اپراتور فضای کار (${user.name}):</strong> دسترسی به مدیریت ظرفیت صندلی‌ها و ثبت دستی مراجعین.`;
    } else if (user.role === 'CAFE_OPERATOR') {
      bannerTextEl.innerHTML = `<strong>دیدگاه اپراتور سالن و کافه (${user.name}):</strong> دسترسی به بررسی و تأیید رویدادهای همایش و مدیریت منوی کافه.`;
    } else if (user.role === 'SUPER_ADMIN') {
      bannerTextEl.innerHTML = `<strong>دیدگاه سوپرادمین (${user.name}):</strong> دسترسی کامل به تمامی ابزارها، تاییدات، ساخت کد تخفیف و گزارشات مالی سهم درآمد (۱۰٪ - ۱۵٪).`;
    }
  }

  // Tabs Visibility
  const tabBooking = document.getElementById('tab-btn-booking');
  const tabCatering = document.getElementById('tab-btn-catering');
  const tabMyBookings = document.getElementById('tab-btn-my-bookings');
  const tabAdmin = document.getElementById('tab-btn-admin');
  const tabAnalytics = document.getElementById('tab-btn-analytics');

  if (user.role === 'CUSTOMER') {
    tabBooking?.classList.remove('hidden');
    tabCatering?.classList.remove('hidden');
    tabMyBookings?.classList.remove('hidden');
    tabAdmin?.classList.add('hidden');
    tabAnalytics?.classList.add('hidden');

    const activeTab = document.querySelector('.nav-link.active')?.dataset.tab;
    if (activeTab === 'admin' || activeTab === 'analytics') tabBooking?.click();
  }

  if (user.role === 'COWORKING_OPERATOR') {
    tabBooking?.classList.remove('hidden');
    tabCatering?.classList.remove('hidden');
    tabMyBookings?.classList.add('hidden');
    tabAdmin?.classList.remove('hidden');
    tabAnalytics?.classList.add('hidden');
    const adminTitle = document.getElementById('tab-admin-title');
    if (adminTitle) adminTitle.innerText = 'پنل فضای کار';

    document.getElementById('admin-catering-box')?.classList.add('hidden');
    document.getElementById('admin-promo-box')?.classList.add('hidden');

    const activeTab = document.querySelector('.nav-link.active')?.dataset.tab;
    if (activeTab === 'analytics' || activeTab === 'my-bookings') tabAdmin?.click();
  }

  if (user.role === 'CAFE_OPERATOR') {
    tabBooking?.classList.remove('hidden');
    tabCatering?.classList.remove('hidden');
    tabMyBookings?.classList.add('hidden');
    tabAdmin?.classList.remove('hidden');
    tabAnalytics?.classList.add('hidden');
    const adminTitle = document.getElementById('tab-admin-title');
    if (adminTitle) adminTitle.innerText = 'پنل سالن و کافه';

    document.getElementById('admin-catering-box')?.classList.remove('hidden');
    document.getElementById('admin-promo-box')?.classList.add('hidden');

    const activeTab = document.querySelector('.nav-link.active')?.dataset.tab;
    if (activeTab === 'analytics' || activeTab === 'my-bookings') tabAdmin?.click();
  }

  if (user.role === 'SUPER_ADMIN') {
    tabBooking?.classList.remove('hidden');
    tabCatering?.classList.remove('hidden');
    tabMyBookings?.classList.remove('hidden');
    tabAdmin?.classList.remove('hidden');
    tabAnalytics?.classList.remove('hidden');
    const adminTitle = document.getElementById('tab-admin-title');
    if (adminTitle) adminTitle.innerText = 'پنل مدیریت کل';

    document.getElementById('admin-catering-box')?.classList.remove('hidden');
    document.getElementById('admin-promo-box')?.classList.remove('hidden');
  }

  // Pre-fill inputs
  const nameInput = document.getElementById('cust-name');
  const phoneInput = document.getElementById('cust-phone');
  if (nameInput && user.role === 'CUSTOMER') nameInput.value = user.name;
  if (phoneInput && user.role === 'CUSTOMER') phoneInput.value = user.phone;

  // Refresh active tab data
  const currentTab = document.querySelector('.nav-link.active')?.dataset.tab;
  if (currentTab === 'my-bookings') loadMyBookings();
  if (currentTab === 'admin') loadAdminData();
  if (currentTab === 'analytics') loadAnalyticsData();
}

// 4. Tab Navigation
function setupNavigation() {
  const tabButtons = document.querySelectorAll('.nav-link');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-view').forEach(v => v.classList.remove('active'));

      btn.classList.add('active');
      const targetId = `tab-${btn.dataset.tab}`;
      const targetEl = document.getElementById(targetId);
      if (targetEl) targetEl.classList.add('active');

      if (btn.dataset.tab === 'my-bookings') loadMyBookings();
      if (btn.dataset.tab === 'admin') loadAdminData();
      if (btn.dataset.tab === 'analytics') loadAnalyticsData();
    });
  });
}

// 5. Spaces Showcase Engine
async function loadSpaces() {
  try {
    const data = await apiRequest('/api/spaces');
    state.spaces = data.spaces || FALLBACK_SPACES;
  } catch (err) {
    state.spaces = FALLBACK_SPACES;
  }
  renderSpacesGrid();
}

function renderSpacesGrid() {
  const container = document.getElementById('spaces-cards-grid');
  if (!container) return;

  container.innerHTML = state.spaces.map(s => {
    const visual = SPACE_VISUALS[s.key] || { icon: '🏢', tag: 'فضای کار', desc: '' };
    const isSelected = s.key === state.selectedSpaceKey ? 'selected' : '';
    const isDaily = state.rateMode === 'DAILY';
    const rateText = isDaily ? formatCurrency(s.dailyRate) : formatCurrency(s.hourlyRate);
    const suffix = isDaily ? '/ روز' : '/ ساعت';

    return `
      <div class="space-card ${isSelected}" data-key="${s.key}" onclick="selectSpace('${s.key}')">
        <div>
          <div class="space-card-top">
            <div class="space-icon-box">${visual.icon}</div>
            <span class="space-capacity-pill">ظرفیت ${s.capacity} نفر</span>
          </div>
          <h3 class="space-title">${s.name}</h3>
          <div class="space-price-tag">${rateText} <small>${suffix}</small></div>
          <div class="space-amenities-tags">
            ${(s.features || []).slice(0, 3).map(f => `<span class="amenity-chip">${f}</span>`).join('')}
          </div>
        </div>
        <button type="button" class="space-card-action-btn">
          ${isSelected ? 'فضای انتخاب شده ✓' : 'انتخاب این فضا'}
        </button>
      </div>
    `;
  }).join('');
}

window.selectSpace = function(key) {
  state.selectedSpaceKey = key;
  renderSpacesGrid();
  toggleHallFields();
  updatePriceBreakdown();
};

function toggleHallFields() {
  const hallBox = document.getElementById('hall-extra-fields');
  if (!hallBox) return;
  if (state.selectedSpaceKey === 'CONFERENCE_HALL') {
    hallBox.classList.remove('hidden');
  } else {
    hallBox.classList.add('hidden');
  }
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
    renderSpacesGrid();
    updatePriceBreakdown();
  });

  btnDaily?.addEventListener('click', () => {
    btnDaily.classList.add('active');
    btnHourly?.classList.remove('active');
    state.rateMode = 'DAILY';
    if (selectType) selectType.value = 'DAILY';
    renderSpacesGrid();
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
    renderSpacesGrid();
    updatePriceBreakdown();
  });
}

// 6. Catering & Café Showcase
async function loadCateringMenu() {
  try {
    const data = await apiRequest('/api/catering/menu');
    state.cateringMenu = data.menu || FALLBACK_CATERING;
  } catch (err) {
    state.cateringMenu = FALLBACK_CATERING;
  }
  renderCateringBookingSelector();
  renderCateringCatalogGrid();
  setupCateringFilters();
}

function renderCateringBookingSelector() {
  const container = document.getElementById('catering-booking-list');
  if (!container) return;

  container.innerHTML = state.cateringMenu.map(item => {
    const qty = state.cateringOrders[item.id] || 0;
    const cat = CATEGORY_META[item.category] || { icon: '☕', label: item.category };
    return `
      <div class="catering-selector-row">
        <div class="cat-item-text">
          <strong>${cat.icon} ${item.name}</strong>
          <span>قیمت واحد: ${formatCurrency(item.price)}</span>
        </div>
        <div class="cat-counter-controls">
          <button type="button" class="btn-counter" onclick="changeCateringQty('${item.id}', -1)">−</button>
          <span class="counter-value" id="qty-${item.id}">${qty}</span>
          <button type="button" class="btn-counter" onclick="changeCateringQty('${item.id}', 1)">+</button>
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
  if (qtyEl) qtyEl.innerText = next;
  updatePriceBreakdown();
};

function setupCateringFilters() {
  const filterBtns = document.querySelectorAll('.cat-filter-btn');
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
      <div class="cat-product-card">
        <div>
          <div class="cat-product-header">
            <h4>${cat.icon} ${item.name}</h4>
            <span class="space-capacity-pill">${cat.label}</span>
          </div>
          <div class="cat-price-callout">${formatCurrency(item.price)}</div>
        </div>
        <button type="button" class="space-card-action-btn" onclick="addCateringFromCatalog('${item.id}')">
          ➕ افزودن به سفارش جاری
        </button>
      </div>
    `;
  }).join('');
}

window.addCateringFromCatalog = function(itemId) {
  window.changeCateringQty(itemId, 1);
  document.getElementById('tab-btn-booking')?.click();
  showToast('آیتم به سفارش جاری افزوده شد.');
};

// 7. Live Price Calculation
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

  const spaceNameEl = document.getElementById('summary-space-name');
  const spaceFeeEl = document.getElementById('summary-space-fee');
  const equipFeeEl = document.getElementById('summary-equip-fee');
  const cateringFeeEl = document.getElementById('summary-catering-fee');
  const discRow = document.getElementById('summary-discount-row');
  const discAmountEl = document.getElementById('summary-discount-amount');
  const finalTotalEl = document.getElementById('summary-final-total');

  if (spaceNameEl && space) spaceNameEl.innerText = `رزرو ${space.name} (${duration} ${bookingType === 'DAILY' ? 'روز' : 'ساعت'}):`;
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
}

// 8. Promo Validation
function setupPromoEngine() {
  const btnApply = document.getElementById('btn-apply-promo');
  const promoInput = document.getElementById('promo-input');
  const feedback = document.getElementById('promo-feedback');

  btnApply?.addEventListener('click', async () => {
    const code = promoInput?.value.trim();
    if (!code) {
      if (feedback) {
        feedback.innerText = 'لطفاً کد تخفیف را وارد نمایید.';
        feedback.className = 'promo-feedback-text text-danger';
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
          feedback.innerText = `✅ کد تخفیف "${code}" با مبلغ ${formatCurrency(result.discountAmount)} اعمال شد.`;
          feedback.className = 'promo-feedback-text text-success';
        }
        updatePriceBreakdown();
      } else {
        state.appliedPromo = null;
        if (feedback) {
          feedback.innerText = `❌ ${result.reason || 'کد تخفیف نامعتبر است'}`;
          feedback.className = 'promo-feedback-text text-danger';
        }
        updatePriceBreakdown();
      }
    } catch (err) {
      state.appliedPromo = null;
      if (feedback) {
        feedback.innerText = `❌ ${err.message}`;
        feedback.className = 'promo-feedback-text text-danger';
      }
      updatePriceBreakdown();
    }
  });
}

// 9. Booking Submission & Official Invoice Modal
function setupBookingSubmission() {
  const submitBtn = document.getElementById('btn-submit-booking');
  submitBtn?.addEventListener('click', async () => {
    const custName = document.getElementById('cust-name')?.value.trim();
    const custPhone = document.getElementById('cust-phone')?.value.trim();
    const custEmail = document.getElementById('cust-email')?.value.trim();
    const bookingType = document.getElementById('booking-type')?.value || 'HOURLY';
    const duration = Number(document.getElementById('duration')?.value) || 1;
    const startTime = document.getElementById('start-datetime')?.value;
    const endTime = document.getElementById('end-datetime')?.value;

    if (!custName || !custPhone || !startTime || !endTime) {
      showToast('لطفاً تمامی فیلدهای الزامی (نام، تلفن، زمان شروع و پایان) را تکمیل فرمایید.', 'error');
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

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>⏳ در حال پردازش و ثبت سفارش...</span>';

    try {
      const response = await apiRequest('/api/reservations', 'POST', payload);
      showToast('رزرو شما با موفقیت ثبت شد!');
      displayInvoiceModal(response.invoice, response.reservation);
      state.cateringOrders = {};
      state.appliedPromo = null;
      renderCateringBookingSelector();
      updatePriceBreakdown();
    } catch (err) {
      showToast(`خطا در ثبت رزرو: ${err.message}`, 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span class="checkout-icon">💳</span><span class="checkout-text">ثبت نهایی و صدور فاکتور رسمی</span>';
    }
  });
}

function displayInvoiceModal(invoice, reservation) {
  const modal = document.getElementById('invoice-modal');
  const content = document.getElementById('invoice-content');
  if (!modal || !content) return;

  content.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:0.85rem;">
      <div style="display:flex; justify-content:space-between; font-size:0.85rem;">
        <div><strong>شماره فاکتور:</strong> <code>${invoice.invoiceNumber}</code></div>
        <div><strong>شماره پیگیری:</strong> <code>${invoice.reservationId}</code></div>
      </div>
      <div style="display:flex; justify-content:space-between; font-size:0.85rem;">
        <div><strong>نام متقاضی:</strong> ${invoice.customer.name}</div>
        <div><strong>شماره تماس:</strong> ${invoice.customer.phone}</div>
      </div>
      <div style="font-size:0.85rem;">
        <strong>وضعیت رویداد:</strong> 
        <span class="space-capacity-pill" style="margin-right:0.4rem;">
          ${reservation.status === 'CONFIRMED' ? 'تأیید شده' : 'در انتظار تأیید اپراتور سالن'}
        </span>
      </div>

      <table class="modern-table" style="margin:0.75rem 0;">
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
              <td><strong>${formatCurrency(it.amount)}</strong></td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="display:flex; justify-content:space-between; font-size:0.9rem;">
        <span>جمع کل ناخالص:</span>
        <strong>${formatCurrency(invoice.subtotal)}</strong>
      </div>
      ${invoice.discountAmount > 0 ? `
        <div style="display:flex; justify-content:space-between; font-size:0.9rem; color:var(--emerald);">
          <span>تخفیف کسر شده:</span>
          <strong>- ${formatCurrency(invoice.discountAmount)}</strong>
        </div>
      ` : ''}
      <div class="invoice-divider"></div>
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span style="font-size:1.1rem; font-weight:800;">مبلغ نهایی پرداخت شده:</span>
        <strong class="final-price-callout">${formatCurrency(invoice.finalTotal)}</strong>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  document.getElementById('btn-close-invoice').onclick = () => modal.classList.add('hidden');
  document.getElementById('btn-done-invoice').onclick = () => modal.classList.add('hidden');
}

// 10. Customer: My Bookings Tab
async function loadMyBookings() {
  const tbody = document.getElementById('my-reservations-tbody');
  if (!tbody) return;

  try {
    const data = await apiRequest('/api/my-reservations');
    const list = data.reservations || [];

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:1.5rem; color:var(--text-dim);">شما در حال حاضر رزروی ثبت نکرده‌اید.</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(r => `
      <tr>
        <td><strong>${r.id}</strong></td>
        <td>${r.spaceName}</td>
        <td>${new Date(r.startTime).toLocaleDateString('fa-IR')} (${r.duration} ${r.bookingType === 'DAILY' ? 'روز' : 'ساعت'})</td>
        <td><strong>${formatCurrency(r.pricing?.finalTotal)}</strong></td>
        <td>
          <span class="space-capacity-pill">
            ${r.status === 'PENDING_REVIEW' ? 'در انتظار بررسی' : (r.status === 'CONFIRMED' ? 'تأیید شده' : r.status)}
          </span>
        </td>
        <td>
          <button class="btn-counter" style="width:auto; padding:0.25rem 0.65rem;" onclick="viewExistingInvoice('${r.id}')">🧾 مشاهده رسید</button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    showToast(err.message, 'error');
  }
}

window.viewExistingInvoice = async function(reservationId) {
  try {
    const data = await apiRequest('/api/my-reservations');
    const r = (data.reservations || []).find(x => x.id === reservationId);
    if (r) {
      displayInvoiceModal({
        invoiceNumber: r.invoiceNumber,
        reservationId: r.id,
        customer: r.customer,
        items: [
          { title: `رزرو ${r.spaceName}`, amount: r.pricing.spaceSubtotal },
          ...r.equipment.map(e => ({ title: e.name, amount: e.fee })),
          ...r.catering.map(c => ({ title: `${c.name} (${c.quantity} عدد)`, amount: c.subtotal }))
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

// 11. Admin & Operator CMS Panel
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

    return `
      <tr>
        <td><strong>${r.id}</strong></td>
        <td>${r.spaceName}</td>
        <td>${r.customer.name}<br><small style="color:var(--text-dim);">${r.customer.phone}</small></td>
        <td>${isHall ? (r.eventDetails?.topic || 'همایش') : r.bookingType}</td>
        <td><strong>${formatCurrency(r.pricing?.finalTotal)}</strong></td>
        <td>
          <span class="space-capacity-pill">
            ${r.status === 'PENDING_REVIEW' ? 'در انتظار تأیید' : (r.status === 'CONFIRMED' ? 'تأیید شده' : r.status)}
          </span>
        </td>
        <td>
          ${canApprove ? `
            <button class="segment-btn active" style="margin-left:0.4rem;" onclick="approveReservation('${r.id}')">تأیید رویداد</button>
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

// 12. Financial Analytics & Revenue Share
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
          <div class="space-breakdown-row">
            <span><strong>${space?.name || key}</strong> (${item.count} رزرو)</span>
            <strong>${formatCurrency(item.revenue)}</strong>
          </div>
        `;
      }).join('');
    }

    const auditEl = document.getElementById('audit-log-list');
    if (auditEl && data.auditLogs) {
      auditEl.innerHTML = data.auditLogs.map(log => `
        <div class="audit-stream-item">
          <div><strong>عملیات:</strong> ${log.action} | <strong>منبع:</strong> ${log.resource}</div>
          <div><small>توسط: ${log.userId} در ${new Date(log.timestamp).toLocaleTimeString('fa-IR')}</small></div>
        </div>
      `).join('');
    }

  } catch (err) {
    showToast(err.message, 'error');
  }
}

// Default Dates
function setDefaultDateTimes() {
  const now = new Date();
  now.setMinutes(0, 0, 0);
  const start = new Date(now.getTime() + 3600000);
  const end = new Date(now.getTime() + 3 * 3600000);

  const formatLocalISO = (d) => {
    const offset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - offset).toISOString().slice(0, 16);
  };

  const startInput = document.getElementById('start-datetime');
  const endInput = document.getElementById('end-datetime');
  if (startInput) startInput.value = formatLocalISO(start);
  if (endInput) endInput.value = formatLocalISO(end);
}

// Bootstrap
document.addEventListener('DOMContentLoaded', async () => {
  setupThemeEngine();
  setupUserMenu();
  setupNavigation();
  setDefaultDateTimes();
  setupRateToggle();
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
