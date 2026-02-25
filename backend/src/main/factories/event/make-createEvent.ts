import { CreateEventUseCase } from "../../../application/use-cases/event/create-event";
import { PrismaEventRepository } from "../../../infra/database/prisma-event-repository";

export function makeCreateEventUseCase() {
  const eventRepository = new PrismaEventRepository();
  const createEventUseCase = new CreateEventUseCase(eventRepository);

  return createEventUseCase;
}