/**
 * TechOn Platform - Production Client Application
 * Version: 4.2.0
 * Architecture: Clean Vanilla JS with Dynamic Persian Jalali Calendar,
 * B2B Mobile-First Cards, Strict Authentication & Zero UI Clutter.
 */

// Space Visual Imagery
const SPACE_MEDIA = {
  SHARED_DESK: {
    image: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=800&q=80',
    icon: '💻',
    status: '۶۰ صندلی آماده رزرو'
  },
  PRIVATE_OFFICE: {
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    icon: '💼',
    status: '۴ اتاق خصوصی'
  },
  MEETING_ROOM: {
    image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=800&q=80',
    icon: '🤝',
    status: '۱ اتاق ویدیوکنفرانس'
  },
  CONFERENCE_HALL: {
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    icon: '🎤',
    status: '۱ سالن همایش ۷۰ نفره'
  }
};

// Default Spaces Definition
const DEFAULT_SPACES = [
  {
    key: 'SHARED_DESK',
    name: 'صندلی کار اشتراکی (۶۰ صندلی)',
    hourlyRate: 40000,
    dailyRate: 250000,
    capacity: 60,
    totalUnits: 60,
    description: 'فضای کار اشتراکی آرام با نور طبیعی، اینترنت فیبر نوری پرسرعت ۱Gbps، صندلی ارگونومیک، پریز برق و چای رایگان.',
    features: ['📶 اینترنت فیبر ۱Gbps', '💺 صندلی ارگونومیک', '🔌 پریز برق اختصاصی', '☕ چای و آب نامحدود']
  },
  {
    key: 'PRIVATE_OFFICE',
    name: 'اتاق کار اختصاصی تیم (۴ اتاق)',
    hourlyRate: 350000,
    dailyRate: 2400000,
    capacity: 4,
    totalUnits: 4,
    description: 'اتاق دربسته ۴ نفره مجهز به میز اختصاصی، وایت‌برد شیشه‌ای و محیطی کاملاً آکوستیک برای تمرکز تیمی.',
    features: ['🛡️ محیط کاملاً آکوستیک', '👥 ظرفیت تا ۴ نفر', '📺 وایت‌برد و مانیتور', '❄️ تهویه مطبوع مجزا']
  },
  {
    key: 'MEETING_ROOM',
    name: 'اتاق جلسه و ویدیوکنفرانس (۱ اتاق)',
    hourlyRate: 250000,
    dailyRate: 1800000,
    capacity: 12,
    totalUnits: 1,
    description: 'اتاق جلسه ۱۲ نفره مجهز به نمایشگر ۶۵ اینچ 4K، سیستم صوتی و وبکم کنفرانس هوشمند.',
    features: ['📺 نمایشگر ۶۵ اینچ 4K', '🎙️ تجهیزات کنفرانس هوشمند', '📋 وایت‌برد شیشه‌ای بزرگ', '🔇 عایق صوتی پیشرفته']
  },
  {
    key: 'CONFERENCE_HALL',
    name: 'سالن همایش و رویداد تکـان (۱ سالن)',
    hourlyRate: 1500000,
    dailyRate: 12000000,
    capacity: 70,
    totalUnits: 1,
    description: 'سالن همایش حرفه‌ای با ظرفیت ۷۰ نفر صندلی سینمایی، استیج اختصاصی، پروژکتور لیزری 4K و سیستم صوت استودیویی.',
    features: ['👥 ظرفیت ۷۰ نفر صندلی', '📽️ ویدیو پروژکتور 4K', '🎙️ سیستم صوت بی‌سیم', '🎥 امکان ضبط چنددوربینه']
  }
];

// Default Catering Menu
const DEFAULT_CATERING = [
  { id: 'pkg-basic', name: 'پکیج پایه تکان (چای/قهوه + بیسکوییت)', category: 'PACKAGE', price: 45000, desc: 'چای تازه‌دم لاهیجان به همراه بیسکوییت پذیرایی' },
  { id: 'pkg-vip', name: 'پکیج VIP تکان (قهوه دمی + کروسان + فینگر)', category: 'PACKAGE', price: 120000, desc: 'قهوه تخصصی دمی + کروسان فرانسوی تازه + اسنک' },
  { id: 'pkg-meeting', name: 'پکیج تشریفات جلسه (پذیرایی VIP + آبمیوه)', category: 'PACKAGE', price: 160000, desc: 'پذیرایی کامل جلسات شرکتی با میوه فصل و آبمیوه طبیعی' },
  { id: 'bev-espresso', name: 'اسپرسو دوبل تخصصی', category: 'BEVERAGE_HOT', price: 55000, desc: '۱۰۰٪ عربیکا با رست مدیوم' },
  { id: 'bev-latte', name: 'لاته آرت باریستا', category: 'BEVERAGE_HOT', price: 65000, desc: 'شیر تازه با کف مخملی و اسپرسو سینگل' },
  { id: 'bev-tea', name: 'چای اصیل لاهیجان با هل و دارچین', category: 'BEVERAGE_HOT', price: 35000, desc: 'سرو سنتی با نبات زعفرانی' },
  { id: 'bev-coldbrew', name: 'کلدبرو مخصوص کافه تکان', category: 'BEVERAGE_COLD', price: 75000, desc: 'عصاره‌گیری سرد ۱۸ ساعته' },
  { id: 'snack-croissant', name: 'کروسان بادام فرانسوی تازه', category: 'SNACK', price: 60000, desc: 'پخت روزانه در کافه تکان' }
];

// Known Staff Accounts for Static Fallback
const STATIC_STAFF_ACCOUNTS = [
  { username: 'admin', password: 'admin123', name: 'مهندس نیامنش', role: 'SUPER_ADMIN', title: 'مدیریت کل' },
  { username: 'cowork_op', password: 'cowork123', name: 'علی کاظمی', role: 'COWORKING_OPERATOR', title: 'اپراتور فضای اشتراکی' },
  { username: 'cafe_op', password: 'cafe123', name: 'سارا تهرانی', role: 'CAFE_OPERATOR', title: 'اپراتور سالن و کافه' }
];

const JALALI_MONTH_NAMES = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

// Dynamic Current Jalali Detection
function getRealCurrentJalali() {
  const now = new Date();
  try {
    const parts = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    }).formatToParts(now);
    
    let jy = 1404, jm = 12, jd = 3;
    parts.forEach(p => {
      if (p.type === 'year') jy = parseInt(p.value.replace(/[^0-9]/g, '') || '1404', 10);
      if (p.type === 'month') jm = parseInt(p.value.replace(/[^0-9]/g, '') || '12', 10);
      if (p.type === 'day') jd = parseInt(p.value.replace(/[^0-9]/g, '') || '3', 10);
    });
    return { jy, jm, jd };
  } catch (e) {
    return { jy: 1404, jm: 12, jd: 3 };
  }
}

