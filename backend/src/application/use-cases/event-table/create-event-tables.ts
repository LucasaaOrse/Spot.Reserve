import type { EventRepository } from "../../../domain/repositories/event-repository";
import type { LocationRepository } from "../../../domain/repositories/location-repository";
import type { EventTableRepository, EventTableWithSeatsInput } from "../../../domain/repositories/event-table-repository";

interface TableRequest {
  name: string;
  coord_x: number;
  coord_y: number;
}

interface CreateEventTablesRequest {
  eventId: string;
  tables: TableRequest[];
}

export class CreateEventTablesUseCase {
  constructor(
    private eventRepository: EventRepository,
    private locationRepository: LocationRepository, // Adicionado aqui
    private tableRepository: EventTableRepository
  ) {}

  async execute({ eventId, tables }: CreateEventTablesRequest) {
    // 1. Busca o evento para pegar o locationId
    const event = await this.eventRepository.findById(eventId);
    if (!event) {
      throw new Error("Evento não encontrado.");
    }

    // 2. Busca a localidade para pegar as regras de capacidade (maxTables, maxSeats)
    const location = await this.locationRepository.findById(event.locationId);
    if (!location) {
      throw new Error("Configurações da localidade não encontradas.");
    }

    // 3. Valida o limite de mesas
    const existingTablesCount = await this.tableRepository.countByEventId(eventId);
    const totalTablesAfterCreation = existingTablesCount + tables.length;

    if (totalTablesAfterCreation > location.maxTables) {
      throw new Error(
        `Capacidade excedida. O local permite no máximo ${location.maxTables} mesas.`
      );
    }

    // 4. Prepara a criação das mesas com assentos automáticos
    const tablesWithSeats: EventTableWithSeatsInput[] = tables.map((table) => {
      const seats = Array.from({ length: location.maxSeatsPerTable }, (_, i) => ({
        label: `Assento ${i + 1}`,
      }));

      return {
        eventId,
        name: table.name,
        coord_x: table.coord_x,
        coord_y: table.coord_y,
        seats,
      };
    });

    await this.tableRepository.createManyWithSeats(tablesWithSeats);

    return { 
      count: tables.length,
      seatsPerTable: location.maxSeatsPerTable 
    };
  }
}