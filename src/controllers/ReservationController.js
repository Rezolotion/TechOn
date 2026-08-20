export class ReservationController {
  constructor(reservationService) {
    this.reservationService = reservationService;
  }

  createReservation(body) {
    return this.reservationService.createReservation(body);
  }

  getMyReservations(phone) {
    const list = this.reservationService.getReservations(phone);
    return { success: true, reservations: list };
  }
}
