import { ListEventsByOrganizerUseCase } from "../../../application/use-cases/event/listByOrganizer-event";
import { PrismaEventRepository } from "../../../infra/database/prisma-event-repository";



export function makeListEvent() {
  const repository = new PrismaEventRepository();
    const useCase = new ListEventsByOrganizerUseCase(repository);
  return useCase;
}