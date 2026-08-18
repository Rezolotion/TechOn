/**
 * TechOn Platform - Core Client Application
 * Handles online booking, dynamic catering calculation, promo validation,
 * admin operations, and financial analytics.
 */

// Application State
const state = {
  currentUserRole: 'SUPER_ADMIN',
  spaces: [],
  cateringMenu: [],
  selectedSpaceKey: 'CONFERENCE_HALL',
  cateringOrders: {}, // itemId -> count
  appliedPromo: null,
  reservations: [],
  invoices: []
};

// Utilities
function formatCurrency(amount) {
  if (!amount && amount !== 0) return '۰ تومان';
  return Number(amount).toLocaleString('fa-IR') + ' تومان';
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerText = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 4000);
}

// API Client Helper
async function apiRequest(endpoint, method = 'GET', body = null) {
  const headers = {
    'Content-Type': 'application/json',
    'X-User-Role': state.currentUserRole
  };

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(endpoint, options);
  const data = await res.json();
  if (!res.ok && !data.success && !data.valid) {
    throw new Error(data.message || data.error || 'خطا در برقراری ارتباط با سرور');
  }
  return data;
}

// 1. Initialize Tabs & Roles
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

      if (tab.dataset.tab === 'admin') loadAdminData();
      if (tab.dataset.tab === 'analytics') loadAnalyticsData();
    });
  });

  const roleSelect = document.getElementById('role-select');
  roleSelect.addEventListener('change', (e) => {
    state.currentUserRole = e.target.value;
    showToast(`سطح دسترسی به ${e.target.options[e.target.selectedIndex].text} تغییر یافت.`);
    // Reload active tab data
    const activeTab = document.querySelector('.nav-tab.active').dataset.tab;
    if (activeTab === 'admin') loadAdminData();
    if (activeTab === 'analytics') loadAnalyticsData();
  });
}

