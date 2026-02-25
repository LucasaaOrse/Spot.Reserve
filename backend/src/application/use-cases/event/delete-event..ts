// src/application/use-cases/event/delete-event-use-case.ts

import type { EventRepository } from "../../../domain/repositories/event-repository";

interface Request {
  eventId: string;
}

export class DeleteEventUseCase {
  constructor(private eventRepository: EventRepository) {}

  async execute({ eventId }: Request) {
    const event = await this.eventRepository.findById(eventId);

    if (!event) {
      throw new Error("Evento não encontrado.");
    }

    await this.eventRepository.delete(eventId);
  }
}