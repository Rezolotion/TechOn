/**
 * TechOn Platform - World-Class Smart Coworking & Reservation System
 * Version: 4.0.0
 */

// Demo Accounts Matrix
const DEMO_ACCOUNTS = [
  {
    id: 'user-cust',
    username: 'customer',
    password: 'cust123',
    name: 'مریم رضایی',
    phone: '09124444444',
    role: 'CUSTOMER',
    title: 'مشتری / متقاضی فضا',
    avatar: '👩‍💼',
    desc: 'رزرواسیون آنلاین، منوی کافه و پیگیری فاکتورها'
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
    desc: 'مدیریت ۶۰ صندلی اشتراکی، ۴ اتاق کار و ۱ اتاق جلسه'
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
    desc: 'تایید رویدادهای سالن ۷۰ نفره و مدیریت منوی کافه'
  },
  {
    id: 'user-admin',
    username: 'admin',
    password: 'admin123',
    name: 'مهندس نیامنش',
    phone: '09121111111',
    role: 'SUPER_ADMIN',
    title: 'مدیریت کل و سوپرادمین',
    avatar: '👑',
    desc: 'دسترسی کامل، ایجاد کوپن و داشبورد سهم درآمد (۱۰٪ - ۱۵٪)'
  }
];

// Space Visual Imagery Map
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

