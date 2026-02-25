import { CreateSpace } from "../../../application/use-cases/space/create-space";
import { PrismaSpaceRepository } from "../../../infra/database/prisma-space-repository";

export function makeCreateSpace() {
  const spaceRepository = new PrismaSpaceRepository();
  const createSpace = new CreateSpace(spaceRepository);

  return createSpace
}