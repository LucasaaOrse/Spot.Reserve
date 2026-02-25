import { AppError } from "../../errors/app-error";
import type { EventRepository } from "../../../domain/repositories/event-repository";


interface UpdateEventRequest {
  eventId: string;
  organizerId: string;
  title?: string | undefined;
  description?: string | null | undefined;
  date?: Date | undefined;
}

export class UpdateEventUseCase {
  constructor(private eventRepository: EventRepository) {}

  async execute({
    eventId,
    organizerId,
    title,
    description,
    date,
  }: UpdateEventRequest) {
    const event = await this.eventRepository.findById(eventId);

    if (!event) {
      throw new AppError("Evento não encontrado.", 404);
    }

    if (event.organizerId !== organizerId) {
      throw new AppError(
        "Acesso negado: evento não pertence ao organizador.",
        403
      );
    }

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