import type { InvitationRepository } from "../../../domain/repositories/invitation-repository";
import type { ReservationRepository } from "../../../domain/repositories/reservation-repository";
import { AppError } from "../../errors/app-error";

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
      throw new AppError(
        "Usuário não possui convite aceito para este evento.",
        403
      );
    }

    const seatBelongsToEvent = await this.reservationRepository.seatBelongsToEvent(
      eventId,
      seatId
    );

    if (!seatBelongsToEvent) {
      throw new AppError("Assento inválido para este evento.", 400);
    }

    const alreadyTaken = await this.reservationRepository.findByEventAndSeat(
      eventId,
      seatId
    );

    if (alreadyTaken) {
      throw new AppError("Este assento já está ocupado.", 409);
    }

    const existingReservation = await this.reservationRepository.findByEventAndUser(
      eventId,
      userId
    );

    if (existingReservation) {
      throw new AppError("Usuário já possui reserva neste evento.", 409);
    }

    try {
      const reservation = await this.reservationRepository.create({
        eventId,
        userId,
        seatId,
      });

    return { reservation };
    } catch {
      throw new AppError(
        "Não foi possível concluir a reserva. O assento pode ter acabado de ser ocupado.",
        409
      );
    }
  }
}
