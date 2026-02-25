import { UpdateLocation } from "../../../application/use-cases/location/update-location";
import { PrismaLocationRepository } from "../../../infra/database/prisma-location-repository";

export function makeUpdateLocation() {
  const locationRepository = new PrismaLocationRepository();
  const updateLocation = new UpdateLocation(locationRepository);

  return updateLocation;
}