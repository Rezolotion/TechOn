import { getDatabase } from '../db/database.js';
import { ReservationStatus } from '../core/models.js';

export class ReservationRepository {
  constructor(db = getDatabase()) {
    this.db = db;
  }

  create(reservationData, timeSlots = [], dailyDates = []) {
    const insertRes = this.db.prepare(`
      INSERT INTO reservations (
        id, space_key, space_name, booking_type, duration, schedule_description,
        start_time, end_time, status, customer_name, customer_phone, customer_email,
        event_topic, target_audience_count, space_subtotal, equipment_fee, catering_fee,
        subtotal, discount_amount, promo_code, final_total, invoice_number,
        equipment_json, catering_json, created_at
      ) VALUES (
        @id, @space_key, @space_name, @booking_type, @duration, @schedule_description,
        @start_time, @end_time, @status, @customer_name, @customer_phone, @customer_email,
        @event_topic, @target_audience_count, @space_subtotal, @equipment_fee, @catering_fee,
        @subtotal, @discount_amount, @promo_code, @final_total, @invoice_number,
        @equipment_json, @catering_json, @created_at
      )
    `);

    const insertSlot = this.db.prepare(`
      INSERT INTO reservation_time_slots (
        id, reservation_id, slot_date, date_label, start_time, end_time,
        start_time_str, end_time_str, hours, slot_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertDaily = this.db.prepare(`
      INSERT INTO reservation_daily_dates (
        id, reservation_id, date_str, date_label, date_order
      ) VALUES (?, ?, ?, ?, ?)
    `);

    const createTransaction = this.db.transaction(() => {
      insertRes.run({
        id: reservationData.id,
        space_key: reservationData.spaceKey,
        space_name: reservationData.spaceName,
        booking_type: reservationData.bookingType,
        duration: reservationData.duration,
        schedule_description: reservationData.scheduleDescription,
        start_time: reservationData.startTime,
        end_time: reservationData.endTime,
        status: reservationData.status,
        customer_name: reservationData.customer.name,
        customer_phone: reservationData.customer.phone,
        customer_email: reservationData.customer.email || null,
        event_topic: reservationData.eventDetails?.topic || null,
        target_audience_count: reservationData.eventDetails?.audienceCount || null,
        space_subtotal: reservationData.pricing.spaceSubtotal,
        equipment_fee: reservationData.pricing.equipmentFee || 0,
        catering_fee: reservationData.pricing.cateringSubtotal || 0,
        subtotal: reservationData.pricing.subtotal,
        discount_amount: reservationData.pricing.discountAmount || 0,
        promo_code: reservationData.pricing.promoCode || null,
        final_total: reservationData.pricing.finalTotal,
        invoice_number: reservationData.invoiceNumber,
        equipment_json: JSON.stringify(reservationData.equipment || []),
        catering_json: JSON.stringify(reservationData.catering || []),
        created_at: reservationData.createdAt || new Date().toISOString()
      });

      // Insert slots if any
      if (Array.isArray(timeSlots)) {
        timeSlots.forEach((slot, index) => {
          insertSlot.run(
            slot.id || `slot-${Date.now()}-${index}`,
            reservationData.id,
            slot.date,
            slot.dateLabel || slot.date,
            slot.startTime,
            slot.endTime,
            slot.startTimeStr || null,
            slot.endTimeStr || null,
            slot.hours,
            index
          );
        });
      }

      // Insert daily dates if any
      if (Array.isArray(dailyDates)) {
        dailyDates.forEach((dateStr, index) => {
          insertDaily.run(
            `daily-${Date.now()}-${index}`,
            reservationData.id,
            dateStr,
            dateStr,
            index
          );
        });
      }
    });

    createTransaction();
    return this.findById(reservationData.id);
  }

  findById(id) {
    const row = this.db.prepare('SELECT * FROM reservations WHERE id = ?').get(id);
    if (!row) return null;
    return this._hydrateReservation(row);
  }

  findByPhone(phone) {
    const rows = this.db.prepare('SELECT * FROM reservations WHERE customer_phone = ? ORDER BY created_at DESC').all(phone);
    return rows.map(r => this._hydrateReservation(r));
  }

  findAll() {
    const rows = this.db.prepare('SELECT * FROM reservations ORDER BY created_at DESC').all();
    return rows.map(r => this._hydrateReservation(r));
  }

  findActiveBySpace(spaceKey) {
    const rows = this.db.prepare(`
      SELECT * FROM reservations
      WHERE space_key = ? AND status != ?
      ORDER BY start_time ASC
    `).all(spaceKey, ReservationStatus.CANCELLED);

    return rows.map(r => this._hydrateReservation(r));
  }

  updateStatus(id, status, reason = null) {
    if (reason) {
      this.db.prepare('UPDATE reservations SET status = ?, cancellation_reason = ? WHERE id = ?').run(status, reason, id);
    } else {
      this.db.prepare('UPDATE reservations SET status = ? WHERE id = ?').run(status, id);
    }
    return this.findById(id);
  }

  _hydrateReservation(row) {
    const slots = this.db.prepare(`
      SELECT * FROM reservation_time_slots WHERE reservation_id = ? ORDER BY slot_order ASC
    `).all(row.id);

    const dailyDates = this.db.prepare(`
      SELECT * FROM reservation_daily_dates WHERE reservation_id = ? ORDER BY date_order ASC
    `).all(row.id);

    return {
      id: row.id,
      spaceKey: row.space_key,
      spaceName: row.space_name,
      bookingType: row.booking_type,
      duration: row.duration,
      scheduleDescription: row.schedule_description,
      startTime: row.start_time,
      endTime: row.end_time,
      status: row.status,
      cancellationReason: row.cancellation_reason,
      customer: {
        name: row.customer_name,
        phone: row.customer_phone,
        email: row.customer_email || '-'
      },
      eventDetails: row.space_key === 'CONFERENCE_HALL' ? {
        topic: row.event_topic || 'همایش عمومی',
        audienceCount: row.target_audience_count || 70,
        approved: row.status === ReservationStatus.CONFIRMED
      } : null,
      equipment: JSON.parse(row.equipment_json || '[]'),
      catering: JSON.parse(row.catering_json || '[]'),
      pricing: {
        spaceSubtotal: row.space_subtotal,
        equipmentFee: row.equipment_fee,
        cateringSubtotal: row.catering_fee,
        subtotal: row.subtotal,
        discountAmount: row.discount_amount,
        promoCode: row.promo_code,
        finalTotal: row.final_total
      },
      timeSlots: slots.map(s => ({
        id: s.id,
        date: s.slot_date,
        dateLabel: s.date_label,
        startTime: s.start_time,
        endTime: s.end_time,
        startTimeStr: s.start_time_str,
        endTimeStr: s.end_time_str,
        hours: s.hours
      })),
      dailySchedule: dailyDates.length > 0 ? {
        mode: 'CUSTOM_DAYS',
        dates: dailyDates.map(d => d.date_str),
        daysCount: dailyDates.length
      } : null,
      invoiceNumber: row.invoice_number,
      createdAt: row.created_at
    };
  }

  getFinancialSummary() {
    const activeRows = this.db.prepare(`
      SELECT * FROM reservations WHERE status != ?
    `).all(ReservationStatus.CANCELLED);

    let totalRevenue = 0;
    let cateringRevenue = 0;
    let spaceRevenue = 0;
    let equipmentRevenue = 0;
    let totalDiscountsGiven = 0;
    const breakdownBySpace = {};

    for (const r of activeRows) {
      totalRevenue += r.final_total;
      cateringRevenue += r.catering_fee;
      spaceRevenue += r.space_subtotal;
      equipmentRevenue += r.equipment_fee;
      totalDiscountsGiven += r.discount_amount;

      if (!breakdownBySpace[r.space_key]) {
        breakdownBySpace[r.space_key] = { count: 0, revenue: 0 };
      }
      breakdownBySpace[r.space_key].count += 1;
      breakdownBySpace[r.space_key].revenue += r.space_subtotal;
    }

    const contractorShare10 = Math.round(totalRevenue * 0.10);
    const contractorShare15 = Math.round(totalRevenue * 0.15);

    return {
      financials: {
        totalRevenue,
        cateringRevenue,
        spaceRevenue,
        equipmentRevenue,
        totalDiscountsGiven,
        totalReservations: activeRows.length,
        breakdownBySpace
      },
      revenueShare: {
        contractorShare10,
        contractorShare15,
        formula: '۱۰ الی ۱۵ درصد از کل مبالغ فروش ثبت شده'
      }
    };
  }
}
