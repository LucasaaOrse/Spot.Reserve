import { UpdateEventUseCase } from "../../../application/use-cases/event/update-event"; 
import { PrismaEventRepository } from "../../../infra/database/prisma-event-repository";

export function makeUpdateEvent() {
  const eventRepository = new PrismaEventRepository();
  const useCase = new UpdateEventUseCase(eventRepository);
  return useCase;
}