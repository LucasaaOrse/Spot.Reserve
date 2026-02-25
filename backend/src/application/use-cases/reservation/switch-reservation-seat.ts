import type { InvitationRepository } from "../../../domain/repositories/invitation-repository";
import type { ReservationRepository } from "../../../domain/repositories/reservation-repository";

interface SwitchReservationSeatRequest {
  eventId: string;
  userId: string;
  newSeatId: string;
}

export class SwitchReservationSeatUseCase {
  constructor(
    private invitationRepository: InvitationRepository,
    private reservationRepository: ReservationRepository
  ) {}

  async execute({
    eventId,
    userId,
    newSeatId,
  }: SwitchReservationSeatRequest) {
    const acceptedInvitation =
      await this.invitationRepository.findAcceptedByGuestAndEvent(userId, eventId);

    if (!acceptedInvitation) {
      throw new Error("Usuário não possui convite aceito para este evento.");
    }

    const seatBelongsToEvent = await this.reservationRepository.seatBelongsToEvent(
      eventId,
      newSeatId
    );

    if (!seatBelongsToEvent) {
      throw new Error("Assento inválido para este evento.");
    }

    const seatAlreadyTaken = await this.reservationRepository.findByEventAndSeat(
      eventId,
      newSeatId
    );

    if (seatAlreadyTaken && seatAlreadyTaken.userId !== userId) {
      throw new Error("Este assento já está ocupado.");
    }

    const reservation = await this.reservationRepository.switchSeat({
      eventId,
      userId,
      newSeatId,
    });

    return { reservation };
  }
}
