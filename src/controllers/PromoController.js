export class PromoController {
  constructor(promoService) {
    this.promoService = promoService;
  }

  validatePromo(body) {
    const { code, subtotal, spaceKey } = body;
    return this.promoService.validateAndCalculateDiscount(code, Number(subtotal), spaceKey);
  }

  createPromo(body) {
    const promo = this.promoService.createPromo(body);
    return { success: true, promo };
  }
}
