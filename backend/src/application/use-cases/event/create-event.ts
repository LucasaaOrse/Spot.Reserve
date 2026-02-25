import { Event } from "../../../domain/entities/event";
import type { EventRepository } from "../../../domain/repositories/event-repository";

interface CreateEventRequest {
  title: string;
  description?: string | null;
  date: Date;
  organizerId: string;
  locationId: string;
}

interface CreateEventResponse {
  event: Event;
}

export class CreateEventUseCase {
  constructor(private eventRepository: EventRepository) {}

  async execute(request: CreateEventRequest): Promise<CreateEventResponse> {
    // REGRA DE NEGÓCIO:
    // Verificar se a location já está ocupada nesta data
    const isLocationOccupied = await this.eventRepository.findByLocationAndDate(
      request.locationId,
      request.date
    );

    if (isLocationOccupied) {
      throw new Error(
        "Esta location já possui um evento agendado para esta data."
      );
    }

    // Criar entidade
    const event = new Event({
      title: request.title,
      description: request.description ?? null,
      date: request.date,
      organizerId: request.organizerId,
      locationId: request.locationId,
    });

    await this.eventRepository.create(event);

    return { event };
  }
}