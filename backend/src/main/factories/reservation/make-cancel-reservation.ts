import { CancelReservationUseCase } from "../../../application/use-cases/reservation/cancel-reservation";
import { PrismaInvitationRepository } from "../../../infra/database/prisma-invitation-repository";
import { PrismaReservationRepository } from "../../../infra/database/prisma-reservation-repository";

export function makeCancelReservationUseCase() {
  const invitationRepository = new PrismaInvitationRepository();
  const reservationRepository = new PrismaReservationRepository();

  return new CancelReservationUseCase(invitationRepository, reservationRepository);
}
