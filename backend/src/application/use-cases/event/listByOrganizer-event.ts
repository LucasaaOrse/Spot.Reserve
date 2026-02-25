// src/application/use-cases/event/list-events-by-organizer-use-case.ts

import type { EventRepository } from "../../../domain/repositories/event-repository";

interface Request {
  organizerId: string;
}

export class ListEventsByOrganizerUseCase {
  constructor(private eventRepository: EventRepository) {}

  async execute({ organizerId }: Request) {
    const events =
      await this.eventRepository.findManyByOrganizerId(organizerId);

    return { events };
  }
}