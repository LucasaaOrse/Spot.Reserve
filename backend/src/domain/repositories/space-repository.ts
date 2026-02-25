import { Space } from "../entities/space";

export interface SpaceRepository {
  create(space: Space): Promise<void>;
  findById(id: string): Promise<Space | null>;
  findByLocationId(locationId: string): Promise<Space[]>;
  findAll(): Promise<Space[]>;
  update(space: Space): Promise<void>;
  delete(id: string): Promise<void>;
}