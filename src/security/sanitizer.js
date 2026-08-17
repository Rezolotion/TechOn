/**
 * Security Sanitization & Validation Module
 */

export class Sanitizer {
  static cleanString(input) {
    if (typeof input !== 'string') return '';
    return input
      .trim()
      .replace(/[<>]/g, '') // Strip basic HTML tags
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '');
  }

  static validateIranianPhone(phone) {
    const cleaned = String(phone).replace(/\s|-/g, '');
    const regex = /^(\+98|0)?9\d{9}$/;
    return regex.test(cleaned);
  }

  static validatePromoCode(code) {
    if (!code || typeof code !== 'string') return false;
    return /^[A-Za-z0-9_-]{3,20}$/.test(code.trim());
  }

  static sanitizeObject(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    const sanitized = Array.isArray(obj) ? [] : {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = this.cleanString(value);
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }
}
