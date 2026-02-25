import { GetEventLayoutUseCase } from "../../../application/use-cases/event/get-event-layout";
import { PrismaEventRepository } from "../../../infra/database/prisma-event-repository";

export function makeGetEventLayoutUseCase() {
  const eventRepository = new PrismaEventRepository();

  return new GetEventLayoutUseCase(eventRepository);
}