// src/application/use-cases/event/get-event-by-id-use-case.ts

import type { EventRepository } from "../../../domain/repositories/event-repository";

interface Request {
  eventId: string;
}

export class GetEventByIdUseCase {
  constructor(private eventRepository: EventRepository) {}

  async execute({ eventId }: Request) {
    const event = await this.eventRepository.findById(eventId);

    if (!event) {
      throw new Error("Evento não encontrado.");
    }

    return { event };
  }
}