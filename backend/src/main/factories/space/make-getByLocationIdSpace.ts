import { GetByLocationIdSpace } from "../../../application/use-cases/space/getByLocationId-space";
import { PrismaSpaceRepository } from "../../../infra/database/prisma-space-repository";

export function makeGetByLocationIdSpace() {
  const spaceRepository = new PrismaSpaceRepository();
  const getByLocationIdSpace = new GetByLocationIdSpace(spaceRepository);

  return getByLocationIdSpace;
}