// Application State
const state = {
  theme: 'dark',
  currentUser: DEMO_ACCOUNTS[0],
  spaces: DEFAULT_SPACES,
  cateringMenu: DEFAULT_CATERING,
  selectedCategoryFilter: 'ALL',
  selectedFlow: 'COWORKING', // 'COWORKING' or 'HALL'
  selectedSpaceKey: 'SHARED_DESK',
  bookingType: 'HOURLY', // 'HOURLY' or 'DAILY'
  rateViewMode: 'HOURLY',
  deskCount: 1,
  selectedCalendarDate: '1405-05-28',
  selectedCalendarLabel: 'سه‌شنبه ۲۸ مرداد ۱۴۰۵',
  hourlySlots: [], // Array of { id, date, dateLabel, startTime, endTime, hours }
  dailyMode: 'RANGE', // 'RANGE' or 'CUSTOM'
  dailyStartDate: new Date().toISOString().slice(0, 10),
  dailyEndDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
  customDailyDates: [],
  cateringOrders: {}, // itemId -> count
  cateringAddonOpen: false,
  appliedPromo: null,
  reservations: []
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

// Toast Notifier
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast-item toast-${type}`;
  toast.innerText = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// Local Storage Wrappers for Static Mode
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

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  setupNavTabs();
  setupUserRoleModal();
  setupServiceFlow();
  setupRateToggle();
  renderSpacesCatalog();
  setupJalaliCalendar();
  setupSchedulingEngine();
  setupCateringEngine();
  setupPromoEngine();
  setupSubmitBooking();
  renderMyReservations();
  renderAdminPanel();
  renderAnalyticsDashboard();
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

// 2. Navigation Tabs (Desktop & Mobile Sync)
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

// 3. User Role Switcher & RBAC Matrix
function setupUserRoleModal() {
  const btnOpen = document.getElementById('btn-open-user-menu');
  const modal = document.getElementById('user-role-modal');
  const btnClose = document.getElementById('btn-close-role-modal');
  const rolesList = document.getElementById('roles-modal-list');

  btnOpen?.addEventListener('click', () => {
    if (rolesList) {
      rolesList.innerHTML = DEMO_ACCOUNTS.map(u => `
        <div class="role-option-card ${u.role === state.currentUser.role ? 'active' : ''}" data-role-id="${u.id}">
          <span style="font-size:24px;">${u.avatar}</span>
          <div style="flex:1;">
            <div style="display:flex; justify-content:space-between;">
              <strong>${u.name}</strong>
              <small style="color:var(--primary); font-weight:700;">${u.title}</small>
            </div>
            <small style="color:var(--text-muted);">${u.desc}</small>
          </div>
        </div>
      `).join('');

      rolesList.querySelectorAll('.role-option-card').forEach(card => {
        card.addEventListener('click', () => {
          const userObj = DEMO_ACCOUNTS.find(a => a.id === card.dataset.roleId);
          if (userObj) {
            state.currentUser = userObj;
            applyUserRole();
            modal?.classList.add('hidden');
            showToast(`نقش تغییر کرد: ${userObj.title}`);
          }
        });
      });
    }
    modal?.classList.remove('hidden');
  });

  btnClose?.addEventListener('click', () => modal?.classList.add('hidden'));
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
  });

  applyUserRole();
}

function applyUserRole() {
  const u = state.currentUser;
  const nameEl = document.getElementById('current-user-name');
  const badgeEl = document.getElementById('current-user-role-badge');
  const banner = document.getElementById('role-perspective-banner');
  const textEl = document.getElementById('role-context-text');

  if (nameEl) nameEl.innerText = u.name;
  if (badgeEl) badgeEl.innerText = u.title;

  const isAdminOrOp = ['SUPER_ADMIN', 'COWORKING_OPERATOR', 'CAFE_OPERATOR'].includes(u.role);
  const isSuperAdmin = u.role === 'SUPER_ADMIN';

  // Toggle Admin & Analytics tabs
  document.getElementById('d-tab-admin')?.classList.toggle('hidden', !isAdminOrOp);
  document.getElementById('m-tab-admin')?.classList.toggle('hidden', !isAdminOrOp);
  document.getElementById('d-tab-analytics')?.classList.toggle('hidden', !isSuperAdmin);
  document.getElementById('m-tab-analytics')?.classList.toggle('hidden', !isSuperAdmin);

  if (banner && textEl) {
    if (isAdminOrOp) {
      banner.classList.remove('hidden');
      textEl.innerText = `در حال مشاهده سیستم در نقش ${u.title} (${u.name})`;
    } else {
      banner.classList.add('hidden');
    }
  }

  // Pre-fill customer form if customer
  const custName = document.getElementById('cust-name');
  const custPhone = document.getElementById('cust-phone');
  if (custName) custName.value = u.name;
  if (custPhone) custPhone.value = u.phone;
}

// 4. Service Flow Toggle (Coworking vs Hall)
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

// 6. Jalali Calendar Integration
function setupJalaliCalendar() {
  const matrix = document.getElementById('cal-days-matrix');
  if (!matrix) return;

  const daysInMonth = 31;
  const startDayOffset = 3; // Saturday alignment offset

  let daysHtml = '';
  for (let i = 0; i < startDayOffset; i++) {
    daysHtml += `<div class="cal-day-cell disabled-cell"></div>`;
  }

  const currentDayNum = 28;

  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = d === currentDayNum;
    const isPast = d < currentDayNum - 3;
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

      showToast(`تاریخ فعال در تقویم: ${state.selectedCalendarLabel}`);
    });
  });
}

// 7. Smart Multi-Slot & Daily Scheduling Engine
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
    updatePriceBreakdown();
  });

  // Populate Hour Dropdowns (08:00 to 23:00)
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
  const timeChips = document.querySelectorAll('.time-chip');
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

  // Daily Radios & Pickers
  document.querySelectorAll('input[name="daily-submode"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      state.dailyMode = e.target.value;
      document.getElementById('daily-range-box')?.classList.toggle('hidden', state.dailyMode !== 'RANGE');
      document.getElementById('daily-custom-box')?.classList.toggle('hidden', state.dailyMode !== 'CUSTOM');
      updatePriceBreakdown();
    });
  });

  // Daily Range inputs
  const startD = document.getElementById('daily-start-date');
  const endD = document.getElementById('daily-end-date');
  if (startD && endD) {
    startD.value = state.dailyStartDate;
    endD.value = state.dailyEndDate;
    startD.addEventListener('change', (e) => { state.dailyStartDate = e.target.value; updatePriceBreakdown(); });
    endD.addEventListener('change', (e) => { state.dailyEndDate = e.target.value; updatePriceBreakdown(); });
  }

  // Custom Day Add
  document.getElementById('btn-add-custom-date')?.addEventListener('click', () => {
    const dVal = document.getElementById('custom-single-date')?.value || state.selectedCalendarDate;
    if (!state.customDailyDates.includes(dVal)) {
      state.customDailyDates.push(dVal);
      renderCustomDailyChips();
      updatePriceBreakdown();
      showToast('تاریخ به روزهای انتخابی اضافه شد.');
    }
  });

  // Default initial slot for demo
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
    container.innerHTML = `<span class="empty-slot-msg">هنوز روزی اضافه نشده است.</span>`;
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

  // Catering Category Filter Pills
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
      const s = state.dailyStartDate ? new Date(state.dailyStartDate) : null;
      const e = state.dailyEndDate ? new Date(state.dailyEndDate) : null;
      if (s && e && !isNaN(s) && !isNaN(e)) {
        const diff = Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1;
        duration = Math.max(1, diff);
        scheduleSummaryText = `${toPersianDigits(duration)} روز پیوسته`;
      } else {
        duration = 1;
        scheduleSummaryText = `۱ روز`;
      }
      const rangeDaysEl = document.getElementById('daily-range-days-count');
      if (rangeDaysEl) rangeDaysEl.innerText = `${toPersianDigits(duration)} روز`;
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
      showToast(`کد تخفیف ${code} با موفقیت اعمال شد.`);
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

// 11. Booking Submission & Official Invoice Receipt
function setupSubmitBooking() {
  const btnSubmit = document.getElementById('btn-submit-booking');
  btnSubmit?.addEventListener('click', () => {
    const custName = document.getElementById('cust-name')?.value?.trim();
    const custPhone = document.getElementById('cust-phone')?.value?.trim();

    if (!custName || !custPhone) {
      showToast('لطفاً نام و شماره همراه خود را وارد فرمایید.', 'error');
      document.getElementById('cust-name')?.focus();
      return;
    }

    const space = state.spaces.find(s => s.key === state.selectedSpaceKey);
    const units = state.selectedSpaceKey === 'SHARED_DESK' ? state.deskCount : 1;
    const resId = `RES-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    const invId = `INV-${Date.now().toString().slice(-6)}`;

    const totalStr = document.getElementById('summary-final-total')?.innerText || '۰ تومان';
    const status = state.selectedSpaceKey === 'CONFERENCE_HALL' ? 'در انتظار بررسی' : 'تأیید شده';

    const newReservation = {
      id: resId,
      invoiceNumber: invId,
      spaceKey: state.selectedSpaceKey,
      spaceName: space ? space.name : 'فضای کار',
      customerName: custName,
      customerPhone: custPhone,
      totalPrice: totalStr,
      status,
      date: state.selectedCalendarLabel,
      createdAt: new Date().toLocaleDateString('fa-IR')
    };

    // Save
    const currentList = getStoredReservations();
    currentList.unshift(newReservation);
    saveStoredReservations(currentList);

    // Show Invoice Modal
    showInvoiceModal(newReservation);
    showToast('رزرو شما با موفقیت ثبت شد!');
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
    <div style="background:var(--input-bg); padding:16px; border-radius:var(--radius-sm); margin-bottom:16px;">
      <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
        <span>شناسه پیگیری فاکتور:</span>
        <strong style="color:var(--primary);">${res.invoiceNumber}</strong>
      </div>
      <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
        <span>عنوان فضا:</span>
        <strong>${res.spaceName}</strong>
      </div>
      <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
        <span>متقاضی:</span>
        <strong>${res.customerName} (${toPersianDigits(res.customerPhone)})</strong>
      </div>
      <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
        <span>تاریخ ثبت:</span>
        <strong>${res.createdAt}</strong>
      </div>
      <div style="display:flex; justify-content:space-between; border-top:1px solid var(--card-border); padding-top:8px;">
        <span>مبلغ کل پرداختی:</span>
        <strong style="color:var(--accent); font-size:18px;">${res.totalPrice}</strong>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
}

