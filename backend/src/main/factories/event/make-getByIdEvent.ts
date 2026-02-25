import { GetEventByIdUseCase } from "../../../application/use-cases/event/getById-event";
import { PrismaEventRepository } from "../../../infra/database/prisma-event-repository";


export function makeGetEventByIdUseCase() {
  const repository = new PrismaEventRepository();
  const useCase = new GetEventByIdUseCase(repository);

  return useCase;
}