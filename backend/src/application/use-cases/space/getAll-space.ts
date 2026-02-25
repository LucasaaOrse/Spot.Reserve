import { Space } from "../../../domain/entities/space";
import type { SpaceRepository } from "../../../domain/repositories/space-repository";

export class GetAllSpace {
  constructor(private spaceRepository: SpaceRepository) {}

  async execute(): Promise<Space[]> {
    const spaces = await this.spaceRepository.findAll();

    return spaces.map((data) => Space.create({
      name: data.name,
      locationId: data.locationId,
      totalArea: data.totalArea ?? null
    }));
  }
}