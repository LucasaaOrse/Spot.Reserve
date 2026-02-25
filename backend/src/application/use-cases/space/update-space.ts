import { Space } from "../../../domain/entities/space";
import type { SpaceRepository } from "../../../domain/repositories/space-repository";

interface UpdateSpaceRequest {
  id: string;
  name?: string;
  locationId?: string;
  totalArea?: number;
}

export class UpdateSpace {
  constructor(private spaceRepository: SpaceRepository) {}

  async execute({ id, name, locationId, totalArea }: UpdateSpaceRequest) {
    const space = await this.spaceRepository.findById(id);

    if (!space) {
      throw new Error("Space not found");
    }

   space.update({
  ...(name !== undefined && { name }),
  ...(locationId !== undefined && { locationId }),
  ...(totalArea !== undefined && { totalArea }),
});

    await this.spaceRepository.update(space);

    return { space };
  }
}