// 12. My Reservations Tab
function renderMyReservations() {
  const tbody = document.getElementById('my-reservations-tbody');
  if (!tbody) return;

  const list = getStoredReservations();
  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:30px; color:var(--text-muted);">هنوز رزروی ثبت نکرده‌اید.</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(r => `
    <tr>
      <td><code>${r.id}</code></td>
      <td><strong>${r.spaceName}</strong></td>
      <td>${r.date}</td>
      <td style="color:var(--accent); font-weight:700;">${r.totalPrice}</td>
      <td><span class="badge-availability">${r.status}</span></td>
      <td><button type="button" class="btn-card-select" onclick="viewReceipt('${r.id}')">مشاهده رسید</button></td>
    </tr>
  `).join('');
}

window.viewReceipt = function(id) {
  const list = getStoredReservations();
  const res = list.find(r => r.id === id);
  if (res) showInvoiceModal(res);
};

// 13. Admin & CMS Tools
function renderAdminPanel() {
  const tbody = document.getElementById('reservations-tbody');
  if (!tbody) return;

  const list = getStoredReservations();
  tbody.innerHTML = list.map(r => `
    <tr>
      <td><code>${r.id}</code></td>
      <td>${r.spaceName}</td>
      <td>${r.customerName}</td>
      <td>${r.date}</td>
      <td style="color:var(--accent); font-weight:700;">${r.totalPrice}</td>
      <td><span class="badge-availability">${r.status}</span></td>
      <td>
        <button type="button" class="btn-step" onclick="deleteReservation('${r.id}')" title="حذف">🗑️</button>
      </td>
    </tr>
  `).join('');

  document.getElementById('btn-refresh-reservations')?.addEventListener('click', () => {
    renderAdminPanel();
    showToast('فهرست رزروها به‌روزرسانی شد.');
  });
}

window.deleteReservation = function(id) {
  let list = getStoredReservations();
  list = list.filter(r => r.id !== id);
  saveStoredReservations(list);
  renderAdminPanel();
  showToast('رزرو حذف شد.');
};

// 14. Financial & Analytics Dashboard
function renderAnalyticsDashboard() {
  const list = getStoredReservations();
  let totalRev = 0;

  list.forEach(r => {
    const raw = String(r.totalPrice).replace(/[^0-9]/g, '');
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