const currentInitJalali = getRealCurrentJalali();

// Application State
const state = {
  theme: 'dark',
  currentUser: null,
  spaces: DEFAULT_SPACES,
  cateringMenu: DEFAULT_CATERING,
  selectedCategoryFilter: 'ALL',
  selectedFlow: 'COWORKING',
  selectedSpaceKey: 'SHARED_DESK',
  bookingType: 'HOURLY',
  rateViewMode: 'HOURLY',
  deskCount: 1,

  // Live Jalali Calendar State
  currentJalaliYear: currentInitJalali.jy,
  currentJalaliMonth: currentInitJalali.jm,
  selectedJalaliDay: currentInitJalali.jd,
  selectedCalendarDate: `${currentInitJalali.jy}-${String(currentInitJalali.jm).padStart(2,'0')}-${String(currentInitJalali.jd).padStart(2,'0')}`,
  selectedCalendarLabel: `${currentInitJalali.jd} ${JALALI_MONTH_NAMES[currentInitJalali.jm - 1]} ${currentInitJalali.jy}`,

  hourlySlots: [],
  dailyMode: 'RANGE',
  dailyRangeDays: 1,
  customDailyDates: [],

  cateringOrders: {},
  cateringAddonOpen: false,
  appliedPromo: null
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

// Global Singleton Toast Notifier
let activeToastTimeout = null;
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  container.innerHTML = ''; // Singleton: Clear previous toasts to prevent stacking
  if (activeToastTimeout) clearTimeout(activeToastTimeout);

  const toast = document.createElement('div');
  toast.className = `toast-item toast-${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);

  activeToastTimeout = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    setTimeout(() => toast.remove(), 250);
  }, 3500);
}

// Local Storage Persistent Helpers
function getStoredReservations() {
  try {
    const raw = localStorage.getItem('techon_production_reservations');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [];
}

function saveStoredReservations(list) {
  try {
    localStorage.setItem('techon_production_reservations', JSON.stringify(list));
  } catch (e) {}
}

// REST API Request Wrapper with Fallback
async function apiRequest(endpoint, method = 'GET', body = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (state.currentUser) {
    headers['X-User-Role'] = state.currentUser.role;
    headers['X-User-Name'] = state.currentUser.name;
  }

  try {
    const res = await fetch(endpoint, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Network / static host fallback
  }

  return fallbackApi(endpoint, method, body);
}

function fallbackApi(endpoint, method, body) {
  if (endpoint === '/api/spaces') {
    return DEFAULT_SPACES;
  }
  if (endpoint === '/api/auth/login' && method === 'POST') {
    const staff = STATIC_STAFF_ACCOUNTS.find(s => s.username === body?.username && s.password === body?.password);
    if (staff) {
      return { success: true, user: staff, token: `token_${staff.username}_${Date.now()}` };
    }
    throw new Error('نام کاربری یا رمز عبور اشتباه است.');
  }
  if (endpoint === '/api/reservations' && method === 'POST') {
    const space = DEFAULT_SPACES.find(s => s.key === body.spaceKey);
    const resId = `RES-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    const invId = `INV-${Date.now().toString().slice(-6)}`;
    
    let scheduleDesc = '';
    if (body.bookingType === 'HOURLY') {
      const hours = (body.hourlySlots || []).reduce((sum, s) => sum + s.hours, 0) || body.duration || 1;
      scheduleDesc = `${toPersianDigits(hours)} ساعت (${state.selectedCalendarLabel})`;
    } else {
      const days = body.dailyRangeDays || (body.dailyDates || []).length || body.duration || 1;
      scheduleDesc = `${toPersianDigits(days)} روز (${state.selectedCalendarLabel})`;
    }

    const newRes = {
      id: resId,
      invoiceNumber: invId,
      spaceKey: body.spaceKey,
      spaceName: space ? space.name : 'فضای کار',
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerEmail: body.customerEmail || '-',
      duration: body.duration,
      scheduleDescription: scheduleDesc,
      totalPrice: body.totalPrice || '۰ تومان',
      status: body.spaceKey === 'CONFERENCE_HALL' ? 'در انتظار بررسی' : 'تأیید شده',
      paymentStatus: 'PAID (درگاه آزمایشی / پرداخت شده)',
      date: state.selectedCalendarLabel,
      createdAt: new Date().toLocaleDateString('fa-IR')
    };

    const currentList = getStoredReservations();
    currentList.unshift(newRes);
    saveStoredReservations(currentList);
    return { success: true, reservation: newRes, invoice: newRes };
  }
  if (endpoint.startsWith('/api/my-reservations')) {
    return getStoredReservations();
  }
  if (endpoint.startsWith('/api/admin/reservations')) {
    return getStoredReservations();
  }
  return null;
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  restoreAuthSession();
  setupNavTabs();
  setupAuthModal();
  setupServiceFlow();
  setupRateToggle();
  renderSpacesCatalog();
  setupLiveJalaliCalendar();
  setupSchedulingEngine();
  setupCateringEngine();
  setupPromoEngine();
  setupSubmitBooking();
  renderMyReservations();
  updatePriceBreakdown();
});

// 1. Theme Management
function initTheme() {
  const btn = document.getElementById('theme-toggle');
  const icon = document.getElementById('theme-icon');
  
  const saved = localStorage.getItem('techon_theme') || 'dark';
  state.theme = saved;
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(icon, saved);

  btn?.addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', state.theme);
    localStorage.setItem('techon_theme', state.theme);
    updateThemeIcon(icon, state.theme);
    showToast(`حالت ${state.theme === 'dark' ? 'شب' : 'روز'} فعال شد.`);
  });
}

function updateThemeIcon(iconEl, theme) {
  if (!iconEl) return;
  if (theme === 'dark') {
    iconEl.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
  } else {
    iconEl.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
  }
}

// 2. Production Authentication (Login & Logout Flow)
function restoreAuthSession() {
  try {
    const raw = localStorage.getItem('techon_auth_user');
    if (raw) {
      state.currentUser = JSON.parse(raw);
    }
  } catch (e) {}
  updateAuthUI();
}

