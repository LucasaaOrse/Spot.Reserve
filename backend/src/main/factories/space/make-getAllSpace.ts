import { GetAllSpace } from "../../../application/use-cases/space/getAll-space";
import { PrismaSpaceRepository } from "../../../infra/database/prisma-space-repository";

export function makeGetAllSpace(): GetAllSpace {
  const spaceRepository = new PrismaSpaceRepository();
  const getAllSpace = new GetAllSpace(spaceRepository);

  return getAllSpace
}