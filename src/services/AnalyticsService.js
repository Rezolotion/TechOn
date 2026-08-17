/**
 * TechOn Financial & Operational Analytics Service
 */

export class AnalyticsService {
  constructor(reservationService) {
    this.reservationService = reservationService;
  }

  getFinancialSummary() {
    const reservations = this.reservationService.reservations.filter(r => r.status !== 'CANCELLED');
    
    let totalRevenue = 0;
    let spaceRevenue = 0;
    let cateringRevenue = 0;
    let equipmentRevenue = 0;
    let totalDiscountsGiven = 0;

    const breakdownBySpace = {
      CONFERENCE_HALL: { count: 0, revenue: 0 },
      PRIVATE_OFFICE: { count: 0, revenue: 0 },
      DEDICATED_DESK: { count: 0, revenue: 0 },
      SHARED_DESK: { count: 0, revenue: 0 }
    };

    for (const res of reservations) {
      const p = res.pricing;
      totalRevenue += p.finalTotal;
      spaceRevenue += p.spaceSubtotal;
      cateringRevenue += p.cateringSubtotal;
      equipmentRevenue += p.equipmentFee;
      totalDiscountsGiven += p.discountAmount;

      if (breakdownBySpace[res.spaceKey]) {
        breakdownBySpace[res.spaceKey].count += 1;
        breakdownBySpace[res.spaceKey].revenue += p.spaceSubtotal;
      }
    }

    return {
      totalRevenue,
      spaceRevenue,
      cateringRevenue,
      equipmentRevenue,
      totalDiscountsGiven,
      totalReservationsCount: reservations.length,
      breakdownBySpace,
      auditLogsCount: this.reservationService.auditLogs.length
    };
  }
}
