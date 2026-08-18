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
    key: 'CONFERENCE_HALL',
    name: 'سالن همایش و رویداد تکان',
    count: 1,
    capacity: 70,
    hourlyRate: 1500000, // Tomans / Hour
    dailyRate: 10000000,  // Tomans / Day
    features: ['پروژکتور 4K', 'سیستم صوتی استودیویی', 'استیج و تریبون', 'نورپردازی تخصصی', 'اینترنت فیبر نوری اختصاصی']
  },
  MEETING_ROOM: {
    id: 'meeting-room-1',
    key: 'MEETING_ROOM',
    name: 'اتاق جلسه و ویدیوکنفرانس',
    count: 1,
    capacity: 12,
    hourlyRate: 250000,
    dailyRate: 1600000,
    features: ['نمایشگر ۶۵ اینچ 4K', 'تخته وایت‌برد شیشه‌ای', 'تجهیزات کنفرانس آنلاین', 'پذیرایی جلسه']
  },
  PRIVATE_OFFICE: {
    id: 'office-private',
    key: 'PRIVATE_OFFICE',
    name: 'اتاق کار اختصاصی تیم (۴ اتاق)',
    count: 4,
    capacity: 6,
    hourlyRate: 350000,
    dailyRate: 2400000,
    features: ['۴ اتاق کار مجزا', 'تخته وایت‌برد', 'میز کنفرانس کوچک', 'کمد کلیددار اختصاصی']
  },
  SHARED_DESK: {
    id: 'desk-shared',
    key: 'SHARED_DESK',
    name: 'صندلی کار اشتراکی (۶۰ صندلی)',
    count: 60,
    capacity: 1,
    hourlyRate: 40000,
    dailyRate: 250000,
    features: ['۶۰ صندلی استاندارد', 'صندلی ارگونومیک', 'پریز اختصاصی', 'اینترنت پرسرعت', 'چای و قهوه رایگان']
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

export const DemoUsers = Object.freeze([
  {
    id: 'user-admin',
    username: 'admin',
    password: 'admin123',
    name: 'مهندس نیامنش (سوپرادمین)',
    phone: '09121111111',
    role: UserRoles.SUPER_ADMIN,
    title: 'مدیریت ارشد پلتفرم'
  },
  {
    id: 'user-cowork',
    username: 'cowork_op',
    password: 'cowork123',
    name: 'علی کاظمی (اپراتور اشتراکی)',
    phone: '09122222222',
    role: UserRoles.COWORKING_OPERATOR,
    title: 'مسئول فضای کار و میزها'
  },
  {
    id: 'user-cafe',
    username: 'cafe_op',
    password: 'cafe123',
    name: 'سارا تهرانی (اپراتور سالن و کافه)',
    phone: '09123333333',
    role: UserRoles.CAFE_OPERATOR,
    title: 'مسئول تشریفات و همایش‌ها'
  },
  {
    id: 'user-cust',
    username: 'customer',
    password: 'cust123',
    name: 'مریم رضایی (کاربر / مشتری)',
    phone: '09124444444',
    role: UserRoles.CUSTOMER,
    title: 'مشتری پلتفرم'
  }
]);

