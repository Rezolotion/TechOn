import { ReservationStatus, PaymentStatus } from '../core/models.js';
import { Sanitizer } from '../security/sanitizer.js';
import { SpaceRepository } from '../repositories/SpaceRepository.js';
import { ReservationRepository } from '../repositories/ReservationRepository.js';
import { AuditRepository } from '../repositories/AuditRepository.js';

export class ReservationService {
  constructor(
    cateringService,
    promoService,
    spaceRepo = new SpaceRepository(),
    resRepo = new ReservationRepository(),
    auditRepo = new AuditRepository()
  ) {
    this.cateringService = cateringService;
    this.promoService = promoService;
    this.spaceRepo = spaceRepo;
    this.resRepo = resRepo;
    this.auditRepo = auditRepo;
  }

  logAudit(userId, action, resource, details = {}) {
    return this.auditRepo.log(userId, action, resource, details);
  }

  checkAvailability(spaceKey, startTimeOrIntervals, possibleEndTime) {
    let intervals = [];

    if (Array.isArray(startTimeOrIntervals)) {
      intervals = startTimeOrIntervals.map(i => ({
        start: new Date(i.startTime).getTime(),
        end: new Date(i.endTime).getTime()
      }));
    } else if (startTimeOrIntervals && possibleEndTime) {
      intervals = [{
        start: new Date(startTimeOrIntervals).getTime(),
        end: new Date(possibleEndTime).getTime()
      }];
    } else if (startTimeOrIntervals && typeof startTimeOrIntervals === 'object' && startTimeOrIntervals.startTime) {
      intervals = [{
        start: new Date(startTimeOrIntervals.startTime).getTime(),
        end: new Date(startTimeOrIntervals.endTime).getTime()
      }];
    }

    if (intervals.length === 0) return true;

    for (const inv of intervals) {
      if (isNaN(inv.start) || isNaN(inv.end) || inv.start >= inv.end) {
        throw new Error('بازه زمانی مشخص‌شده نامعتبر است');
      }
    }

    const space = this.spaceRepo.findByKey(spaceKey);
    const maxCapacity = space?.count || 1;

    // Query active reservations for this space from the SQLite database
    const existingReservations = this.resRepo.findActiveBySpace(spaceKey);

    const conflicts = existingReservations.filter(r => {
      const rIntervals = (r.timeSlots && r.timeSlots.length > 0)
        ? r.timeSlots.map(s => ({ start: new Date(s.startTime).getTime(), end: new Date(s.endTime).getTime() }))
        : (r.startTime && r.endTime ? [{ start: new Date(r.startTime).getTime(), end: new Date(r.endTime).getTime() }] : []);

      if (rIntervals.length === 0) return false;

      // Check if any interval in new request overlaps with any existing interval
      return intervals.some(newInv => {
        return rIntervals.some(existInv => {
          return (newInv.start < existInv.end && newInv.end > existInv.start);
        });
      });
    });

    return conflicts.length < maxCapacity;
  }

