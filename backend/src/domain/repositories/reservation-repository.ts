export interface Reservation {
  id: string;
  eventId: string;
  userId: string;
  seatId: string;
}

export interface ReservationRepository {
  create(params: {
    eventId: string;
    userId: string;
    seatId: string;
  }): Promise<Reservation>;

  findByEventAndSeat(eventId: string, seatId: string): Promise<Reservation | null>;
  findByEventAndUser(eventId: string, userId: string): Promise<Reservation | null>;
  deleteByEventAndUser(eventId: string, userId: string): Promise<void>;

  seatBelongsToEvent(eventId: string, seatId: string): Promise<boolean>;

  switchSeat(params: {
    eventId: string;
    userId: string;
    newSeatId: string;
  }): Promise<Reservation>;
}
