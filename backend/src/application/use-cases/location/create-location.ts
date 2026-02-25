import { Location } from "../../../domain/entities/location";
import type { LocationRepository } from "../../../domain/repositories/location-repository";

interface CreateLocationRequest {
  name: string;
  address: string;
  maxTables: number;
  maxSeatsPerTable: number;
}

interface CreateLocationResponse {
  location: Location;
}


export class CreateLocation {
  constructor(private locationRepository: LocationRepository) {}

  async execute({
    name,
    address,
    maxTables,
    maxSeatsPerTable,
  }: CreateLocationRequest): Promise<CreateLocationResponse> {

    // 1️⃣ Cria a entidade (roda validações automaticamente)
    const location = new Location({
      name,
      address,
      maxTables,
      maxSeatsPerTable,
    });

    // 2️⃣ Persiste via repositório
    await this.locationRepository.create(location);

    // 3️⃣ Retorna entidade criada
    return { location };
  }
}