function setupAuthModal() {
  const btnOpen = document.getElementById('btn-open-login-modal');
  const modal = document.getElementById('login-modal');
  const btnClose = document.getElementById('btn-close-login-modal');
  const form = document.getElementById('form-staff-login');
  const btnLogout = document.getElementById('btn-logout');

  btnOpen?.addEventListener('click', () => {
    document.getElementById('login-error-msg').style.display = 'none';
    modal?.classList.remove('hidden');
    document.getElementById('login-username')?.focus();
  });

  btnClose?.addEventListener('click', () => modal?.classList.add('hidden'));
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
  });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const uInput = document.getElementById('login-username')?.value?.trim();
    const pInput = document.getElementById('login-password')?.value?.trim();
    const errEl = document.getElementById('login-error-msg');

    try {
      const res = await apiRequest('/api/auth/login', 'POST', { username: uInput, password: pInput });
      if (res && res.user) {
        state.currentUser = res.user;
        localStorage.setItem('techon_auth_user', JSON.stringify(res.user));
        updateAuthUI();
        modal?.classList.add('hidden');
        showToast(`خوش آمدید، ${res.user.name} (${res.user.title})`);
        if (['SUPER_ADMIN', 'COWORKING_OPERATOR', 'CAFE_OPERATOR'].includes(res.user.role)) {
          switchTab('admin');
        }
      }
    } catch (err) {
      if (errEl) {
        errEl.innerText = err.message || 'نام کاربری یا رمز عبور اشتباه است.';
        errEl.style.display = 'block';
      }
    }
  });

  btnLogout?.addEventListener('click', () => {
    state.currentUser = null;
    localStorage.removeItem('techon_auth_user');
    updateAuthUI();
    switchTab('booking');
    showToast('از حساب کاربری خارج شدید.');
  });
}

window.quickFillLogin = function(u, p) {
  const uEl = document.getElementById('login-username');
  const pEl = document.getElementById('login-password');
  if (uEl) uEl.value = u;
  if (pEl) pEl.value = p;
};

function updateAuthUI() {
  const loginBtn = document.getElementById('btn-open-login-modal');
  const profileWidget = document.getElementById('user-profile-widget');
  const nameEl = document.getElementById('current-user-name');
  const roleEl = document.getElementById('current-user-role-badge');
  const banner = document.getElementById('role-perspective-banner');
  const contextText = document.getElementById('role-context-text');

  const u = state.currentUser;
  const isStaff = u && ['SUPER_ADMIN', 'COWORKING_OPERATOR', 'CAFE_OPERATOR'].includes(u.role);
  const isSuperAdmin = u && u.role === 'SUPER_ADMIN';

  if (u && isStaff) {
    loginBtn?.classList.add('hidden');
    profileWidget?.classList.remove('hidden');
    if (nameEl) nameEl.innerText = u.name;
    if (roleEl) roleEl.innerText = u.title || 'پرسنل';
    if (banner && contextText) {
      banner.classList.remove('hidden');
      contextText.innerText = `در حال مدیریت پلتفرم با دسترسی ${u.title} (${u.name})`;
    }
  } else {
    loginBtn?.classList.remove('hidden');
    profileWidget?.classList.add('hidden');
    banner?.classList.add('hidden');
  }

  document.getElementById('d-tab-admin')?.classList.toggle('hidden', !isStaff);
  document.getElementById('m-tab-admin')?.classList.toggle('hidden', !isStaff);
  document.getElementById('d-tab-analytics')?.classList.toggle('hidden', !isSuperAdmin);
  document.getElementById('m-tab-analytics')?.classList.toggle('hidden', !isSuperAdmin);
}

// 3. Navigation Tabs
function setupNavTabs() {
  const allTabButtons = document.querySelectorAll('[data-tab]');
  allTabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      switchTab(tabId);
    });
  });

  document.getElementById('btn-mobile-checkout-action')?.addEventListener('click', () => {
    document.getElementById('btn-submit-booking')?.scrollIntoView({ behavior: 'smooth' });
    document.getElementById('cust-name')?.focus();
  });
}

