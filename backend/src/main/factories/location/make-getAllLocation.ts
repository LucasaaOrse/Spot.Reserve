import { GetAllLocation } from "../../../application/use-cases/location/getAll-location";
import { PrismaLocationRepository } from "../../../infra/database/prisma-location-repository";

export function makeListLocations() {
  const locationRepository = new PrismaLocationRepository();
  const createLocation = new GetAllLocation(locationRepository);

  return createLocation;
}