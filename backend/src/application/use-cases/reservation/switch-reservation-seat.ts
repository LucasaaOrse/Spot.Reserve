import type { InvitationRepository } from "../../../domain/repositories/invitation-repository";
import type { ReservationRepository } from "../../../domain/repositories/reservation-repository";
import { AppError } from "../../errors/app-error";

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
      throw new AppError(
        "Usuário não possui convite aceito para este evento.",
        403
      );
    }

    const seatBelongsToEvent = await this.reservationRepository.seatBelongsToEvent(
      eventId,
      newSeatId
    );

    if (!seatBelongsToEvent) {
      throw new AppError("Assento inválido para este evento.", 400);
    }

    const seatAlreadyTaken = await this.reservationRepository.findByEventAndSeat(
      eventId,
      newSeatId
    );

    if (seatAlreadyTaken && seatAlreadyTaken.userId !== userId) {
      throw new AppError("Este assento já está ocupado.", 409);
    }

    try {
      const reservation = await this.reservationRepository.switchSeat({
        eventId,
        userId,
        newSeatId,
      });

    return { reservation };
    } catch {
      throw new AppError(
        "Não foi possível trocar o assento. Tente novamente.",
        409
      );
    }
  }
}