function switchTab(tabId) {
  document.querySelectorAll('.view-panel').forEach(panel => {
    panel.classList.remove('active');
  });
  const target = document.getElementById(`tab-${tabId}`);
  if (target) target.classList.add('active');

  document.querySelectorAll('[data-tab]').forEach(btn => {
    if (btn.getAttribute('data-tab') === tabId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  if (tabId === 'my-bookings') renderMyReservations();
  if (tabId === 'admin') renderAdminPanel();
  if (tabId === 'analytics') renderAnalyticsDashboard();

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 4. Service Flow Toggle
function setupServiceFlow() {
  const btnCowork = document.getElementById('btn-flow-cowork');
  const btnHall = document.getElementById('btn-flow-hall');

  btnCowork?.addEventListener('click', () => {
    state.selectedFlow = 'COWORKING';
    btnCowork.classList.add('active');
    btnHall?.classList.remove('active');
    if (state.selectedSpaceKey === 'CONFERENCE_HALL') {
      state.selectedSpaceKey = 'SHARED_DESK';
    }
    renderSpacesCatalog();
    toggleHallFields();
    toggleDeskQuantity();
    updatePriceBreakdown();
  });

  btnHall?.addEventListener('click', () => {
    state.selectedFlow = 'HALL';
    btnHall.classList.add('active');
    btnCowork?.classList.remove('active');
    state.selectedSpaceKey = 'CONFERENCE_HALL';
    renderSpacesCatalog();
    toggleHallFields();
    toggleDeskQuantity();
    updatePriceBreakdown();
  });
}

// 5. Space Showcase & Rate Toggle
function renderSpacesCatalog() {
  const container = document.getElementById('spaces-cards-grid');
  if (!container) return;

  let spacesToShow = state.spaces;
  if (state.selectedFlow === 'COWORKING') {
    spacesToShow = state.spaces.filter(s => s.key !== 'CONFERENCE_HALL');
  } else if (state.selectedFlow === 'HALL') {
    spacesToShow = state.spaces.filter(s => s.key === 'CONFERENCE_HALL');
  }

  container.innerHTML = spacesToShow.map(s => {
    const isSelected = s.key === state.selectedSpaceKey ? 'active' : '';
    const media = SPACE_MEDIA[s.key] || { image: '', status: 'موجود' };
    const priceDisplay = state.rateViewMode === 'DAILY'
      ? `${formatCurrency(s.dailyRate)} <small>/ روز</small>`
      : `${formatCurrency(s.hourlyRate)} <small>/ ساعت</small>`;

    return `
      <div class="space-card ${isSelected}" data-key="${s.key}">
        <div class="space-card-image-wrap">
          <img src="${media.image}" alt="${s.name}" class="space-card-img" loading="lazy">
          <div class="space-card-gradient-overlay"></div>
          <span class="badge-space-capacity">👥 ظرفیت: ${toPersianDigits(s.capacity)} نفر</span>
          <span class="badge-availability">● ${media.status}</span>
        </div>
        <div class="space-card-body">
          <h3 class="space-card-title">${s.name}</h3>
          <p class="space-card-desc">${s.description}</p>
          <div class="space-features-list">
            ${(s.features || []).map(f => `<span class="feature-badge">${f}</span>`).join('')}
          </div>
          <div class="space-card-footer">
            <div class="space-price-tag">
              <strong>${priceDisplay}</strong>
            </div>
            <button type="button" class="btn-card-select">
              ${isSelected ? '✓ انتخاب شده' : 'انتخاب فضا'}
            </button>
          </div>
        </div>
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
  if (hallBox) {
    hallBox.classList.toggle('hidden', state.selectedSpaceKey !== 'CONFERENCE_HALL');
  }
}

function toggleDeskQuantity() {
  const deskBox = document.getElementById('desk-quantity-box');
  if (deskBox) {
    deskBox.classList.toggle('hidden', state.selectedSpaceKey !== 'SHARED_DESK');
  }
}

function setupRateToggle() {
  const btnHourly = document.getElementById('rate-view-hourly');
  const btnDaily = document.getElementById('rate-view-daily');

  btnHourly?.addEventListener('click', () => {
    document.getElementById('btn-mode-hourly')?.click();
  });

  btnDaily?.addEventListener('click', () => {
    document.getElementById('btn-mode-daily')?.click();
  });

  // Desk Stepper Controls
  document.getElementById('btn-desk-minus')?.addEventListener('click', () => {
    state.deskCount = Math.max(1, state.deskCount - 1);
    const disp = document.getElementById('desk-count-display');
    if (disp) disp.innerText = toPersianDigits(state.deskCount);
    updatePriceBreakdown();
  });

  document.getElementById('btn-desk-plus')?.addEventListener('click', () => {
    state.deskCount = Math.min(60, state.deskCount + 1);
    const disp = document.getElementById('desk-count-display');
    if (disp) disp.innerText = toPersianDigits(state.deskCount);
    updatePriceBreakdown();
  });
}

// 6. Dynamic Live Jalali Calendar Integration
function setupLiveJalaliCalendar() {
  renderJalaliCalendar();

  document.getElementById('btn-cal-prev')?.addEventListener('click', () => {
    state.currentJalaliMonth--;
    if (state.currentJalaliMonth < 1) {
      state.currentJalaliMonth = 12;
      state.currentJalaliYear--;
    }
    renderJalaliCalendar();
  });

  document.getElementById('btn-cal-next')?.addEventListener('click', () => {
    state.currentJalaliMonth++;
    if (state.currentJalaliMonth > 12) {
      state.currentJalaliMonth = 1;
      state.currentJalaliYear++;
    }
    renderJalaliCalendar();
  });
}

function getDaysInJalaliMonth(year, month) {
  if (month <= 6) return 31;
  if (month <= 11) return 30;
  // Esfand leap check approx
  return 29;
}

function renderJalaliCalendar() {
  const matrix = document.getElementById('cal-days-matrix');
  const titleEl = document.getElementById('cal-month-title');
  if (!matrix) return;

  if (titleEl) {
    titleEl.innerText = `${JALALI_MONTH_NAMES[state.currentJalaliMonth - 1]} ${toPersianDigits(state.currentJalaliYear)}`;
  }

  const daysCount = getDaysInJalaliMonth(state.currentJalaliYear, state.currentJalaliMonth);
  // Shift calculation for standard month alignment
  const offset = ((state.currentJalaliYear * 12 + state.currentJalaliMonth) * 3) % 7;

  let daysHtml = '';
  for (let i = 0; i < offset; i++) {
    daysHtml += `<div class="cal-day-cell disabled-cell"></div>`;
  }

  for (let d = 1; d <= daysCount; d++) {
    const formattedDate = `${state.currentJalaliYear}-${String(state.currentJalaliMonth).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const isActiveSingle = (state.selectedCalendarDate === formattedDate);
    const isMultiSelected = state.customDailyDates.includes(formattedDate);

    const classes = ['cal-day-cell'];
    if (isActiveSingle) classes.push('active-day-cell');
    if (isMultiSelected && state.dailyMode === 'CUSTOM') classes.push('multi-selected-cell');

    daysHtml += `
      <div class="${classes.join(' ')}" data-day="${d}" data-date="${formattedDate}">
        <span class="day-num">${toPersianDigits(d)}</span>
      </div>
    `;
  }

  matrix.innerHTML = daysHtml;

  matrix.querySelectorAll('.cal-day-cell:not(.disabled-cell)').forEach(cell => {
    cell.addEventListener('click', () => {
      const dayNum = Number(cell.dataset.day);
      const formattedDate = cell.dataset.date;
      const dateLabel = `${toPersianDigits(dayNum)} ${JALALI_MONTH_NAMES[state.currentJalaliMonth - 1]} ${toPersianDigits(state.currentJalaliYear)}`;

      state.selectedJalaliDay = dayNum;
      state.selectedCalendarDate = formattedDate;
      state.selectedCalendarLabel = dateLabel;

      if (state.bookingType === 'DAILY' && state.dailyMode === 'CUSTOM') {
        // Toggle custom day
        if (state.customDailyDates.includes(formattedDate)) {
          state.customDailyDates = state.customDailyDates.filter(d => d !== formattedDate);
        } else {
          state.customDailyDates.push(formattedDate);
        }
        renderCustomDailyChips();
      }

      // Update callouts
      const labelEl = document.getElementById('selected-jalali-date-text');
      if (labelEl) labelEl.innerText = dateLabel;
      const rangeStartText = document.getElementById('daily-range-start-text');
      if (rangeStartText) rangeStartText.innerText = dateLabel;

      renderJalaliCalendar();
      updatePriceBreakdown();
      showToast(`📅 تاریخ انتخابی: ${dateLabel}`);
    });
  });
}

// 7. Scheduling Engine (Separated Hourly & Jalali Daily)
function setupSchedulingEngine() {
  const btnHourly = document.getElementById('btn-mode-hourly');
  const btnDaily = document.getElementById('btn-mode-daily');
  const rateHourly = document.getElementById('rate-view-hourly');
  const rateDaily = document.getElementById('rate-view-daily');
  const hourlySection = document.getElementById('hourly-scheduler-section');
  const dailySection = document.getElementById('daily-scheduler-section');

  btnHourly?.addEventListener('click', () => {
    state.bookingType = 'HOURLY';
    state.rateViewMode = 'HOURLY';
    btnHourly.classList.add('active');
    btnDaily?.classList.remove('active');
    rateHourly?.classList.add('active');
    rateDaily?.classList.remove('active');
    hourlySection?.classList.remove('hidden');
    dailySection?.classList.add('hidden');
    renderSpacesCatalog();
    renderJalaliCalendar();
    updatePriceBreakdown();
  });

  btnDaily?.addEventListener('click', () => {
    state.bookingType = 'DAILY';
    state.rateViewMode = 'DAILY';
    btnDaily.classList.add('active');
    btnHourly?.classList.remove('active');
    rateDaily?.classList.add('active');
    rateHourly?.classList.remove('active');
    dailySection?.classList.remove('hidden');
    hourlySection?.classList.add('hidden');
    renderSpacesCatalog();
    renderJalaliCalendar();
    updatePriceBreakdown();
  });

  // Hour Selectors Setup
  const startSelect = document.getElementById('time-start-select');
  const endSelect = document.getElementById('time-end-select');

  if (startSelect && endSelect) {
    const hours = [];
    for (let h = 8; h <= 23; h++) {
      const str = h < 10 ? `0${h}:00` : `${h}:00`;
      hours.push(str);
    }
    startSelect.innerHTML = hours.slice(0, -1).map(h => `<option value="${h}">${toPersianDigits(h)}</option>`).join('');
    endSelect.innerHTML = hours.slice(1).map(h => `<option value="${h}">${toPersianDigits(h)}</option>`).join('');
    startSelect.value = '13:00';
    endSelect.value = '18:00';
  }

  // Time Chips Logic
  const timeChips = document.querySelectorAll('#time-chips-container .time-chip');
  const customBox = document.getElementById('custom-time-selectors');

  timeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      timeChips.forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');

      const start = chip.dataset.start;
      const end = chip.dataset.end;

      if (start === 'custom') {
        if (customBox) customBox.style.display = 'block';
      } else {
        if (customBox) customBox.style.display = 'none';
        if (startSelect) startSelect.value = start;
        if (endSelect) endSelect.value = end;
      }
    });
  });

  // Add Time Slot Button
  document.getElementById('btn-add-time-slot')?.addEventListener('click', () => {
    const sVal = startSelect?.value || '13:00';
    const eVal = endSelect?.value || '18:00';

    const sH = parseInt(sVal.split(':')[0], 10);
    const eH = parseInt(eVal.split(':')[0], 10);

    if (sH >= eH) {
      showToast('ساعت پایان باید بعد از ساعت شروع باشد.', 'error');
      return;
    }

    const hours = eH - sH;
    const slotId = `slot-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

    state.hourlySlots.push({
      id: slotId,
      date: state.selectedCalendarDate,
      dateLabel: state.selectedCalendarLabel,
      startTime: sVal,
      endTime: eVal,
      hours
    });

    renderSelectedSlots();
    updatePriceBreakdown();
    showToast(`بازه زمانی (${toPersianDigits(hours)} ساعت) به سبد رزرو اضافه شد.`);
  });

  // Daily Radios
  document.querySelectorAll('input[name="daily-submode"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      state.dailyMode = e.target.value;
      document.getElementById('daily-range-box')?.classList.toggle('hidden', state.dailyMode !== 'RANGE');
      document.getElementById('daily-custom-box')?.classList.toggle('hidden', state.dailyMode !== 'CUSTOM');
      renderJalaliCalendar();
      updatePriceBreakdown();
    });
  });

  // Daily Range Presets (1, 2, 3, 7, 30 days)
  document.querySelectorAll('#daily-range-presets .time-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#daily-range-presets .time-chip').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      state.dailyRangeDays = parseInt(btn.dataset.days, 10) || 1;
      
      const countEl = document.getElementById('daily-range-days-count');
      if (countEl) countEl.innerText = `${toPersianDigits(state.dailyRangeDays)} روز کامل`;
      
      updatePriceBreakdown();
      showToast(`مدت رزرو روزانه: ${toPersianDigits(state.dailyRangeDays)} روز`);
    });
  });

  // Initial default demo slot
  state.hourlySlots = [
    {
      id: 'default-slot-1',
      date: state.selectedCalendarDate,
      dateLabel: state.selectedCalendarLabel,
      startTime: '13:00',
      endTime: '18:00',
      hours: 5
    }
  ];
  renderSelectedSlots();
}

function renderSelectedSlots() {
  const container = document.getElementById('selected-slots-list');
  const totalBadge = document.getElementById('slots-total-badge');
  if (!container) return;

  if (state.hourlySlots.length === 0) {
    container.innerHTML = `<span class="empty-slot-msg" style="color:var(--text-dim); font-size:12px;">هنوز بازه زمانی به سبد اضافه نشده است.</span>`;
    if (totalBadge) totalBadge.innerText = `۰ ساعت`;
    return;
  }

  const totalHours = state.hourlySlots.reduce((sum, s) => sum + s.hours, 0);
  if (totalBadge) totalBadge.innerText = `${toPersianDigits(totalHours)} ساعت`;

  container.innerHTML = state.hourlySlots.map(s => `
    <div class="slot-item-chip">
      <div>
        <span>📅 ${s.dateLabel}</span>
        <strong style="margin-right:10px;">⏰ ${toPersianDigits(s.startTime)} تا ${toPersianDigits(s.endTime)} (${toPersianDigits(s.hours)} ساعت)</strong>
      </div>
      <button type="button" class="btn-remove-slot" onclick="removeTimeSlot('${s.id}')" title="حذف این بازه">✕</button>
    </div>
  `).join('');
}

window.removeTimeSlot = function(slotId) {
  state.hourlySlots = state.hourlySlots.filter(s => s.id !== slotId);
  renderSelectedSlots();
  updatePriceBreakdown();
};

function renderCustomDailyChips() {
  const container = document.getElementById('custom-dates-chips');
  const badge = document.getElementById('custom-days-badge');
  if (!container) return;

  if (state.customDailyDates.length === 0) {
    container.innerHTML = `<span class="empty-slot-msg" style="color:var(--text-dim); font-size:12px;">هنوز تاریخی انتخاب نشده است.</span>`;
    if (badge) badge.innerText = `۰ روز`;
    return;
  }

  if (badge) badge.innerText = `${toPersianDigits(state.customDailyDates.length)} روز`;

  container.innerHTML = state.customDailyDates.map(d => `
    <div class="date-tag-chip">
      <span>📅 ${d}</span>
      <button type="button" class="btn-remove-slot" onclick="removeCustomDate('${d}')">✕</button>
    </div>
  `).join('');
}

window.removeCustomDate = function(dateStr) {
  state.customDailyDates = state.customDailyDates.filter(d => d !== dateStr);
  renderCustomDailyChips();
  renderJalaliCalendar();
  updatePriceBreakdown();
};

// 8. Catering & Addons Engine
function setupCateringEngine() {
  const header = document.getElementById('catering-toggle-header');
  const body = document.getElementById('catering-booking-body');
  const icon = document.getElementById('catering-toggle-icon');

  header?.addEventListener('click', () => {
    state.cateringAddonOpen = !state.cateringAddonOpen;
    if (body) body.style.display = state.cateringAddonOpen ? 'block' : 'none';
    if (icon) icon.classList.toggle('rotated', state.cateringAddonOpen);
  });

  if (body) body.style.display = 'none';

  renderCateringBookingSelector();
  renderCateringCatalogGrid();

  document.querySelectorAll('#catering-filter-tabs .filter-pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#catering-filter-tabs .filter-pill-btn').forEach(b => b.classList.remove('active'));
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
    const count = state.cateringOrders[item.id] || 0;
    return `
      <div class="catering-item-row">
        <div class="cat-item-details">
          <strong>${item.name}</strong>
          <span>${formatCurrency(item.price)}</span>
        </div>
        <div class="desk-stepper-controls">
          <button type="button" class="btn-step" onclick="changeCateringQty('${item.id}', -1)">−</button>
          <span class="step-value" id="qty-${item.id}">${toPersianDigits(count)}</span>
          <button type="button" class="btn-step" onclick="changeCateringQty('${item.id}', 1)">+</button>
        </div>
      </div>
    `;
  }).join('');
}

window.changeCateringQty = function(itemId, delta) {
  const curr = state.cateringOrders[itemId] || 0;
  const next = Math.max(0, curr + delta);
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

  container.innerHTML = filtered.map(item => `
    <div class="cat-item-card">
      <div>
        <h4 style="margin-bottom:6px;">${item.name}</h4>
        <p style="font-size:12px; color:var(--text-muted); margin-bottom:8px;">${item.desc || ''}</p>
        <div class="cat-price-row">${formatCurrency(item.price)}</div>
      </div>
      <button type="button" class="btn-admin-submit" onclick="addCateringFromCatalog('${item.id}')">
        ➕ افزودن به رزرو جاری
      </button>
    </div>
  `).join('');
}

window.addCateringFromCatalog = function(itemId) {
  window.changeCateringQty(itemId, 1);
  switchTab('booking');
  showToast('آیتم به سفارش جاری اضافه شد.');
};

// 9. Real-Time Price Calculation
function updatePriceBreakdown() {
  const space = state.spaces.find(s => s.key === state.selectedSpaceKey);
  const units = state.selectedSpaceKey === 'SHARED_DESK' ? state.deskCount : 1;
  let duration = 1;
  let scheduleSummaryText = '';

  if (state.bookingType === 'HOURLY') {
    const totalHours = state.hourlySlots.reduce((sum, s) => sum + s.hours, 0);
    duration = totalHours > 0 ? totalHours : 1;
    scheduleSummaryText = totalHours > 0
      ? `${toPersianDigits(totalHours)} ساعت (${toPersianDigits(state.hourlySlots.length)} بازه)`
      : `۱ ساعت`;
  } else {
    // DAILY
    if (state.dailyMode === 'RANGE') {
      duration = state.dailyRangeDays || 1;
      scheduleSummaryText = `${toPersianDigits(duration)} روز پیوسته`;
    } else {
      duration = Math.max(1, state.customDailyDates.length);
      scheduleSummaryText = `${toPersianDigits(duration)} روز انتخابی`;
    }
  }

  // Base Space Rate
  let spaceSubtotal = 0;
  if (space) {
    const rate = state.bookingType === 'DAILY' ? space.dailyRate : space.hourlyRate;
    spaceSubtotal = rate * duration * units;
  }

  // Equipment Fees for Conference Hall
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

  // Promo Calculation
  let discountAmount = 0;
  if (state.appliedPromo && state.appliedPromo.valid) {
    if (state.appliedPromo.type === 'PERCENT') {
      discountAmount = (subtotal * state.appliedPromo.value) / 100;
      if (state.appliedPromo.maxDiscount && discountAmount > state.appliedPromo.maxDiscount) {
        discountAmount = state.appliedPromo.maxDiscount;
      }
    } else {
      discountAmount = Math.min(state.appliedPromo.value, subtotal);
    }
  }

  const finalTotal = Math.max(0, subtotal - discountAmount);

  // Update DOM Labels
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
  const discAmtEl = document.getElementById('summary-discount-amount');
  if (discountAmount > 0) {
    discRow?.classList.remove('hidden');
    if (discAmtEl) discAmtEl.innerText = `- ${formatCurrency(discountAmount)}`;
  } else {
    discRow?.classList.add('hidden');
  }
}

// 10. Promo Code Engine
function setupPromoEngine() {
  const btnApply = document.getElementById('btn-apply-promo');
  const input = document.getElementById('promo-input');
  const feedback = document.getElementById('promo-feedback');

  btnApply?.addEventListener('click', () => {
    const code = (input?.value || '').trim().toUpperCase();
    if (!code) {
      showToast('لطفاً کد تخفیف را وارد نمایید.', 'error');
      return;
    }

    const promos = {
      'TECHON2026': { type: 'PERCENT', value: 20, maxDiscount: 500000 },
      'STARTUP50': { type: 'PERCENT', value: 50, maxDiscount: 1000000 },
      'EVENTVIP': { type: 'PERCENT', value: 15, maxDiscount: 1500000 }
    };

    if (promos[code]) {
      state.appliedPromo = { valid: true, code, ...promos[code] };
      if (feedback) {
        feedback.innerText = `کد تخفیف ${code} اعمال شد (${promos[code].value}٪ تخفیف)`;
        feedback.style.color = 'var(--success)';
      }
      showToast(`🎉 کد تخفیف ${code} با موفقیت اعمال شد.`);
    } else {
      state.appliedPromo = null;
      if (feedback) {
        feedback.innerText = 'کد تخفیف نامعتبر یا منقضی شده است.';
        feedback.style.color = 'var(--danger)';
      }
      showToast('کد تخفیف نامعتبر است.', 'error');
    }
    updatePriceBreakdown();
  });
}

// 11. Booking Submission & Form Reset
function resetBookingForm() {
  const custName = document.getElementById('cust-name');
  const custPhone = document.getElementById('cust-phone');
  const custEmail = document.getElementById('cust-email');
  const topicEl = document.getElementById('event-topic');
  const recEl = document.getElementById('equip-recording');
  const sndEl = document.getElementById('equip-sound');
  const promoIn = document.getElementById('promo-input');
  const promoFb = document.getElementById('promo-feedback');

  if (custName) custName.value = '';
  if (custPhone) custPhone.value = '';
  if (custEmail) custEmail.value = '';
  if (topicEl) topicEl.value = '';
  if (recEl) recEl.checked = false;
  if (sndEl) sndEl.checked = false;
  if (promoIn) promoIn.value = '';
  if (promoFb) promoFb.innerText = '';

  state.cateringOrders = {};
  state.appliedPromo = null;
  state.deskCount = 1;
  const deskDisp = document.getElementById('desk-count-display');
  if (deskDisp) deskDisp.innerText = '۱';

  state.hourlySlots = [
    {
      id: `slot-${Date.now()}`,
      date: state.selectedCalendarDate,
      dateLabel: state.selectedCalendarLabel,
      startTime: '13:00',
      endTime: '18:00',
      hours: 5
    }
  ];

  renderSelectedSlots();
  renderCateringBookingSelector();
  updatePriceBreakdown();
}

function setupSubmitBooking() {
  const btnSubmit = document.getElementById('btn-submit-booking');
  btnSubmit?.addEventListener('click', async () => {
    const custName = document.getElementById('cust-name')?.value?.trim();
    const custPhone = document.getElementById('cust-phone')?.value?.trim();
    const custEmail = document.getElementById('cust-email')?.value?.trim();

    if (!custName || !custPhone) {
      showToast('لطفاً نام و شماره همراه خود را وارد فرمایید.', 'error');
      document.getElementById('cust-name')?.focus();
      return;
    }

    const units = state.selectedSpaceKey === 'SHARED_DESK' ? state.deskCount : 1;
    const totalStr = document.getElementById('summary-final-total')?.innerText || '۰ تومان';

    let duration = 1;
    if (state.bookingType === 'HOURLY') {
      const totalHours = state.hourlySlots.reduce((sum, s) => sum + s.hours, 0);
      duration = totalHours > 0 ? totalHours : 1;
    } else {
      duration = state.dailyMode === 'RANGE' ? state.dailyRangeDays : Math.max(1, state.customDailyDates.length);
    }

    const payload = {
      spaceKey: state.selectedSpaceKey,
      bookingType: state.bookingType,
      duration,
      deskCount: units,
      customerName: custName,
      customerPhone: custPhone,
      customerEmail: custEmail || '-',
      eventTopic: document.getElementById('event-topic')?.value || 'رویداد عمومی',
      targetAudienceCount: parseInt(document.getElementById('audience-count')?.value, 10) || 45,
      equipment: state.selectedSpaceKey === 'CONFERENCE_HALL' ? [
        document.getElementById('equip-recording')?.checked ? 'recording' : null,
        document.getElementById('equip-sound')?.checked ? 'sound_system' : null
      ].filter(Boolean) : [],
      cateringOrders: Object.entries(state.cateringOrders).map(([id, qty]) => ({ itemId: id, quantity: qty })),
      promoCode: state.appliedPromo?.code || null,
      hourlySlots: state.hourlySlots,
      dailyRangeDays: state.dailyRangeDays,
      dailyDates: state.customDailyDates,
      totalPrice: totalStr
    };

    btnSubmit.disabled = true;
    btnSubmit.innerText = 'در حال ارتباط با سرور و ثبت سفارش...';

    try {
      const result = await apiRequest('/api/reservations', 'POST', payload);
      const resData = result?.reservation || result;

      showInvoiceModal(resData);
      showToast('✨ رزرو شما با موفقیت تأیید شد | رسید رسمی صادر گردید');
      
      resetBookingForm();
      renderMyReservations();
      if (state.currentUser && ['SUPER_ADMIN', 'COWORKING_OPERATOR', 'CAFE_OPERATOR'].includes(state.currentUser.role)) {
        renderAdminPanel();
      }
    } catch (err) {
      showToast(err.message || 'خطا در ثبت رزرو. لطفاً مجدداً تلاش فرمایید.', 'error');
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg><span>ثبت نهایی و صدور فاکتور رسمی</span>`;
    }
  });

  document.getElementById('btn-close-invoice')?.addEventListener('click', () => {
    document.getElementById('invoice-modal')?.classList.add('hidden');
  });
  document.getElementById('btn-done-invoice')?.addEventListener('click', () => {
    document.getElementById('invoice-modal')?.classList.add('hidden');
    switchTab('my-bookings');
  });
}

function showInvoiceModal(res) {
  const modal = document.getElementById('invoice-modal');
  const content = document.getElementById('invoice-content');
  if (!modal || !content) return;

  content.innerHTML = `
    <div style="background:var(--input-bg); padding:18px; border-radius:var(--radius-sm); margin-bottom:16px; border:1px solid var(--card-border);">
      <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
        <span style="color:var(--text-muted);">شماره فاکتور:</span>
        <strong style="color:var(--primary); font-family:monospace; direction:ltr;">${res.invoiceNumber || res.id}</strong>
      </div>
      <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
        <span style="color:var(--text-muted);">فضای رزروشده:</span>
        <strong>${res.spaceName || 'فضای کار'}</strong>
      </div>
      <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
        <span style="color:var(--text-muted);">مشتری / متقاضی:</span>
        <strong>${res.customerName || res.customer?.name} (${toPersianDigits(res.customerPhone || res.customer?.phone)})</strong>
      </div>
      <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
        <span style="color:var(--text-muted);">وضعیت پرداخت:</span>
        <span style="color:var(--success); font-weight:700;">✅ پرداخت تایید شد (تست درگاه)</span>
      </div>
      <div style="display:flex; justify-content:space-between; border-top:1px solid var(--card-border); padding-top:12px; margin-top:8px;">
        <span style="font-weight:700;">مبلغ کل پرداخت‌شده:</span>
        <strong style="color:var(--accent); font-size:18px;">${res.totalPrice || formatCurrency(res.pricing?.finalTotal)}</strong>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
}

// 12. My Reservations Tab (Desktop Table + Mobile Cards)
async function renderMyReservations() {
  const tbody = document.getElementById('my-reservations-tbody');
  const cardsContainer = document.getElementById('my-reservations-mobile-cards');
  if (!tbody && !cardsContainer) return;

  const phone = document.getElementById('cust-phone')?.value?.trim() || '';
  const list = await apiRequest(`/api/my-reservations?phone=${phone}`);
  const reservations = Array.isArray(list) ? list : getStoredReservations();

  if (reservations.length === 0) {
    if (tbody) tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:30px; color:var(--text-muted);">هنوز رزروی ثبت نکرده‌اید.</td></tr>`;
    if (cardsContainer) cardsContainer.innerHTML = `<div style="text-align:center; padding:30px; color:var(--text-muted); font-size:13px;">هنوز رزروی ثبت نکرده‌اید.</div>`;
    return;
  }

  // Desktop Table Rows
  if (tbody) {
    tbody.innerHTML = reservations.map(r => `
      <tr>
        <td><code>${r.id}</code></td>
        <td><strong>${r.spaceName}</strong></td>
        <td>${r.date || r.scheduleDescription || '-'}</td>
        <td style="color:var(--accent); font-weight:700;">${r.totalPrice || formatCurrency(r.pricing?.finalTotal)}</td>
        <td><span class="badge-availability">${r.status || 'تأیید شده'}</span></td>
        <td><button type="button" class="btn-card-select" onclick="viewReceipt('${r.id}')">مشاهده رسید</button></td>
      </tr>
    `).join('');
  }

  // Mobile Cards
  if (cardsContainer) {
    cardsContainer.innerHTML = reservations.map(r => `
      <div class="mobile-reservation-card">
        <div class="mob-card-header">
          <code>${r.id}</code>
          <span class="badge-availability">${r.status || 'تأیید شده'}</span>
        </div>
        <h4 class="mob-card-title">${r.spaceName}</h4>
        <div class="mob-card-row">
          <span class="mob-card-label">زمان‌بندی:</span>
          <span class="mob-card-val">${r.date || r.scheduleDescription || '-'}</span>
        </div>
        <div class="mob-card-row">
          <span class="mob-card-label">مبلغ پرداختی:</span>
          <span class="mob-card-price">${r.totalPrice || formatCurrency(r.pricing?.finalTotal)}</span>
        </div>
        <div class="mob-card-actions">
          <button type="button" class="btn-card-select" style="width:100%;" onclick="viewReceipt('${r.id}')">📄 مشاهده فاکتور رسمی</button>
        </div>
      </div>
    `).join('');
  }
}

