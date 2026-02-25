import { UpdateSpace } from "../../../application/use-cases/space/update-space";
import { PrismaSpaceRepository } from "../../../infra/database/prisma-space-repository";

export function makeUpdateSpace() {
  const spaceRepository = new PrismaSpaceRepository();
  const updateSpace = new UpdateSpace(spaceRepository);

  return updateSpace
}