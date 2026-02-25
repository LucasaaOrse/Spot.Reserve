import type { InvitationRepository } from "../../../domain/repositories/invitation-repository";
import type { ReservationRepository } from "../../../domain/repositories/reservation-repository";

interface CreateReservationRequest {
  eventId: string;
  userId: string;
  seatId: string;
}

export class CreateReservationUseCase {
  constructor(
    private invitationRepository: InvitationRepository,
    private reservationRepository: ReservationRepository
  ) {}

  async execute({ eventId, userId, seatId }: CreateReservationRequest) {
    const acceptedInvitation =
      await this.invitationRepository.findAcceptedByGuestAndEvent(userId, eventId);

    if (!acceptedInvitation) {
      throw new Error("Usuário não possui convite aceito para este evento.");
    }

    const seatBelongsToEvent = await this.reservationRepository.seatBelongsToEvent(
      eventId,
      seatId
    );

    if (!seatBelongsToEvent) {
      throw new Error("Assento inválido para este evento.");
    }

    const alreadyTaken = await this.reservationRepository.findByEventAndSeat(
      eventId,
      seatId
    );

    if (alreadyTaken) {
      throw new Error("Este assento já está ocupado.");
    }

    const existingReservation = await this.reservationRepository.findByEventAndUser(
      eventId,
      userId
    );

    if (existingReservation) {
      throw new Error("Usuário já possui reserva neste evento.");
    }

    const reservation = await this.reservationRepository.create({
      eventId,
      userId,
      seatId,
    });

    return { reservation };
  }
}
