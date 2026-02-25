// src/application/use-cases/event/update-event-use-case.ts

import type { EventRepository } from "../../../domain/repositories/event-repository";


interface UpdateEventRequest {
  eventId: string;
  title?: string | undefined;               // Adicione o | undefined explicitamente
  description?: string | null | undefined;   // Adicione o | undefined explicitamente
  date?: Date | undefined;                  // Adicione o | undefined explicitamente
}

export class UpdateEventUseCase {
  constructor(private eventRepository: EventRepository) {}

  async execute({ eventId, title, description, date }: UpdateEventRequest) {
    const event = await this.eventRepository.findById(eventId);

    if (!event) {
      throw new Error("Evento não encontrado.");
    }

    // Usando os métodos da classe em vez de atribuição direta
    if (title) {
      event.rename(title);
    }

    if (description !== undefined) {
      event.updateDescription(description);
    }

    if (date) {
      event.reschedule(date);
    }

    await this.eventRepository.save(event);

    return { event };
  }
}