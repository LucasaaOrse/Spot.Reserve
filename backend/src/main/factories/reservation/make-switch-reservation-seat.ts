import { SwitchReservationSeatUseCase } from "../../../application/use-cases/reservation/switch-reservation-seat";
import { PrismaInvitationRepository } from "../../../infra/database/prisma-invitation-repository";
import { PrismaReservationRepository } from "../../../infra/database/prisma-reservation-repository";

export function makeSwitchReservationSeatUseCase() {
  const invitationRepository = new PrismaInvitationRepository();
  const reservationRepository = new PrismaReservationRepository();

  return new SwitchReservationSeatUseCase(
    invitationRepository,
    reservationRepository
  );
}