import type { LocationRepository } from "../../../domain/repositories/location-repository";
import { Location } from "../../../domain/entities/location";

export class UpdateLocation {
  constructor(private locationRepository: LocationRepository) {}

  async execute(
    id: string,
    data: Partial<{
      name: string;
      address: string;
      maxTables: number;
      maxSeatsPerTable: number;
    }>
  ) {
    const location = await this.locationRepository.findById(id);

    if (!location) {
      throw new Error("Location not found");
    }

    location.update(data);

    await this.locationRepository.update(location);

    return { location };
  }
}