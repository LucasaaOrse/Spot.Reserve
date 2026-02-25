import type { LocationRepository } from "../../../domain/repositories/location-repository";
import { Location } from "../../../domain/entities/location";

export class GetAllLocation {
  constructor(private locationRepository: LocationRepository) {}

  async execute(): Promise<{ locations: Location[] }> {
    const locations = await this.locationRepository.findAll();
    return { locations };
  }

  
}