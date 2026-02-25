import { Space } from "../../../domain/entities/space";
import type { SpaceRepository } from "../../../domain/repositories/space-repository";

interface CreateSpaceRequest {
  name: string;
  locationId: string;
  totalArea?: number | null;
}

interface CreateSpaceResponse {
  space: Space;
}

export class CreateSpace {
  constructor(private spaceRepository: SpaceRepository) {}

  async execute({ name, locationId, totalArea }: CreateSpaceRequest): Promise<CreateSpaceResponse> {
    const space = new Space({
      name,
      locationId,
      totalArea: totalArea ?? null
    })
    await this.spaceRepository.create(space);
    return { space };
  }

}

