import { CreateReservationUseCase } from "../../../application/use-cases/reservation/create-reservation";
import { PrismaInvitationRepository } from "../../../infra/database/prisma-invitation-repository";
import { PrismaReservationRepository } from "../../../infra/database/prisma-reservation-repository";

export function makeCreateReservationUseCase() {
  const invitationRepository = new PrismaInvitationRepository();
  const reservationRepository = new PrismaReservationRepository();

  return new CreateReservationUseCase(invitationRepository, reservationRepository);
}