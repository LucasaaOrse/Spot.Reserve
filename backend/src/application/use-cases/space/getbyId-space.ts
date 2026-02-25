import { Space } from "../../../domain/entities/space";
import type { SpaceRepository } from "../../../domain/repositories/space-repository";

interface FindByIdSpaceRequest {
  id: string;
}

interface FindByIdSpaceResponse {
  space: Space
}

export class GetSpaceByIdUseCase {
  constructor(private spaceRepository: SpaceRepository) {}

  async execute({ id }: FindByIdSpaceRequest): Promise<FindByIdSpaceResponse> {
    const space = await this.spaceRepository.findById(id);

    if (!space) throw new Error("Space not found");

    return { space }; 
  }
}