  createReservation(payload) {
    const sanitized = Sanitizer.sanitizeObject(payload);
    const {
      spaceKey,
      bookingType = 'HOURLY', // 'HOURLY' or 'DAILY'
      duration: rawDuration,
      startTime: rawStartTime,
      endTime: rawEndTime,
      timeSlots = [],
      dailySchedule = null,
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

    const space = this.spaceRepo.findByKey(spaceKey);
    if (!space) {
      throw new Error('نوع فضای انتخاب شده نامعتبر است');
    }

    // Determine normalized intervals and duration
    let duration = Number(rawDuration) || 1;
    let startTime = rawStartTime;
    let endTime = rawEndTime;
    let intervalsToCheck = [];
    let processedSlots = [];
    let processedDailyDates = [];

    if (bookingType === 'HOURLY' && Array.isArray(timeSlots) && timeSlots.length > 0) {
      intervalsToCheck = timeSlots.map(s => ({
        startTime: s.startTime,
        endTime: s.endTime
      }));
      duration = timeSlots.reduce((acc, s) => {
        const diffHours = (new Date(s.endTime).getTime() - new Date(s.startTime).getTime()) / 3600000;
        return acc + Math.max(0.5, Number(s.hours) || diffHours);
      }, 0);
      startTime = timeSlots[0].startTime;
      endTime = timeSlots[timeSlots.length - 1].endTime;
      processedSlots = timeSlots;
    } else if (bookingType === 'DAILY' && dailySchedule) {
      if (Array.isArray(dailySchedule.dates) && dailySchedule.dates.length > 0) {
        duration = dailySchedule.dates.length;
        intervalsToCheck = dailySchedule.dates.map(d => ({
          startTime: `${d}T08:00:00.000Z`,
          endTime: `${d}T22:00:00.000Z`
        }));
        startTime = `${dailySchedule.dates[0]}T08:00:00.000Z`;
        endTime = `${dailySchedule.dates[dailySchedule.dates.length - 1]}T22:00:00.000Z`;
        processedDailyDates = dailySchedule.dates;
      } else if (dailySchedule.startDate && dailySchedule.endDate) {
        const startD = new Date(dailySchedule.startDate);
        const endD = new Date(dailySchedule.endDate);
        const days = Math.round((endD - startD) / (1000 * 60 * 60 * 24)) + 1;
        duration = Math.max(1, days);
        startTime = `${dailySchedule.startDate}T08:00:00.000Z`;
        endTime = `${dailySchedule.endDate}T22:00:00.000Z`;
        intervalsToCheck = [{ startTime, endTime }];
      }
    } else {
      intervalsToCheck = [{ startTime, endTime }];
    }

    // Availability validation across all requested intervals against SQLite
    if (!this.checkAvailability(spaceKey, intervalsToCheck)) {
      throw new Error('این فضا در بازه زمانی یا روزهای انتخاب شده قبلاً رزرو شده است و امکان ثبت رزرو وجود ندارد.');
    }

    // 1. Calculate Space Base Price
    const baseRate = bookingType === 'DAILY' ? space.dailyRate : space.hourlyRate;
    const spaceSubtotal = Math.round(baseRate * duration);

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

    const reservationId = `RES-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Status logic: Conference hall requires review, others auto-confirm
    const initialStatus = spaceKey === 'CONFERENCE_HALL' 
      ? ReservationStatus.PENDING_REVIEW 
      : ReservationStatus.CONFIRMED;

    let scheduleDescription = `${duration} ${bookingType === 'DAILY' ? 'روز' : 'ساعت'}`;
    if (bookingType === 'HOURLY' && processedSlots.length > 1) {
      scheduleDescription = `${duration} ساعت در ${processedSlots.length} بازه زمانی`;
    } else if (bookingType === 'DAILY' && processedDailyDates.length > 1) {
      scheduleDescription = `${duration} روز انتخابی (${processedDailyDates.join(', ')})`;
    }

    const reservationToPersist = {
      id: reservationId,
      spaceKey,
      spaceName: space.name,
      bookingType,
      duration,
      scheduleDescription,
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

    // Save to Persistent SQLite Database
    const savedReservation = this.resRepo.create(reservationToPersist, processedSlots, processedDailyDates);

    const invoice = {
      invoiceNumber,
      reservationId,
      customer: savedReservation.customer,
      scheduleDescription,
      items: [
        { title: `رزرو ${space.name} (${scheduleDescription})`, amount: spaceSubtotal },
        ...selectedEquipment.map(e => ({ title: e.name, amount: e.fee })),
        ...cateringResult.detailedItems.map(c => ({ title: `${c.name} (تعداد: ${c.quantity})`, amount: c.subtotal }))
      ],
      subtotal,
      discountAmount,
      finalTotal,
      paymentStatus: PaymentStatus.PAID,
      paidAt: new Date().toISOString()
    };

    this.logAudit(customerPhone, 'CREATE_RESERVATION', reservationId, { spaceKey, finalTotal });

    return { reservation: savedReservation, invoice };
  }

  get reservations() {
    return this.resRepo ? this.resRepo.findAll() : [];
  }

  get auditLogs() {
    return this.auditRepo ? this.auditRepo.getRecentLogs(100) : [];
  }

  getReservations(filterPhone = null) {
    if (filterPhone) {
      return this.resRepo.findByPhone(filterPhone);
    }
    return this.resRepo.findAll();
  }

  getReservationById(id) {
    return this.resRepo.findById(id);
  }

  approveHallEvent(reservationId, approvedBy) {
    const reservation = this.resRepo.findById(reservationId);
    if (!reservation) throw new Error('رزرو یافت نشد');
    if (reservation.spaceKey !== 'CONFERENCE_HALL') throw new Error('این رزرو مربوط به سالن همایش نیست');
    
    const updated = this.resRepo.updateStatus(reservationId, ReservationStatus.CONFIRMED);
    this.logAudit(approvedBy, 'APPROVE_HALL_EVENT', reservationId);
    return updated;
  }

  cancelReservation(reservationId, reason, cancelledBy) {
    const reservation = this.resRepo.findById(reservationId);
    if (!reservation) throw new Error('رزرو یافت نشد');
    
    const updated = this.resRepo.updateStatus(reservationId, ReservationStatus.CANCELLED, reason || 'لغو توسط کاربر/اپراتور');
    this.logAudit(cancelledBy, 'CANCEL_RESERVATION', reservationId, { reason });
    return updated;
  }

  getFinancialAnalytics() {
    const summary = this.resRepo.getFinancialSummary();
    const recentLogs = this.auditRepo.getRecentLogs(30);
    return {
      ...summary,
      auditLogs: recentLogs
    };
  }
}
