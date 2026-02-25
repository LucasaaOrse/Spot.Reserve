import { Location } from "../entities/location";

export interface LocationRepository {
  create(location: Location): Promise<void>;
  findById(id: string): Promise<Location | null>;
  findAll(): Promise<Location[]>;
  update(location: Location): Promise<void>;
  delete(id: string): Promise<void>;
}