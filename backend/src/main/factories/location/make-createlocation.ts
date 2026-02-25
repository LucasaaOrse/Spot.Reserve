import { CreateLocation } from "../../../application/use-cases/location/create-location";
import { PrismaLocationRepository } from "../../../infra/database/prisma-location-repository";

export function makeCreateLocation() {
  const locationRepository = new PrismaLocationRepository();
  const createLocation = new CreateLocation(locationRepository);

  return createLocation;
}