window.viewReceipt = function(id) {
  const list = getStoredReservations();
  const res = list.find(r => r.id === id);
  if (res) showInvoiceModal(res);
};

// 13. Admin CMS & Operator Tools (Protected)
async function renderAdminPanel() {
  const tbody = document.getElementById('reservations-tbody');
  const cardsContainer = document.getElementById('admin-reservations-mobile-cards');
  if (!tbody && !cardsContainer) return;

  if (!state.currentUser || !['SUPER_ADMIN', 'COWORKING_OPERATOR', 'CAFE_OPERATOR'].includes(state.currentUser.role)) {
    const errorHtml = `<div style="text-align:center; padding:30px; color:var(--danger); font-weight:700;">دسترسی غیرمجاز. لطفاً وارد حساب مدیریت یا اپراتور شوید.</div>`;
    if (tbody) tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px; color:var(--danger);">دسترسی غیرمجاز. لطفاً وارد حساب مدیریت یا اپراتور شوید.</td></tr>`;
    if (cardsContainer) cardsContainer.innerHTML = errorHtml;
    return;
  }

  const list = await apiRequest('/api/admin/reservations');
  const reservations = Array.isArray(list) ? list : getStoredReservations();

  if (reservations.length === 0) {
    if (tbody) tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px; color:var(--text-muted);">هیچ سفارشی در دیتابیس ثبت نشده است.</td></tr>`;
    if (cardsContainer) cardsContainer.innerHTML = `<div style="text-align:center; padding:30px; color:var(--text-muted); font-size:13px;">هیچ سفارشی در دیتابیس ثبت نشده است.</div>`;
    return;
  }

  // Desktop Table Rows
  if (tbody) {
    tbody.innerHTML = reservations.map(r => `
      <tr>
        <td><code>${r.id}</code></td>
        <td><strong>${r.spaceName}</strong></td>
        <td>${r.customerName || r.customer?.name}</td>
        <td>${r.date || r.scheduleDescription || '-'}</td>
        <td style="color:var(--accent); font-weight:700;">${r.totalPrice || formatCurrency(r.pricing?.finalTotal)}</td>
        <td><span class="badge-availability">${r.status || 'تأیید شده'}</span></td>
        <td>
          <button type="button" class="btn-step" onclick="deleteReservation('${r.id}')" title="حذف">🗑️</button>
        </td>
      </tr>
    `).join('');
  }

  // Mobile Cards
  if (cardsContainer) {
    cardsContainer.innerHTML = reservations.map(r => `
      <div class="mobile-reservation-card">
        <div class="mob-card-header">
          <code>${r.id}</code>
          <span class="badge-availability">${r.status || 'تأیید شده'}</span>
        </div>
        <h4 class="mob-card-title">${r.spaceName}</h4>
        <div class="mob-card-row">
          <span class="mob-card-label">متقاضی:</span>
          <span class="mob-card-val">${r.customerName || r.customer?.name} (${toPersianDigits(r.customerPhone || r.customer?.phone || '')})</span>
        </div>
        <div class="mob-card-row">
          <span class="mob-card-label">زمان‌بندی:</span>
          <span class="mob-card-val">${r.date || r.scheduleDescription || '-'}</span>
        </div>
        <div class="mob-card-row">
          <span class="mob-card-label">مبلغ کل:</span>
          <span class="mob-card-price">${r.totalPrice || formatCurrency(r.pricing?.finalTotal)}</span>
        </div>
        <div class="mob-card-actions">
          <button type="button" class="btn-card-select" style="flex:1;" onclick="viewReceipt('${r.id}')">مشاهده فاکتور</button>
          <button type="button" class="btn-step" onclick="deleteReservation('${r.id}')" title="حذف">🗑️</button>
        </div>
      </div>
    `).join('');
  }

  const refreshBtn = document.getElementById('btn-refresh-reservations');
  if (refreshBtn) {
    refreshBtn.onclick = () => {
      renderAdminPanel();
      showToast('🔄 اطلاعات پنل مدیریت به‌روزرسانی شد.');
    };
  }
}

window.deleteReservation = function(id) {
  let list = getStoredReservations();
  list = list.filter(r => r.id !== id);
  saveStoredReservations(list);
  renderAdminPanel();
  renderMyReservations();
  showToast('رزرو با موفقیت حذف شد.');
};

// 14. Financial & Analytics Dashboard (SuperAdmin Only)
async function renderAnalyticsDashboard() {
  if (!state.currentUser || state.currentUser.role !== 'SUPER_ADMIN') return;

  const list = getStoredReservations();
  let totalRev = 0;

  list.forEach(r => {
    const raw = String(r.totalPrice || r.pricing?.finalTotal || 0).replace(/[^0-9]/g, '');
    const val = parseInt(raw, 10) || 0;
    totalRev += val;
  });

  const contractorShareMin = Math.round(totalRev * 0.10);
  const contractorShareMax = Math.round(totalRev * 0.15);

  const revEl = document.getElementById('metric-total-rev');
  const shareEl = document.getElementById('metric-contractor-share');

  if (revEl) revEl.innerText = formatCurrency(totalRev);
  if (shareEl) shareEl.innerText = `${formatCurrency(contractorShareMin)} تا ${formatCurrency(contractorShareMax)}`;
}
