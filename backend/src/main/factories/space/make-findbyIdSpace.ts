import { GetSpaceByIdUseCase } from "../../../application/use-cases/space/getbyId-space";
import { PrismaSpaceRepository } from "../../../infra/database/prisma-space-repository";

export function makeGetSpaceByIdUseCase() {
  const spaceRepository = new PrismaSpaceRepository();
  const getSpaceByIdUseCase = new GetSpaceByIdUseCase(spaceRepository);

  return getSpaceByIdUseCase
}