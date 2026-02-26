import type { ReservationRepository } from "../../../domain/repositories/reservation-repository";
import type { InvitationRepository } from "../../../domain/repositories/invitation-repository";
import { AppError } from "../../errors/app-error";

interface CancelReservationRequest {
  eventId: string;
  userId: string;
}

export class CancelReservationUseCase {
  constructor(
    private invitationRepository: InvitationRepository,
    private reservationRepository: ReservationRepository
  ) {}

  async execute({ eventId, userId }: CancelReservationRequest) {
    // Verifica se o usuário tem convite aceito no evento
    const acceptedInvitation = await this.invitationRepository.findAcceptedByGuestAndEvent(
      userId,
      eventId
    );

    if (!acceptedInvitation) {
      throw new AppError("Usuário não possui convite aceito para este evento.", 403);
    }

    // Verifica se tem reserva para cancelar
    const reservation = await this.reservationRepository.findByEventAndUser(eventId, userId);

    if (!reservation) {
      throw new AppError("Nenhuma reserva encontrada para cancelar.", 404);
    }

    await this.reservationRepository.deleteByEventAndUser(eventId, userId);
  }
}
