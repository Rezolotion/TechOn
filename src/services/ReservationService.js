import { SpaceTypes, ReservationStatus, PaymentStatus } from '../core/models.js';
import { Sanitizer } from '../security/sanitizer.js';

export class ReservationService {
  constructor(cateringService, promoService) {
    this.cateringService = cateringService;
    this.promoService = promoService;
    this.reservations = [];
    this.invoices = [];
    this.auditLogs = [];
  }

  logAudit(userId, action, resource, details = {}) {
    const log = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      userId: userId || 'anonymous',
      action,
      resource,
      details
    };
    this.auditLogs.push(log);
    return log;
  }

  checkAvailability(spaceKey, startTime, endTime) {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();

    if (isNaN(start) || isNaN(end) || start >= end) {
      throw new Error('بازه زمانی مشخص‌شده نامعتبر است');
    }

    const space = SpaceTypes[spaceKey];
    const maxCapacity = space?.count || 1;

    const conflicts = this.reservations.filter(r => {
      if (r.spaceKey !== spaceKey) return false;
      if (r.status === ReservationStatus.CANCELLED) return false;
      const rStart = new Date(r.startTime).getTime();
      const rEnd = new Date(r.endTime).getTime();
      return (start < rEnd && end > rStart);
    });

    return conflicts.length < maxCapacity;
  }

  createReservation(payload) {
    const sanitized = Sanitizer.sanitizeObject(payload);
    const {
      spaceKey,
      bookingType = 'HOURLY', // 'HOURLY' or 'DAILY'
      duration = 1, // hours or days
      startTime,
      endTime,
      customerName,
      customerPhone,
      customerEmail,
      eventTopic,
      targetAudienceCount,
      equipment = [],
      cateringOrders = [],
      promoCode
    } = sanitized;

    if (!Sanitizer.validateIranianPhone(customerPhone)) {
      throw new Error('شماره همراه وارد شده نامعتبر است (فرمت صحیح: ۰۹۱۲۳۴۵۶۷۸۹)');
    }

    const space = SpaceTypes[spaceKey];
    if (!space) {
      throw new Error('نوع فضای انتخاب شده نامعتبر است');
    }

    // Availability validation
    if (!this.checkAvailability(spaceKey, startTime, endTime)) {
      throw new Error('این فضا در بازه زمانی انتخاب شده قبلاً رزرو شده است');
    }

    // 1. Calculate Space Base Price
    const baseRate = bookingType === 'DAILY' ? space.dailyRate : space.hourlyRate;
    const spaceSubtotal = baseRate * Number(duration);

    // 2. Equipment Fees
    let equipmentFee = 0;
    const selectedEquipment = [];
    if (equipment.includes('recording')) {
      equipmentFee += 300000;
      selectedEquipment.push({ name: 'ضبط حرفه‌ای مراسم', fee: 300000 });
    }
    if (equipment.includes('sound_system')) {
      equipmentFee += 200000;
      selectedEquipment.push({ name: 'میکروفون بیسیم اضافی و اپراتور صدا', fee: 200000 });
    }

    // 3. Catering Calculation
    const cateringResult = this.cateringService.calculateCateringTotal(cateringOrders);

    // 4. Subtotal
    const subtotal = spaceSubtotal + equipmentFee + cateringResult.total;

    // 5. Promo Code Discount
    let discountAmount = 0;
    let promoDetails = null;
    if (promoCode) {
      const discountRes = this.promoService.validateAndCalculateDiscount(promoCode, subtotal, spaceKey);
      if (discountRes.valid) {
        discountAmount = discountRes.discountAmount;
        promoDetails = discountRes;
        this.promoService.recordUsage(promoCode);
      }
    }

    const finalTotal = Math.max(0, subtotal - discountAmount);

    const reservationId = `RES-${Date.now().toString().slice(-6)}`;
    const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;

    // Status logic: Conference hall requires review, others auto-confirm
    const initialStatus = spaceKey === 'CONFERENCE_HALL' 
      ? ReservationStatus.PENDING_REVIEW 
      : ReservationStatus.CONFIRMED;

    const reservation = {
      id: reservationId,
      spaceKey,
      spaceName: space.name,
      bookingType,
      duration,
      startTime,
      endTime,
      status: initialStatus,
      customer: {
        name: customerName,
        phone: customerPhone,
        email: customerEmail || '-'
      },
      eventDetails: spaceKey === 'CONFERENCE_HALL' ? {
        topic: eventTopic || 'همایش عمومی',
        audienceCount: targetAudienceCount || space.capacity,
        approved: false
      } : null,
      equipment: selectedEquipment,
      catering: cateringResult.detailedItems,
      pricing: {
        spaceSubtotal,
        equipmentFee,
        cateringSubtotal: cateringResult.total,
        subtotal,
        discountAmount,
        promoCode: promoDetails ? promoDetails.code : null,
        finalTotal
      },
      invoiceNumber,
      createdAt: new Date().toISOString()
    };

    const invoice = {
      invoiceNumber,
      reservationId,
      customer: reservation.customer,
      items: [
        { title: `رزرو ${space.name} (${duration} ${bookingType === 'DAILY' ? 'روز' : 'ساعت'})`, amount: spaceSubtotal },
        ...selectedEquipment.map(e => ({ title: e.name, amount: e.fee })),
        ...cateringResult.detailedItems.map(c => ({ title: `${c.name} (تعداد: ${c.quantity})`, amount: c.subtotal }))
      ],
      subtotal,
      discountAmount,
      finalTotal,
      paymentStatus: PaymentStatus.PAID, // Simulated gateway success
      paidAt: new Date().toISOString()
    };

    this.reservations.push(reservation);
    this.invoices.push(invoice);

    this.logAudit(customerPhone, 'CREATE_RESERVATION', reservationId, { spaceKey, finalTotal });

    return { reservation, invoice };
  }

  approveHallEvent(reservationId, approvedBy) {
    const reservation = this.reservations.find(r => r.id === reservationId);
    if (!reservation) throw new Error('رزرو یافت نشد');
    if (reservation.spaceKey !== 'CONFERENCE_HALL') throw new Error('این رزرو مربوط به سالن همایش نیست');
    
    reservation.status = ReservationStatus.CONFIRMED;
    if (reservation.eventDetails) reservation.eventDetails.approved = true;
    this.logAudit(approvedBy, 'APPROVE_HALL_EVENT', reservationId);
    return reservation;
  }

  cancelReservation(reservationId, reason, cancelledBy) {
    const reservation = this.reservations.find(r => r.id === reservationId);
    if (!reservation) throw new Error('رزرو یافت نشد');
    reservation.status = ReservationStatus.CANCELLED;
    reservation.cancellationReason = reason || 'لغو توسط کاربر/اپراتور';
    this.logAudit(cancelledBy, 'CANCEL_RESERVATION', reservationId, { reason });
    return reservation;
  }
}
