import { DeleteEventUseCase } from "../../../application/use-cases/event/delete-event";
import { PrismaEventRepository } from "../../../infra/database/prisma-event-repository";

export function makeDeleteEventUseCase() {
  const eventRepository = new PrismaEventRepository();
  return new DeleteEventUseCase(eventRepository);
}
