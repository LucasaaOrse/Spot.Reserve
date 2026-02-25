

import { GetLocation } from "../../../application/use-cases/location/getById-location";
import { PrismaLocationRepository } from "../../../infra/database/prisma-location-repository";

export function makeListLocations() {
  const locationRepository = new PrismaLocationRepository();
  const getLocation = new GetLocation(locationRepository);

  return getLocation;
}