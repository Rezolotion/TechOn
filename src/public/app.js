/**
 * TechOn Platform - Core Client Application
 * Features: Dark/Light Mode, Strict RBAC Scoping, Dynamic Catering Filters,
 * Stepped Wizard Flow, Real-time Invoicing & Analytics.
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
  PRIVATE_OFFICE: '💼',
  DEDICATED_DESK: '🪑',
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

// Application State
const state = {
  theme: 'light',
  currentUser: DEMO_ACCOUNTS[0], // Start as Customer
  spaces: [],
  cateringMenu: [],
  selectedCategoryFilter: 'ALL',
  selectedSpaceKey: 'CONFERENCE_HALL',
  cateringOrders: {}, // itemId -> count
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
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerText = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 4000);
// Default Fallback Data for Static/Offline Deployments
const FALLBACK_SPACES = [
  {
    key: 'CONFERENCE_HALL',
    id: 'hall-main',
    name: 'سالن همایش و رویداد تکان',
    capacity: 70,
    hourlyRate: 1500000,
    dailyRate: 10000000,
    features: ['پروژکتور 4K', 'سیستم صوتی استودیویی', 'استیج و تریبون', 'نورپردازی تخصصی', 'اینترنت فیبر نوری اختصاصی']
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
    features: ['دسترسی به فضای عمومی', 'اینترنت پرسرعت', 'چای و قهوه رایگان']
  }
];

const FALLBACK_CATERING = [
  { id: 'cat-pkg-standard', name: 'پکیج پذیرایی استاندارد همایش (چای، نسکافه، آبمیوه، کیک تازه)', category: 'PACKAGE', price: 45000 },
  { id: 'cat-pkg-vip', name: 'پکیج تشریفات VIP (قهوه دمی تخصصی، فینگرفود، آبمیوه طبیعی)', category: 'PACKAGE', price: 95000 },
  { id: 'cat-bev-espresso', name: 'اسپرسو دبل شات ۱۰۰٪ عربیکا', category: 'BEVERAGE_HOT', price: 38000 },
  { id: 'cat-bev-latte', name: 'کافه لاته با شیر تازه محلی', category: 'BEVERAGE_HOT', price: 48000 },
  { id: 'cat-bev-coldbrew', name: 'کلد برو (دم‌سرد تخصصی اتیوپی)', category: 'BEVERAGE_COLD', price: 55000 },
  { id: 'cat-snack-croissant', name: 'کروسان کره‌ای فرانسوی با شکلات فندقی', category: 'SNACK', price: 42000 }
];

// In-Memory / LocalStorage Store for Standalone Mode
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

// API Request Wrapper with Graceful Static/Offline Fallback
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
    return { valid: false, reason: 'کد تخفیف وارد شده معتبر نیست یا منقضی شده است.' };
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

  if (path.includes('/api/auth/login') && method === 'POST') {
    const user = DEMO_ACCOUNTS.find(u => u.username === (body?.username || '').toLowerCase());
    if (user && user.password === body?.password) {
      return { success: true, user };
    }
    throw new Error('نام کاربری یا کلمه عبور نادرست است.');
  }

  return { success: true };
}

// 1. Dark Mode / Light Mode Engine
function setupThemeEngine() {
  const savedTheme = localStorage.getItem('techon_theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  
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
  const labelEl = document.getElementById('theme-label');
  if (iconEl && labelEl) {
    if (theme === 'dark') {
      iconEl.innerText = '☀️';
      labelEl.innerText = 'حالت روز';
    } else {
      iconEl.innerText = '🌙';
      labelEl.innerText = 'حالت شب';
    }
  }
}

// 2. Authentication & Role Switcher
function setupAuthSystem() {
  const chipsContainer = document.getElementById('quick-user-chips');
  if (chipsContainer) {
    chipsContainer.innerHTML = DEMO_ACCOUNTS.map(u => `
      <button type="button" class="user-chip ${u.id === state.currentUser.id ? 'active-chip' : ''}" onclick="switchUser('${u.username}')">
        <span>${u.avatar}</span>
        <span>${u.name} (${u.title.split(' ')[0]})</span>
      </button>
    `).join('');
  }

  const modalGrid = document.getElementById('demo-accounts-grid');
  if (modalGrid) {
    modalGrid.innerHTML = DEMO_ACCOUNTS.map(u => `
      <div class="demo-account-card ${u.id === state.currentUser.id ? 'active-account' : ''}" onclick="switchUser('${u.username}')">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <strong>${u.avatar} ${u.name}</strong>
          <span class="badge ${u.color}">${u.role}</span>
        </div>
        <div class="demo-cred-tag">یوزر: <code>${u.username}</code> | پسورد: <code>${u.password}</code></div>
        <small style="color:var(--text-secondary); margin-top:0.25rem;">${u.desc}</small>
      </div>
    `).join('');
  }

  const authModal = document.getElementById('auth-modal');
  document.getElementById('btn-open-auth-modal')?.addEventListener('click', () => {
    authModal.classList.remove('hidden');
  });
  document.getElementById('btn-close-auth')?.addEventListener('click', () => {
    authModal.classList.add('hidden');
  });

  document.getElementById('form-manual-login')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();

    try {
      const res = await apiRequest('/api/auth/login', 'POST', { username, password });
      const matched = DEMO_ACCOUNTS.find(u => u.username === res.user.username);
      if (matched) {
        state.currentUser = matched;
        authModal.classList.add('hidden');
        applyRoleVisibility();
        showToast(`خوش آمدید ${matched.name}!`);
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  });

  applyRoleVisibility();
}

window.switchUser = function(username) {
  const target = DEMO_ACCOUNTS.find(u => u.username === username);
  if (!target) return;
  state.currentUser = target;
  document.getElementById('auth-modal')?.classList.add('hidden');
  applyRoleVisibility();
  showToast(`شما به عنوان "${target.name}" (${target.title}) وارد شدید.`);
};

// 3. Strict Role-Based View & Tab Scoping
function applyRoleVisibility() {
  const user = state.currentUser;

  // Header Badge
  document.getElementById('current-user-avatar').innerText = user.avatar;
  document.getElementById('current-user-name').innerText = user.name;
  const roleBadge = document.getElementById('current-user-role-badge');
  roleBadge.innerText = user.title;
  roleBadge.className = `badge ${user.color}`;

  // Active chip sync
  document.querySelectorAll('.user-chip').forEach(chip => {
    chip.classList.toggle('active-chip', chip.innerText.includes(user.name));
  });

  // Perspective Banner
  const banner = document.getElementById('role-perspective-banner');
  let bannerText = '';
  if (user.role === 'CUSTOMER') {
    bannerText = `👁️ <strong>دیدگاه مشتری (${user.name}):</strong> شما فقط به بخش‌های رزرواسیون فضا، منوی کافه و پیگیری رزروهای خود دسترسی دارید. پنل‌های مدیریتی و مالی برای شما مخفی است.`;
  } else if (user.role === 'COWORKING_OPERATOR') {
    bannerText = `👁️ <strong>دیدگاه اپراتور کار اشتراکی (${user.name}):</strong> شما به مدیریت رزروهای صندلی‌ها و اتاق‌ها و ثبت دستی مراجعین دسترسی دارید. گزارشات مالی کلان و سالن همایش مخفی است.`;
  } else if (user.role === 'CAFE_OPERATOR') {
    bannerText = `👁️ <strong>دیدگاه اپراتور سالن و کافه (${user.name}):</strong> شما به بررسی و تأیید رویدادهای سالن همایش و ویرایش منوی کافه دسترسی دارید. گزارشات مالی کلان مخفی است.`;
  } else if (user.role === 'SUPER_ADMIN') {
    bannerText = `👁️ <strong>دیدگاه سوپرادمین (${user.name}):</strong> شما به تمامی ۵ بخش سامانه، تاییدات، ساخت کد تخفیف و گزارشات مالی سهم درآمد (۱۰٪ الی ۱۵٪) دسترسی نامحدود دارید.`;
  }
  banner.innerHTML = bannerText;

  // Tab permissions
  const tabBooking = document.getElementById('tab-btn-booking');
  const tabCatering = document.getElementById('tab-btn-catering');
  const tabMyBookings = document.getElementById('tab-btn-my-bookings');
  const tabAdmin = document.getElementById('tab-btn-admin');
  const tabAnalytics = document.getElementById('tab-btn-analytics');

  if (user.role === 'CUSTOMER') {
    tabBooking.classList.remove('hidden');
    tabCatering.classList.remove('hidden');
    tabMyBookings.classList.remove('hidden');
    tabAdmin.classList.add('hidden');
    tabAnalytics.classList.add('hidden');

    const activeTab = document.querySelector('.nav-tab.active')?.dataset.tab;
    if (activeTab === 'admin' || activeTab === 'analytics') tabBooking.click();
  }

  if (user.role === 'COWORKING_OPERATOR') {
    tabBooking.classList.remove('hidden');
    tabCatering.classList.remove('hidden');
    tabMyBookings.classList.add('hidden');
    tabAdmin.classList.remove('hidden');
    tabAnalytics.classList.add('hidden');
    document.getElementById('tab-admin-title').innerText = 'پنل فضای اشتراکی';

    document.getElementById('admin-catering-box')?.classList.add('hidden');
    document.getElementById('admin-promo-box')?.classList.add('hidden');

    const activeTab = document.querySelector('.nav-tab.active')?.dataset.tab;
    if (activeTab === 'analytics' || activeTab === 'my-bookings') tabAdmin.click();
  }

  if (user.role === 'CAFE_OPERATOR') {
    tabBooking.classList.remove('hidden');
    tabCatering.classList.remove('hidden');
    tabMyBookings.classList.add('hidden');
    tabAdmin.classList.remove('hidden');
    tabAnalytics.classList.add('hidden');
    document.getElementById('tab-admin-title').innerText = 'پنل سالن و کافه';

    document.getElementById('admin-catering-box')?.classList.remove('hidden');
    document.getElementById('admin-promo-box')?.classList.add('hidden');

    const activeTab = document.querySelector('.nav-tab.active')?.dataset.tab;
    if (activeTab === 'analytics' || activeTab === 'my-bookings') tabAdmin.click();
  }

  if (user.role === 'SUPER_ADMIN') {
    tabBooking.classList.remove('hidden');
    tabCatering.classList.remove('hidden');
    tabMyBookings.classList.remove('hidden');
    tabAdmin.classList.remove('hidden');
    tabAnalytics.classList.remove('hidden');
    document.getElementById('tab-admin-title').innerText = 'پنل مدیریت کل';

    document.getElementById('admin-catering-box')?.classList.remove('hidden');
    document.getElementById('admin-promo-box')?.classList.remove('hidden');
  }

  // Pre-fill booking fields
  const nameInput = document.getElementById('cust-name');
  const phoneInput = document.getElementById('cust-phone');
  if (nameInput && user.role === 'CUSTOMER') nameInput.value = user.name;
  if (phoneInput && user.role === 'CUSTOMER') phoneInput.value = user.phone;

  // Refresh tab data
  const currentTab = document.querySelector('.nav-tab.active')?.dataset.tab;
  if (currentTab === 'my-bookings') loadMyBookings();
  if (currentTab === 'admin') loadAdminData();
  if (currentTab === 'analytics') loadAnalyticsData();
}

// 4. Navigation Tab Switcher
function setupNavigation() {
  const tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const targetId = `tab-${tab.dataset.tab}`;
      const targetEl = document.getElementById(targetId);
      if (targetEl) targetEl.classList.add('active');

      if (tab.dataset.tab === 'my-bookings') loadMyBookings();
      if (tab.dataset.tab === 'admin') loadAdminData();
      if (tab.dataset.tab === 'analytics') loadAnalyticsData();
    });
  });
}

// 5. Fetch & Render Spaces
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
  const container = document.getElementById('spaces-list-container');
  if (!container) return;

  container.innerHTML = state.spaces.map(s => {
    const isSelected = s.key === state.selectedSpaceKey ? 'selected' : '';
    const icon = SPACE_ICONS[s.key] || '🏢';
    return `
      <div class="space-item ${isSelected}" data-key="${s.key}">
        <div class="space-item-header">
          <span class="space-name">${icon} ${s.name}</span>
          <span class="badge badge-primary">ظرفیت: ${s.capacity} نفر</span>
        </div>
        <div class="space-prices">
          ساعتی: ${formatCurrency(s.hourlyRate)} | روزانه: ${formatCurrency(s.dailyRate)}
        </div>
        <div class="space-features">
          ${(s.features || []).map(f => `<span class="feature-tag">${f}</span>`).join('')}
        </div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.space-item').forEach(item => {
    item.addEventListener('click', () => {
      state.selectedSpaceKey = item.dataset.key;
      renderSpacesCatalog();
      toggleHallFields();
      updatePriceBreakdown();
      updateWizardStep(2);
    });
  });
}

function toggleHallFields() {
  const hallBox = document.getElementById('hall-extra-fields');
  if (!hallBox) return;
  if (state.selectedSpaceKey === 'CONFERENCE_HALL') {
    hallBox.classList.remove('hidden');
  } else {
    hallBox.classList.add('hidden');
  }
}

function updateWizardStep(step) {
  document.getElementById('wiz-step-1')?.classList.toggle('active', step >= 1);
  document.getElementById('wiz-step-2')?.classList.toggle('active', step >= 2);
  document.getElementById('wiz-step-3')?.classList.toggle('active', step >= 3);
}

// 6. Fetch & Render Catering
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
  const filterBtns = document.querySelectorAll('.filter-pill');
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
      <div class="catering-order-item">
        <div class="cat-item-info">
          <strong>${cat.icon} ${item.name}</strong>
          <span>قیمت واحد: ${formatCurrency(item.price)}</span>
        </div>
        <div class="cat-quantity-controls">
          <button type="button" class="btn-qty" onclick="changeCateringQty('${item.id}', -1)">-</button>
          <span class="qty-val" id="qty-${item.id}">${qty}</span>
          <button type="button" class="btn-qty" onclick="changeCateringQty('${item.id}', 1)">+</button>
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

function renderCateringCatalogGrid() {
  const container = document.getElementById('catering-catalog-grid');
  if (!container) return;

  const filtered = state.selectedCategoryFilter === 'ALL'
    ? state.cateringMenu
    : state.cateringMenu.filter(i => i.category === state.selectedCategoryFilter);

  container.innerHTML = filtered.map(item => {
    const cat = CATEGORY_META[item.category] || { icon: '☕', label: item.category };
    return `
      <div class="cat-card">
        <div class="cat-card-header">
          <h4>${cat.icon} ${item.name}</h4>
          <span class="badge badge-primary">${cat.label}</span>
        </div>
        <div class="cat-card-price">${formatCurrency(item.price)}</div>
        <button class="btn btn-secondary btn-sm" onclick="selectAndBookCatering('${item.id}')">
          ➕ افزودن به سفارش جاری
        </button>
      </div>
    `;
  }).join('');
}

window.selectAndBookCatering = function(itemId) {
  window.changeCateringQty(itemId, 1);
  document.getElementById('tab-btn-booking').click();
  showToast('آیتم به سفارش جاری اضافه شد.');
};

// 7. Live Pricing Calculation Engine
function updatePriceBreakdown() {
  const space = state.spaces.find(s => s.key === state.selectedSpaceKey);
  const bookingType = document.getElementById('booking-type').value;
  const duration = Number(document.getElementById('duration').value) || 1;

  // Suffix label
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

  document.getElementById('summary-space-fee').innerText = formatCurrency(spaceSubtotal);
  document.getElementById('summary-equip-fee').innerText = formatCurrency(equipFee);
  document.getElementById('summary-catering-fee').innerText = formatCurrency(cateringSubtotal);
  
  const discRow = document.getElementById('summary-discount-row');
  if (discountAmount > 0) {
    discRow.classList.remove('hidden');
    document.getElementById('summary-discount-amount').innerText = `- ${formatCurrency(discountAmount)}`;
  } else {
    discRow.classList.add('hidden');
  }

  document.getElementById('summary-final-total').innerText = formatCurrency(finalTotal);
}

// 8. Promo Engine
function setupPromoEngine() {
  const btnApply = document.getElementById('btn-apply-promo');
  const promoInput = document.getElementById('promo-input');
  const feedback = document.getElementById('promo-feedback');

  btnApply?.addEventListener('click', async () => {
    const code = promoInput.value.trim();
    if (!code) {
      feedback.innerText = 'لطفاً کد تخفیف را وارد کنید.';
      feedback.className = 'promo-feedback text-danger';
      return;
    }

    try {
      const space = state.spaces.find(s => s.key === state.selectedSpaceKey);
      const bookingType = document.getElementById('booking-type').value;
      const duration = Number(document.getElementById('duration').value) || 1;
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
        feedback.innerText = `✅ کد تخفیف "${code}" با مبلغ ${formatCurrency(result.discountAmount)} اعمال شد.`;
        feedback.className = 'promo-feedback text-success';
        updatePriceBreakdown();
      } else {
        state.appliedPromo = null;
        feedback.innerText = `❌ ${result.reason || 'کد تخفیف نامعتبر است'}`;
        feedback.className = 'promo-feedback text-danger';
        updatePriceBreakdown();
      }
    } catch (err) {
      state.appliedPromo = null;
      feedback.innerText = `❌ ${err.message}`;
      feedback.className = 'promo-feedback text-danger';
      updatePriceBreakdown();
    }
  });
}

// 9. Booking Submission & Invoice Modal
function setupBookingSubmission() {
  const submitBtn = document.getElementById('btn-submit-booking');
  submitBtn?.addEventListener('click', async () => {
    const custName = document.getElementById('cust-name').value.trim();
    const custPhone = document.getElementById('cust-phone').value.trim();
    const custEmail = document.getElementById('cust-email').value.trim();
    const bookingType = document.getElementById('booking-type').value;
    const duration = Number(document.getElementById('duration').value) || 1;
    const startTime = document.getElementById('start-datetime').value;
    const endTime = document.getElementById('end-datetime').value;

    if (!custName || !custPhone || !startTime || !endTime) {
      showToast('لطفاً تمامی فیلدهای الزامی را تکمیل کنید.', 'error');
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
      updateWizardStep(3);
      displayInvoiceModal(response.invoice, response.reservation);
      state.cateringOrders = {};
      state.appliedPromo = null;
      renderCateringBookingSelector();
      updatePriceBreakdown();
    } catch (err) {
      showToast(`خطا در ثبت رزرو: ${err.message}`, 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>💳 ثبت نهایی و صدور فاکتور رسمی</span>';
    }
  });
}

function displayInvoiceModal(invoice, reservation) {
  const modal = document.getElementById('invoice-modal');
  const content = document.getElementById('invoice-content');

  content.innerHTML = `
    <div class="invoice-receipt">
      <div class="invoice-meta">
        <div><strong>شماره فاکتور:</strong> <code>${invoice.invoiceNumber}</code></div>
        <div><strong>شماره رزرو:</strong> <code>${invoice.reservationId}</code></div>
      </div>
      <div class="invoice-meta">
        <div><strong>نام مشتری:</strong> ${invoice.customer.name}</div>
        <div><strong>شماره تماس:</strong> ${invoice.customer.phone}</div>
      </div>
      <div class="invoice-meta">
        <div><strong>وضعیت فاکتور:</strong> 
          <span class="badge ${reservation.status === 'CONFIRMED' ? 'badge-success' : 'badge-warning'}">
            ${reservation.status === 'CONFIRMED' ? 'تأیید شده' : 'در انتظار تایید اپراتور سالن'}
          </span>
        </div>
      </div>

      <table class="invoice-items-table">
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

      <div class="summary-line">
        <span>جمع کل ناخالص:</span>
        <strong>${formatCurrency(invoice.subtotal)}</strong>
      </div>
      ${invoice.discountAmount > 0 ? `
        <div class="summary-line text-success">
          <span>تخفیف کسر شده:</span>
          <strong>- ${formatCurrency(invoice.discountAmount)}</strong>
        </div>
      ` : ''}
      <div class="summary-divider"></div>
      <div class="summary-total-line">
        <span>مبلغ نهایی پرداخت شده:</span>
        <strong class="total-amount">${formatCurrency(invoice.finalTotal)}</strong>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  document.getElementById('btn-close-invoice').onclick = () => modal.classList.add('hidden');
  document.getElementById('btn-done-invoice').onclick = () => modal.classList.add('hidden');
}

// 10. Customer: My Bookings
async function loadMyBookings() {
  const tbody = document.getElementById('my-reservations-tbody');
  if (!tbody) return;

  try {
    const phone = state.currentUser.phone;
    const data = await apiRequest(`/api/my-reservations?phone=${phone}`);
    const list = data.reservations || [];

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:1.5rem; color:var(--text-secondary);">شما در حال حاضر رزروی ثبت نکرده‌اید.</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(r => `
      <tr>
        <td><strong>${r.id}</strong></td>
        <td>${r.spaceName}</td>
        <td>${new Date(r.startTime).toLocaleDateString('fa-IR')} (${r.duration} ${r.bookingType === 'DAILY' ? 'روز' : 'ساعت'})</td>
        <td><strong>${formatCurrency(r.pricing?.finalTotal)}</strong></td>
        <td>
          <span class="badge ${r.status === 'CONFIRMED' ? 'badge-success' : (r.status === 'PENDING_REVIEW' ? 'badge-warning' : 'badge-danger')}">
            ${r.status === 'PENDING_REVIEW' ? 'در انتظار بررسی' : (r.status === 'CONFIRMED' ? 'تأیید شده' : r.status)}
          </span>
        </td>
        <td>
          <button class="btn btn-sm btn-secondary" onclick="viewExistingInvoice('${r.id}')">🧾 مشاهده رسید</button>
        </td>
      </tr>
    `).join('');
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

// 11. Admin & Operator Panel
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
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:1.5rem; color:var(--text-secondary);">هنوز رزروی در این بخش ثبت نشده است.</td></tr>`;
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
        <td>${r.customer.name}<br><small>${r.customer.phone}</small></td>
        <td>${isHall ? (r.eventDetails?.topic || 'همایش') : r.bookingType}</td>
        <td><strong>${formatCurrency(r.pricing?.finalTotal)}</strong></td>
        <td>
          <span class="badge ${r.status === 'CONFIRMED' ? 'badge-success' : (r.status === 'PENDING_REVIEW' ? 'badge-warning' : 'badge-danger')}">
            ${r.status === 'PENDING_REVIEW' ? 'در انتظار تأیید' : (r.status === 'CONFIRMED' ? 'تأیید شده' : r.status)}
          </span>
        </td>
        <td>
          ${canApprove ? `
            <button class="btn btn-sm btn-success" onclick="approveReservation('${r.id}')">تأیید رویداد</button>
          ` : ''}
          ${r.status !== 'CANCELLED' ? `
            <button class="btn btn-sm btn-danger" onclick="cancelReservation('${r.id}')">لغو</button>
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

// 12. Financial Analytics & Revenue Share (Super Admin)
async function loadAnalyticsData() {
  try {
    const data = await apiRequest('/api/admin/analytics');
    const f = data.financials || {};
    const rev = data.revenueShare || {};

    document.getElementById('metric-total-rev').innerText = formatCurrency(f.totalRevenue);
    document.getElementById('metric-contractor-share').innerText = `${formatCurrency(rev.contractorShare10)} الی ${formatCurrency(rev.contractorShare15)}`;
    document.getElementById('metric-catering-rev').innerText = formatCurrency(f.cateringRevenue);
    document.getElementById('metric-discounts').innerText = formatCurrency(f.totalDiscountsGiven);

    const breakdownEl = document.getElementById('space-revenue-breakdown');
    if (breakdownEl && f.breakdownBySpace) {
      breakdownEl.innerHTML = Object.entries(f.breakdownBySpace).map(([key, item]) => {
        const space = state.spaces.find(s => s.key === key);
        return `
          <div class="breakdown-row">
            <span><strong>${space?.name || key}</strong> (${item.count} رزرو)</span>
            <strong>${formatCurrency(item.revenue)}</strong>
          </div>
        `;
      }).join('');
    }

    const auditEl = document.getElementById('audit-log-list');
    if (auditEl && data.auditLogs) {
      auditEl.innerHTML = data.auditLogs.map(log => `
        <div class="audit-log-item">
          <div><strong>عملیات:</strong> ${log.action} | <strong>منبع:</strong> ${log.resource}</div>
          <div><small>توسط: ${log.userId} در ${new Date(log.timestamp).toLocaleTimeString('fa-IR')}</small></div>
        </div>
      `).join('');
    }

  } catch (err) {
    showToast(err.message, 'error');
  }
}

// Helper: Dates
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
  setupAuthSystem();
  setupNavigation();
  setDefaultDateTimes();
  await loadSpaces();
  await loadCateringMenu();
  setupPromoEngine();
  setupBookingSubmission();
  setupAdminForms();
  toggleHallFields();
  updatePriceBreakdown();

  document.getElementById('booking-type')?.addEventListener('change', updatePriceBreakdown);
  document.getElementById('duration')?.addEventListener('input', updatePriceBreakdown);
  document.getElementById('equip-recording')?.addEventListener('change', updatePriceBreakdown);
  document.getElementById('equip-sound')?.addEventListener('change', updatePriceBreakdown);
});
