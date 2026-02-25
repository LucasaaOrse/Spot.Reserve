import type { EventRepository } from "../../../domain/repositories/event-repository";

export class GetEventLayoutUseCase {
  constructor(private eventRepository: EventRepository) {}

  async execute(eventId: string) {
    const event = await this.eventRepository.getEventLayout(eventId);

    if (!event) {
      throw new Error("Evento não encontrado.");
    }

    // Mapeamos os dados para simplificar a vida do Frontend
    return {
      event: {
        id: event.id,
        title: event.title,
        date: event.date,
        location: event.location,
        tables: event.tables.map((table) => ({
          id: table.id,
          name: table.name,
          x: table.coord_x,
          y: table.coord_y,
          seats: table.seats.map((seat) => ({
            id: seat.id,
            label: seat.label,
            // Se houver qualquer reserva para este assento, ele está ocupado
            isOccupied: seat.reservations.length > 0,
          })),
        })),
      },
    };
  }
}