import { GetEventLayoutUseCase } from "../../../application/use-cases/event/get-event-layout";
import { PrismaEventRepository } from "../../../infra/database/prisma-event-repository";
import { PrismaReservationRepository } from "../../../infra/database/prisma-reservation-repository";

export function makeGetEventLayoutUseCase() {
  const eventRepository = new PrismaEventRepository();
  const reservationRepository = new PrismaReservationRepository();

  return new GetEventLayoutUseCase(eventRepository, reservationRepository);
}
