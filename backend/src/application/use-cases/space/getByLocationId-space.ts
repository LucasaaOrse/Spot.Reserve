import { Space } from "../../../domain/entities/space";
import type { SpaceRepository } from "../../../domain/repositories/space-repository";

interface GetByLocationIdSpaceRequest {
  locationId: string;
}
interface GetByLocationIdSpaceResponse {
  spaces: Space[];
}

export class GetByLocationIdSpace {
  constructor(private spaceRepository: SpaceRepository) {}
  async execute({ locationId }: GetByLocationIdSpaceRequest): Promise<GetByLocationIdSpaceResponse> {
    const spaces = await this.spaceRepository.findByLocationId(locationId);
    return { spaces }; 
  }
}