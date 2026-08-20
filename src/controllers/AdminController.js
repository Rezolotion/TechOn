export class AdminController {
  constructor(reservationService) {
    this.reservationService = reservationService;
  }

  getAllReservations(role) {
    const list = this.reservationService.getReservations();
    if (role === 'COWORKING_OPERATOR') {
      return { success: true, reservations: list.filter(r => r.spaceKey !== 'CONFERENCE_HALL') };
    } else if (role === 'CAFE_OPERATOR') {
      return { success: true, reservations: list.filter(r => r.spaceKey === 'CONFERENCE_HALL' || (r.catering && r.catering.length > 0)) };
    }
    return { success: true, reservations: list };
  }

  approveHall(id, role, username) {
    if (role !== 'SUPER_ADMIN' && role !== 'CAFE_OPERATOR') {
      throw new Error('عدم دسترسی به تأیید رویدادهای سالن همایش');
    }
    const updated = this.reservationService.approveHallEvent(id, username || 'admin');
    return { success: true, reservation: updated };
  }

  cancel(id, body, role, username) {
    const updated = this.reservationService.cancelReservation(id, body?.reason, username || role);
    return { success: true, reservation: updated };
  }

  getAnalytics(role) {
    if (role !== 'SUPER_ADMIN') {
      throw new Error('دسترسی به شاخص‌های مالی و گزارشات درآمد تنها برای سوپرادمین مجاز است.');
    }
    const analytics = this.reservationService.getFinancialAnalytics();
    return { success: true, ...analytics };
  }
}
