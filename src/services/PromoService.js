/**
 * Promo Code & Discount Service
 */

export class PromoService {
  constructor() {
    this.promoCodes = new Map([
      ['TECHON2026', {
        code: 'TECHON2026',
        type: 'PERCENTAGE',
        value: 20, // 20%
        maxDiscount: 500000, // Max 500,000 Tomans
        usageLimit: 100,
        usedCount: 12,
        expiresAt: '2026-12-31T23:59:59Z',
        applicableTo: ['ALL']
      }],
      ['EVENT50', {
        code: 'EVENT50',
        type: 'FIXED',
        value: 500000, // 500,000 Tomans
        maxDiscount: 500000,
        usageLimit: 50,
        usedCount: 5,
        expiresAt: '2026-12-31T23:59:59Z',
        applicableTo: ['CONFERENCE_HALL']
      }],
      ['STARTUP', {
        code: 'STARTUP',
        type: 'PERCENTAGE',
        value: 15,
        maxDiscount: 300000,
        usageLimit: 200,
        usedCount: 45,
        expiresAt: '2026-12-31T23:59:59Z',
        applicableTo: ['ALL']
      }]
    ]);
  }

  createPromoCode(data) {
    const code = data.code.toUpperCase().trim();
    if (this.promoCodes.has(code)) {
      throw new Error('کد تخفیف با این نام قبلاً ایجاد شده است');
    }
    const promo = {
      code,
      type: data.type || 'PERCENTAGE', // PERCENTAGE or FIXED
      value: Number(data.value),
      maxDiscount: Number(data.maxDiscount) || Infinity,
      usageLimit: Number(data.usageLimit) || 100,
      usedCount: 0,
      expiresAt: data.expiresAt || '2026-12-31T23:59:59Z',
      applicableTo: data.applicableTo || ['ALL']
    };
    this.promoCodes.set(code, promo);
    return promo;
  }

  validateAndCalculateDiscount(rawCode, subtotal, spaceType = 'ALL') {
    if (!rawCode) return { discountAmount: 0, valid: false, reason: 'کد وارد نشده است' };
    const code = rawCode.toUpperCase().trim();
    const promo = this.promoCodes.get(code);

    if (!promo) {
      return { discountAmount: 0, valid: false, reason: 'کد تخفیف معتبر نیست' };
    }

    if (new Date() > new Date(promo.expiresAt)) {
      return { discountAmount: 0, valid: false, reason: 'مهلت استفاده از این کد تخفیف به پایان رسیده است' };
    }

    if (promo.usedCount >= promo.usageLimit) {
      return { discountAmount: 0, valid: false, reason: 'سقف استفاده از این کد تخفیف تکمیل شده است' };
    }

    if (!promo.applicableTo.includes('ALL') && !promo.applicableTo.includes(spaceType)) {
      return { discountAmount: 0, valid: false, reason: 'این کد تخفیف برای این نوع فضا قابل اعمال نیست' };
    }

    let calculatedDiscount = 0;
    if (promo.type === 'PERCENTAGE') {
      calculatedDiscount = (subtotal * promo.value) / 100;
      if (promo.maxDiscount && calculatedDiscount > promo.maxDiscount) {
        calculatedDiscount = promo.maxDiscount;
      }
    } else if (promo.type === 'FIXED') {
      calculatedDiscount = Math.min(promo.value, subtotal);
    }

    return {
      valid: true,
      code: promo.code,
      discountAmount: Math.round(calculatedDiscount),
      discountType: promo.type,
      discountValue: promo.value
    };
  }

  recordUsage(code) {
    const promo = this.promoCodes.get(code.toUpperCase().trim());
    if (promo) {
      promo.usedCount += 1;
    }
  }
}
