import type { LocationRepository } from "../../../domain/repositories/location-repository";
import { Location } from "../../../domain/entities/location";

export class GetLocation {
  constructor(private locationRepository: LocationRepository) {}

  async execute(id: string): Promise<{ location: Location }> {
    const location = await this.locationRepository.findById(id);

    if (!location) {
      throw new Error("Location not found");
    }

    return { location };
  }
}