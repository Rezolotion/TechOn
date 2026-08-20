import { PromoRepository } from '../repositories/PromoRepository.js';

export class PromoService {
  constructor(repository = new PromoRepository()) {
    this.repository = repository;
  }

  validateAndCalculateDiscount(code, subtotal, spaceKey) {
    if (!code) {
      return { valid: false, discountAmount: 0, reason: 'کد تخفیف وارد نشده است' };
    }

    const promo = this.repository.findByCode(code.toUpperCase().trim());
    if (!promo) {
      return { valid: false, discountAmount: 0, reason: 'کد تخفیف نامعتبر یا منقضی شده است' };
    }

    if (promo.validSpaces && !promo.validSpaces.includes(spaceKey)) {
      return { valid: false, discountAmount: 0, reason: 'این کد تخفیف برای این نوع فضا قابل استفاده نیست' };
    }

    if (promo.max_uses && promo.used_count >= promo.max_uses) {
      return { valid: false, discountAmount: 0, reason: 'ظرفیت استفاده از این کد تخفیف به پایان رسیده است' };
    }

    let discountAmount = 0;
    if (promo.discountType === 'PERCENTAGE') {
      discountAmount = Math.round((subtotal * promo.discountValue) / 100);
      if (promo.maxDiscount && discountAmount > promo.maxDiscount) {
        discountAmount = promo.maxDiscount;
      }
    } else if (promo.discountType === 'FIXED') {
      discountAmount = Math.min(subtotal, promo.discountValue);
    }

    return {
      valid: true,
      code: promo.code,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      discountAmount,
      maxDiscount: promo.maxDiscount
    };
  }

  recordUsage(code) {
    this.repository.incrementUsage(code.toUpperCase().trim());
  }

  createPromo(promoData) {
    if (!promoData.code || !promoData.value) {
      throw new Error('کد و درصد/مقدار تخفیف الزامی است.');
    }
    return this.repository.createPromo({
      code: promoData.code.toUpperCase().trim(),
      discountType: promoData.type || 'PERCENTAGE',
      discountValue: Number(promoData.value),
      maxDiscount: promoData.maxDiscount ? Number(promoData.maxDiscount) : null,
      validSpaces: promoData.validSpaces || null,
      maxUses: promoData.maxUses ? Number(promoData.maxUses) : 100
    });
  }
}
