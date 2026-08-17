/**
 * TechOn Core Domain Models & Constants
 */

export const UserRoles = Object.freeze({
  SUPER_ADMIN: 'SUPER_ADMIN',
  COWORKING_OPERATOR: 'COWORKING_OPERATOR',
  CAFE_OPERATOR: 'CAFE_OPERATOR',
  CUSTOMER: 'CUSTOMER'
});

export const SpaceTypes = Object.freeze({
  CONFERENCE_HALL: {
    id: 'hall-main',
    name: 'سالن همایش و رویداد تکان',
    capacity: 70,
    hourlyRate: 1500000, // Tomans / Hour
    dailyRate: 10000000,  // Tomans / Day
    features: ['پروژکتور 4K', 'سیستم صوتی استودیویی', 'استیج و تریبون', 'نورپردازی تخصصی', 'اینترنت فیبر نوری اختصاصی']
  },
  PRIVATE_OFFICE: {
    id: 'office-private',
    name: 'اتاق کار اختصاصی تیم ۴-۶ نفره',
    capacity: 6,
    hourlyRate: 350000,
    dailyRate: 2400000,
    features: ['تخته وایت‌برد', 'میز کنفرانس کوچک', 'کمد اختصاصی']
  },
  DEDICATED_DESK: {
    id: 'desk-dedicated',
    name: 'صندلی اختصاصی (ماهانه/روزانه)',
    capacity: 1,
    hourlyRate: 60000,
    dailyRate: 400000,
    features: ['پریز اختصاصی', 'صندلی ارگونومیک', 'کمد کلیددار']
  },
  SHARED_DESK: {
    id: 'desk-shared',
    name: 'صندلی اشتراکی (فلکسیبل)',
    capacity: 1,
    hourlyRate: 40000,
    dailyRate: 250000,
    features: ['دسترسی به فضای عمومی', 'اینترنت پرسرعت', 'چای و قهوه رایگان']
  }
});

export const ReservationStatus = Object.freeze({
  PENDING_REVIEW: 'PENDING_REVIEW', // مخصوص همایش‌ها جهت تایید موضوع رویداد
  CONFIRMED: 'CONFIRMED',
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
});

export const PaymentStatus = Object.freeze({
  UNPAID: 'UNPAID',
  PAID: 'PAID',
  REFUNDED: 'REFUNDED',
  FAILED: 'FAILED'
});
