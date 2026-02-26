import type { EventRepository } from "../../../domain/repositories/event-repository";
import type { LocationRepository } from "../../../domain/repositories/location-repository";
import type { EventTableRepository, EventTableWithSeatsInput } from "../../../domain/repositories/event-table-repository";
import { AppError } from "../../errors/app-error";

interface TableRequest {
  name: string;
  coord_x: number;
  coord_y: number;
}

interface CreateEventTablesRequest {
  eventId: string;
  organizerId: string; // adicionado para verificar ownership
  tables: TableRequest[];
}

export class CreateEventTablesUseCase {
  constructor(
    private eventRepository: EventRepository,
    private locationRepository: LocationRepository,
    private tableRepository: EventTableRepository
  ) {}

  async execute({ eventId, organizerId, tables }: CreateEventTablesRequest) {
    // 1. Busca o evento
    const event = await this.eventRepository.findById(eventId);
    if (!event) {
      throw new AppError("Evento não encontrado.", 404);
    }

    // 2. Verifica se o organizador é dono do evento
    if (event.organizerId !== organizerId) {
      throw new AppError("Acesso negado: evento não pertence ao organizador.", 403);
    }

    // 3. Busca as regras de capacidade da location
    const location = await this.locationRepository.findById(event.locationId);
    if (!location) {
      throw new AppError("Configurações da localidade não encontradas.", 404);
    }

    // 4. Valida limite de mesas
    const existingTablesCount = await this.tableRepository.countByEventId(eventId);
    const totalTablesAfterCreation = existingTablesCount + tables.length;

    if (totalTablesAfterCreation > location.maxTables) {
      throw new AppError(
        `Capacidade excedida. O local permite no máximo ${location.maxTables} mesas. Já existem ${existingTablesCount}.`,
        400
      );
    }

    // 5. Cria mesas com assentos automáticos
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
      seatsPerTable: location.maxSeatsPerTable,
      totalTables: totalTablesAfterCreation,
      maxTables: location.maxTables,
    };
  }
}