// 2. Fetch Spaces Catalog
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
    return `
      <div class="space-item ${isSelected}" data-key="${s.key}">
        <div class="space-item-header">
          <span class="space-name">${s.name}</span>
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

// 3. Fetch Catering Menu
async function loadCateringMenu() {
  try {
    const data = await apiRequest('/api/catering/menu');
    state.cateringMenu = data.menu || [];
    renderCateringBookingSelector();
    renderCateringCatalogGrid();
  } catch (err) {
    showToast('خطا در دریافت منوی پذیرایی', 'error');
  }
}

function renderCateringBookingSelector() {
  const container = document.getElementById('catering-booking-list');
  if (!container) return;

  container.innerHTML = state.cateringMenu.map(item => {
    const qty = state.cateringOrders[item.id] || 0;
    return `
      <div class="catering-order-item">
        <div class="cat-item-info">
          <strong>${item.name}</strong>
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

  container.innerHTML = state.cateringMenu.map(item => {
    return `
      <div class="cat-card">
        <div class="cat-card-header">
          <h4>${item.name}</h4>
          <span class="badge badge-primary">${item.category}</span>
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

// 4. Live Pricing & Summary Engine
function updatePriceBreakdown() {
  const space = state.spaces.find(s => s.key === state.selectedSpaceKey);
  const bookingType = document.getElementById('booking-type').value;
  const duration = Number(document.getElementById('duration').value) || 1;

  // 1. Space Base Subtotal
  let spaceSubtotal = 0;
  if (space) {
    const rate = bookingType === 'DAILY' ? space.dailyRate : space.hourlyRate;
    spaceSubtotal = rate * duration;
  }

  // 2. Equipment Fees
  let equipFee = 0;
  if (state.selectedSpaceKey === 'CONFERENCE_HALL') {
    if (document.getElementById('equip-recording')?.checked) equipFee += 300000;
    if (document.getElementById('equip-sound')?.checked) equipFee += 200000;
  }

  // 3. Catering Subtotal
  let cateringSubtotal = 0;
  for (const [itemId, count] of Object.entries(state.cateringOrders)) {
    const item = state.cateringMenu.find(i => i.id === itemId);
    if (item && count > 0) {
      cateringSubtotal += item.price * count;
    }
  }

  const subtotal = spaceSubtotal + equipFee + cateringSubtotal;

  // 4. Discount
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

  // Update UI Elements
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

// 5. Promo Code Validation
function setupPromoEngine() {
  const btnApply = document.getElementById('btn-apply-promo');
  const promoInput = document.getElementById('promo-input');
  const feedback = document.getElementById('promo-feedback');

  btnApply.addEventListener('click', async () => {
    const code = promoInput.value.trim();
    if (!code) {
      feedback.innerText = 'لطفاً کد تخفیف را وارد کنید.';
      feedback.className = 'promo-feedback text-danger';
      return;
    }

    try {
      // Calculate current subtotal
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

// 6. Submit Reservation & Invoice Modal
function setupBookingSubmission() {
  const submitBtn = document.getElementById('btn-submit-booking');
  submitBtn.addEventListener('click', async () => {
    const custName = document.getElementById('cust-name').value.trim();
    const custPhone = document.getElementById('cust-phone').value.trim();
    const custEmail = document.getElementById('cust-email').value.trim();
    const bookingType = document.getElementById('booking-type').value;
    const duration = Number(document.getElementById('duration').value) || 1;
    const startTime = document.getElementById('start-datetime').value;
    const endTime = document.getElementById('end-datetime').value;

    if (!custName || !custPhone || !startTime || !endTime) {
      showToast('لطفاً تمامی فیلدهای الزامی (نام، همراه و بازه زمانی) را تکمیل کنید.', 'error');
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
    submitBtn.innerText = 'در حال ثبت و صدور فاکتور...';

    try {
      const response = await apiRequest('/api/reservations', 'POST', payload);
      showToast('رزرو شما با موفقیت ثبت شد!');
      displayInvoiceModal(response.invoice, response.reservation);
      // Reset form options
      state.cateringOrders = {};
      state.appliedPromo = null;
      renderCateringBookingSelector();
      updatePriceBreakdown();
    } catch (err) {
      showToast(`خطا در ثبت رزرو: ${err.message}`, 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerText = '💳 ثبت نهایی و صدور فاکتور';
    }
  });
}

function displayInvoiceModal(invoice, reservation) {
  const modal = document.getElementById('invoice-modal');
  const content = document.getElementById('invoice-content');

  content.innerHTML = `
    <div class="invoice-receipt">
      <div class="invoice-meta">
        <div><strong>شماره فاکتور:</strong> ${invoice.invoiceNumber}</div>
        <div><strong>شماره رزرو:</strong> ${invoice.reservationId}</div>
      </div>
      <div class="invoice-meta">
        <div><strong>نام مشتری:</strong> ${invoice.customer.name}</div>
        <div><strong>تلفن:</strong> ${invoice.customer.phone}</div>
      </div>
      <div class="invoice-meta">
        <div><strong>وضعیت سفارش:</strong> 
          <span class="badge ${reservation.status === 'CONFIRMED' ? 'badge-success' : 'badge-warning'}">
            ${reservation.status === 'CONFIRMED' ? 'تأیید شده' : 'در انتظار تایید موضوع توسط اپراتور'}
          </span>
        </div>
      </div>

      <table class="invoice-items-table">
        <thead>
          <tr>
            <th>شرح خدمات</th>
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
          <span>تخفیف:</span>
          <strong>- ${formatCurrency(invoice.discountAmount)}</strong>
        </div>
      ` : ''}
      <div class="summary-divider"></div>
      <div class="summary-total-line">
        <span>مبلغ نهایی پرداختی:</span>
        <strong class="total-amount">${formatCurrency(invoice.finalTotal)}</strong>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');

  document.getElementById('btn-close-invoice').onclick = () => modal.classList.add('hidden');
  document.getElementById('btn-done-invoice').onclick = () => modal.classList.add('hidden');
}

// 7. Admin & Operator Panel
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
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:1.5rem; color:var(--text-secondary);">هنوز رزروی ثبت نشده است.</td></tr>`;
    return;
  }

  tbody.innerHTML = state.reservations.map(r => {
    const isHall = r.spaceKey === 'CONFERENCE_HALL';
    const isPending = r.status === 'PENDING_REVIEW';
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
          ${isPending ? `
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

  // Add Catering Form
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

  // Add Promo Form
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

// 8. Financial Analytics & Revenue Share Tab
async function loadAnalyticsData() {
  try {
    const data = await apiRequest('/api/admin/analytics');
    const f = data.financials || {};
    const rev = data.revenueShare || {};

    document.getElementById('metric-total-rev').innerText = formatCurrency(f.totalRevenue);
    document.getElementById('metric-contractor-share').innerText = `${formatCurrency(rev.contractorShare10)} الی ${formatCurrency(rev.contractorShare15)}`;
    document.getElementById('metric-catering-rev').innerText = formatCurrency(f.cateringRevenue);
    document.getElementById('metric-discounts').innerText = formatCurrency(f.totalDiscountsGiven);

    // Space Breakdown
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

    // Audit logs
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

// Default Start/End Dates helper (today + 2 hours)
function setDefaultDateTimes() {
  const now = new Date();
  now.setMinutes(0, 0, 0);
  const start = new Date(now.getTime() + 3600000); // 1 hr later
  const end = new Date(now.getTime() + 3 * 3600000); // 3 hrs later

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
  setupNavigation();
  setDefaultDateTimes();
  await loadSpaces();
  await loadCateringMenu();
  setupPromoEngine();
  setupBookingSubmission();
  setupAdminForms();
  toggleHallFields();
  updatePriceBreakdown();

  // Listeners for live price changes
  document.getElementById('booking-type')?.addEventListener('change', updatePriceBreakdown);
  document.getElementById('duration')?.addEventListener('input', updatePriceBreakdown);
  document.getElementById('equip-recording')?.addEventListener('change', updatePriceBreakdown);
  document.getElementById('equip-sound')?.addEventListener('change', updatePriceBreakdown);
});
