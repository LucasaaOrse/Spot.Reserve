import type { EventRepository } from "../../../domain/repositories/event-repository";
import { AppError } from "../../errors/app-error";

interface DeleteEventRequest {
  eventId: string;
  organizerId: string;
}

export class DeleteEventUseCase {
  constructor(private eventRepository: EventRepository) {}

  async execute({ eventId, organizerId }: DeleteEventRequest) {
    const event = await this.eventRepository.findById(eventId);

    if (!event) {
      throw new AppError("Evento não encontrado.", 404);
    }

    // Garante que apenas o dono do evento pode deletar
    if (event.organizerId !== organizerId) {
      throw new AppError("Acesso negado: evento não pertence ao organizador.", 403);
    }

    await this.eventRepository.delete(eventId);
  }
}
